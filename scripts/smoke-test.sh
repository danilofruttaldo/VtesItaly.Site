#!/usr/bin/env bash
#
# Post-deploy checks on the published site, run from outside the hosting
# (the CI runner, or a laptop).
#
# The deploy job only knows that tar exited 0. This checks what visitors get:
# that DNS and the hosting firewall let a request through, that every section
# was extracted (IT and EN), that the sitemap and robots.txt are there, and
# that Apache still answers the trailing-slash 301.
#
# Two kinds of checks:
#   FAIL   blocking: the deploy is broken or unreachable.
#   NOTE   report-only: known gaps in the server .htaccess (soft 404, cache
#          headers, security headers on redirects, legacy 301s). They print a
#          clear message and never fail the job until the .htaccess proposed
#          in docs/htaccess-proposta.md is live; then move them to `check`.
#
# Polite on purpose: about twenty requests, one at a time, with a short pause.
#
# Usage: scripts/smoke-test.sh [https://vtesitaly.com]

set -uo pipefail

BASE="${1:-https://vtesitaly.com}"
BASE="${BASE%/}"
UA="vtesitaly-smoke-test/1.0 (+https://github.com/danilofruttaldo/VtesItaly.Site)"
PAUSE=1
FAILED=0
NOTES=0

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

ok() { printf '  OK      %s\n' "$1"; }
fail() {
    printf '  FAIL    %s\n' "$1"
    FAILED=$((FAILED + 1))
}
note() {
    printf '  NOTE    %s\n' "$1"
    NOTES=$((NOTES + 1))
}

# The hosting firewall answers some clients with an interstitial page
# ("One moment, please...") instead of the site. Every other check would then
# fail with a misleading message, so it gets its own.
is_challenge() {
    grep -qi 'One moment, please' "$1"
}

# fetch URL NAME: body to $TMP/NAME.body, headers to $TMP/NAME.head, prints
# the status code. Retries only when no response arrives at all (000).
fetch() {
    local url="$1" name="$2" code=000 attempt
    for attempt in 1 2 3; do
        code=$(curl -s -A "$UA" --max-time 15 -o "$TMP/$name.body" -D "$TMP/$name.head" \
            -w '%{http_code}' "$url") || true
        [ "$code" != "000" ] && break
        [ "$attempt" -lt 3 ] && sleep 3
    done
    sleep "$PAUSE"
    echo "${code:-000}"
}

# header NAME HEADER: value of a response header (last occurrence), lowercase name match.
header() {
    tr -d '\r' < "$TMP/$1.head" | awk -v h="$(printf '%s' "$2" | tr '[:upper:]' '[:lower:]')" '
        { n = index($0, ":"); if (n > 0 && tolower(substr($0, 1, n - 1)) == h) v = substr($0, n + 2) }
        END { print v }'
}

echo "Smoke test on $BASE"

# --- Reachability --------------------------------------------------------
# Right after the extraction the first requests can be slow: retry the home
# a few times before giving up.
HOME_CODE=000
for attempt in 1 2 3; do
    HOME_CODE=$(fetch "$BASE/" home)
    [ "$HOME_CODE" = "200" ] && break
    echo "  attempt $attempt: home answered HTTP $HOME_CODE, retrying in 5 seconds..."
    sleep 5
done

if [ -s "$TMP/home.body" ] && is_challenge "$TMP/home.body"; then
    fail "the hosting firewall answered with its challenge page ('One moment, please') instead of the site (HTTP $HOME_CODE). The runner IP is being filtered: whitelist GitHub Actions or the smoke test user agent in the hosting firewall."
    echo "ERROR: site not reachable from this client, other checks skipped."
    exit 1
fi

if [ "$HOME_CODE" = "200" ] && grep -q '<html lang="it"' "$TMP/home.body"; then
    ok "home / answers 200 with the Italian page"
else
    fail "home / answered HTTP $HOME_CODE (expected 200 with <html lang=\"it\">)"
fi

# --- One page per section, IT and EN --------------------------------------
# Always with the trailing slash, the canonical form. If the extraction was
# cut short, or a collection stopped generating pages, the home alone would
# not notice.
page() {
    local path="$1" lang="$2" name code
    name=$(printf '%s' "$path" | tr '/' '_')
    code=$(fetch "$BASE$path" "p$name")
    if [ "$code" != "200" ]; then
        fail "$path answered HTTP $code (expected 200)"
    elif is_challenge "$TMP/p$name.body"; then
        fail "$path: firewall challenge page instead of the site"
    elif ! grep -q "<html lang=\"$lang\"" "$TMP/p$name.body"; then
        fail "$path answered 200 but is not the $lang page (soft 404 serving another page?)"
    else
        ok "$path answers 200 ($lang)"
    fi
}

page /principati/ it
page /tour/ it
page /grand-prix/ it
page /nazionale/ it
page /cartoline/ it
page /gemelli/ it
page /comunita/ it
page /en/ en
page /en/domains/ en
page /en/tour/ en
page /en/national-championship/ en
page /en/community/ en

# --- Files for crawlers ---------------------------------------------------
code=$(fetch "$BASE/sitemap-index.xml" sitemap)
if [ "$code" = "200" ] && grep -q '<sitemapindex' "$TMP/sitemap.body"; then
    ok "sitemap-index.xml answers 200"
else
    fail "sitemap-index.xml answered HTTP $code or is not a sitemap index"
fi

code=$(fetch "$BASE/robots.txt" robots)
if [ "$code" = "200" ] && grep -qi '^Sitemap: *https://vtesitaly.com/sitemap-index.xml' "$TMP/robots.body"; then
    ok "robots.txt answers 200 and points to the sitemap"
else
    fail "robots.txt answered HTTP $code or does not declare the sitemap"
fi

# --- A known 301 ------------------------------------------------------------
# Apache's mod_dir adds the trailing slash to directory URLs. If this stops,
# every link without the slash breaks.
code=$(fetch "$BASE/principati" slash)
location=$(header slash location)
if [ "$code" = "301" ] && [ "$location" = "$BASE/principati/" ]; then
    ok "/principati answers 301 to /principati/"
else
    fail "/principati answered HTTP $code to '$location' (expected 301 to $BASE/principati/)"
fi

# --- Report-only: known .htaccess gaps -------------------------------------
# Security headers should be set with `Header always set` so they also apply
# to redirects and errors.
if [ -n "$(header slash x-content-type-options)" ]; then
    ok "security headers are present on the 301 too"
else
    note "security headers (X-Content-Type-Options...) missing on the 301: the .htaccess uses 'Header set' instead of 'Header always set'. See docs/htaccess-proposta.md."
fi

# Legacy slugs are meta-refresh pages today (HTTP 200): search engines treat
# them as soft redirects. A real 301 belongs in the .htaccess.
code=$(fetch "$BASE/guide/archon-principi/" legacy)
if [ "$code" = "301" ]; then
    ok "legacy /guide/archon-principi/ answers 301"
else
    note "legacy /guide/archon-principi/ answered HTTP $code (meta refresh), not a 301. See docs/htaccess-proposta.md."
fi

# A missing URL must answer 404 with the site's error page. Today the
# .htaccess serves the home page with 200 (soft 404).
code=$(fetch "$BASE/pagina-che-non-esiste-smoke-test/" missing)
if [ "$code" = "404" ] && grep -q '<title>404' "$TMP/missing.body"; then
    ok "a missing URL answers 404 with the site's 404 page"
elif [ "$code" = "404" ]; then
    note "a missing URL answers 404, but not with the site's 404 page (ErrorDocument missing?)"
else
    note "a missing URL answered HTTP $code instead of 404: soft 404 in the server .htaccess (a fallback to index.html). See docs/htaccess-proposta.md."
fi

# Cache headers: HTML must revalidate, hashed assets can be cached for a year.
html_cc=$(header home cache-control)
case "$html_cc" in
    *no-cache* | *max-age=0*) ok "HTML Cache-Control: $html_cc" ;;
    *) note "HTML has Cache-Control '${html_cc:-none}' (expected no-cache). See docs/htaccess-proposta.md." ;;
esac

asset=$(grep -o '/_astro/[^"]*\.\(css\|js\)' "$TMP/home.body" | head -n 1)
if [ -n "$asset" ]; then
    code=$(fetch "$BASE$asset" asset)
    asset_cc=$(header asset cache-control)
    if [ "$code" != "200" ]; then
        fail "$asset (linked from the home) answered HTTP $code"
    else
        case "$asset_cc" in
            *immutable*) ok "$asset is 200, Cache-Control: $asset_cc" ;;
            *) note "$asset is 200 but Cache-Control is '${asset_cc:-none}' (expected 1 year, immutable). See docs/htaccess-proposta.md." ;;
        esac
    fi
else
    fail "no /_astro/ asset referenced from the home page"
fi

echo
[ "$NOTES" -gt 0 ] && echo "$NOTES report-only notes (not blocking)."
if [ "$FAILED" -gt 0 ]; then
    echo "ERROR: $FAILED checks failed."
    exit 1
fi
echo "All blocking checks passed."
