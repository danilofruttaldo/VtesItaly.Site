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
# Since 2026-10-16 the .htaccess is versioned in public/.htaccess and
# deployed with the site, so its behaviour is checked here too, all blocking:
# real 404s (IT and EN), cache headers, security headers on a 301, and the
# 301s for retired slugs and for paths of older site versions, and the 404
# (instead of Apache's 403) on directories without an index.
#
# Polite on purpose: about forty requests, one at a time, with a short pause.
# Bounded on purpose too: short per-request timeouts, one retry, and a global
# time budget, so a deploy job never hangs here (worst case about 3 minutes).
# If the home does not answer 200 the script stops at once: every other check
# would fail for the same reason.
#
# Usage: scripts/smoke-test.sh [https://vtesitaly.com]

set -uo pipefail

BASE="${1:-https://vtesitaly.com}"
BASE="${BASE%/}"
UA="vtesitaly-smoke-test/1.0 (+https://github.com/danilofruttaldo/VtesItaly.Site)"
PAUSE=1
FAILED=0
# Global budget in seconds: past it the run stops and fails.
BUDGET=170

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

ok() { printf '  OK      %s\n' "$1"; }
# Reported, never fails the run: not worth a rollback.
warn() { printf '  WARN    %s\n' "$1"; }
fail() {
    printf '  FAIL    %s\n' "$1"
    FAILED=$((FAILED + 1))
}

# The hosting firewall answers some clients with an interstitial page
# ("One moment, please...") instead of the site. Every other check would then
# fail with a misleading message, so it gets its own.
is_challenge() {
    grep -qi 'One moment, please' "$1"
}

# fetch URL NAME: body to $TMP/NAME.body, headers to $TMP/NAME.head, prints
# the status code. Retries once, only when no response arrives at all (000).
# Stops the whole run when the time budget is spent.
fetch() {
    local url="$1" name="$2" code=000 attempt
    if [ "$SECONDS" -ge "$BUDGET" ]; then
        echo "ERROR: time budget of ${BUDGET}s spent before $url, the site is too slow or unreachable." >&2
        exit 1
    fi
    for attempt in 1 2; do
        code=$(curl -s -A "$UA" --connect-timeout 5 --max-time 8 -o "$TMP/$name.body" -D "$TMP/$name.head" \
            -w '%{http_code}' "$url") || true
        [ "$code" != "000" ] && break
        [ "$attempt" -lt 2 ] && sleep 2
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

if [ "$HOME_CODE" != "200" ]; then
    fail "home / answered HTTP $HOME_CODE after 3 attempts (expected 200)"
    echo "ERROR: the home does not answer 200, other checks skipped."
    exit 1
fi

if grep -q '<html lang="it"' "$TMP/home.body"; then
    ok "home / answers 200 with the Italian page"
else
    fail "home / answered 200 but without <html lang=\"it\">"
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

# --- .htaccess behaviour (public/.htaccess, docs/htaccess.md) -------------
# Security headers are set with `Header always set`, so they apply to
# redirects and errors too.
if [ -n "$(header slash x-content-type-options)" ] && [ -n "$(header slash cross-origin-opener-policy)" ]; then
    ok "security headers are present on the 301 too"
else
    fail "security headers (X-Content-Type-Options, Cross-Origin-Opener-Policy) missing on the 301 of /principati: check 'Header always set' in public/.htaccess"
fi

# Apache advertises HTTP/2 with an Upgrade header on HTTP/1.1 answers;
# public/.htaccess removes it. Reported only: the site works either way.
if curl -sSI --http1.1 --max-time 20 "$BASE/" 2>/dev/null | grep -qi '^upgrade:'; then
    warn "the home still sends an Upgrade header over HTTP/1.1: check 'Header unset Upgrade' in public/.htaccess"
else
    ok "no Upgrade header over HTTP/1.1"
fi

# redirect PATH TARGET NAME: PATH must answer 301 with Location $BASE$TARGET,
# and the destination must answer 200.
redirect() {
    local path="$1" target="$2" name="$3" code location
    code=$(fetch "$BASE$path" "$name")
    location=$(header "$name" location)
    if [ "$code" != "301" ] || [ "$location" != "$BASE$target" ]; then
        fail "$path answered HTTP $code to '$location' (expected 301 to $BASE$target)"
        return
    fi
    code=$(fetch "$BASE$target" "$name-dest")
    if [ "$code" = "200" ]; then
        ok "$path answers 301 to $target (200)"
    else
        fail "$path answers 301, but $target answered HTTP $code"
    fi
}

# Retired slug of the archon guides.
redirect /guide/archon-principi/ /guide/archon-italia/ legacy
# Paths of older site versions, still shared outside the site.
redirect /docs/gp-2026/infopack-gp-2026-it.pdf /gp/gp-2026/infopack-gp-2026-it.pdf legacy-docs
redirect /week-of-sabbat /comunita/week-of-sabbat-2025/ legacy-wos
redirect /en/blog/ /en/community/ legacy-en-blog
redirect /gp/gp-2026/ /grand-prix/grand-prix-2026/ legacy-gp

# A missing URL must answer 404 with the site's error page, in the right
# language: before 2026-10-16 it served the home page with 200 (soft 404).
missing() {
    local path="$1" lang="$2" name="$3" code
    code=$(fetch "$BASE$path" "$name")
    if [ "$code" != "404" ]; then
        fail "$path answered HTTP $code instead of 404 (check ErrorDocument and the directory rule in public/.htaccess)"
    elif ! grep -q '<title>404' "$TMP/$name.body" || ! grep -q "<html lang=\"$lang\"" "$TMP/$name.body"; then
        fail "$path answers 404, but not with the $lang 404 page of the site"
    else
        ok "$path answers 404 with the $lang 404 page"
    fi
}

missing /pagina-che-non-esiste-smoke-test/ it missing
missing /en/page-that-does-not-exist-smoke-test/ en missing-en
# A directory without index.html: Apache's 403 page, turned into the site 404.
missing /api/ it missing-dir

# Cache headers: HTML must revalidate, hashed assets can be cached for a year.
html_cc=$(header home cache-control)
case "$html_cc" in
    *no-cache*) ok "HTML Cache-Control: $html_cc" ;;
    *) fail "HTML has Cache-Control '${html_cc:-none}' (expected no-cache)" ;;
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
            *) fail "$asset is 200 but Cache-Control is '${asset_cc:-none}' (expected 1 year, immutable)" ;;
        esac
        # AddCharset in public/.htaccess: CSS and JS declare UTF-8 too.
        asset_ct=$(header asset content-type)
        case "$(printf '%s' "$asset_ct" | tr '[:upper:]' '[:lower:]')" in
            *charset=utf-8*) ok "$asset Content-Type: $asset_ct" ;;
            *) warn "$asset has Content-Type '${asset_ct:-none}' (expected charset=utf-8, see AddCharset in public/.htaccess)" ;;
        esac
    fi
else
    fail "no /_astro/ asset referenced from the home page"
fi

# Pagefind: the entry file has a fixed name and must revalidate; the files it
# points to carry a hash and are cached for a year.
code=$(fetch "$BASE/pagefind/pagefind-entry.json" pf-entry)
pf_cc=$(header pf-entry cache-control)
if [ "$code" != "200" ]; then
    fail "/pagefind/pagefind-entry.json answered HTTP $code"
else
    case "$pf_cc" in
        *no-cache*) ok "/pagefind/pagefind-entry.json Cache-Control: $pf_cc" ;;
        *) fail "/pagefind/pagefind-entry.json has Cache-Control '${pf_cc:-none}' (expected no-cache)" ;;
    esac
    pf_hash=$(grep -o '"hash":"[^"]*"' "$TMP/pf-entry.body" | head -n 1 | cut -d'"' -f4)
    if [ -z "$pf_hash" ]; then
        fail "/pagefind/pagefind-entry.json lists no language hash"
    else
        code=$(fetch "$BASE/pagefind/pagefind.$pf_hash.pf_meta" pf-meta)
        pf_meta_cc=$(header pf-meta cache-control)
        if [ "$code" != "200" ]; then
            fail "/pagefind/pagefind.$pf_hash.pf_meta answered HTTP $code"
        else
            case "$pf_meta_cc" in
                *immutable*) ok "/pagefind/pagefind.$pf_hash.pf_meta Cache-Control: $pf_meta_cc" ;;
                *) fail "/pagefind/pagefind.$pf_hash.pf_meta has Cache-Control '${pf_meta_cc:-none}' (expected 1 year, immutable)" ;;
            esac
        fi
    fi
fi

echo
if [ "$FAILED" -gt 0 ]; then
    echo "ERROR: $FAILED checks failed."
    exit 1
fi
echo "All checks passed."
