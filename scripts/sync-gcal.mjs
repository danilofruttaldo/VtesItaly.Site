/* Pushes the site calendar to the public Google calendar, after the deploy
 * (job `gcal-sync` in .github/workflows/deploy.yml).
 *
 * Source: dist/api/calendar-events-it.json, the same events the site shows.
 * Mapping and diff are in src/utils/gcal.ts (tested); this script only talks
 * to the API. Only events tagged by the sync are listed, so events added by
 * hand on the Google calendar are left alone.
 *
 * Auth: a service account (JSON key in GCAL_CREDENTIALS) to which the
 * calendar GCAL_PUBLIC_CALENDAR (src/utils/gcal-event.ts, the same id as the
 * site's subscribe links) is shared with "Make changes to events". The
 * OAuth JWT is signed here with node:crypto, no googleapis dependency.
 *
 * Usage: node scripts/sync-gcal.mjs [--dry-run]
 */
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { GCAL_SOURCE, planSync, removalLimit, toGcalEvents } from '../src/utils/gcal.ts';
import { GCAL_PUBLIC_CALENDAR } from '../src/utils/gcal-event.ts';

const DRY_RUN = process.argv.includes('--dry-run');
const SITE_URL = 'https://vtesitaly.com';
const API = 'https://www.googleapis.com/calendar/v3';
// Per request: a call Google never answers is cut here and retried, instead
// of holding the job until its own timeout.
const REQUEST_TIMEOUT_MS = 30_000;

const events = JSON.parse(readFileSync('dist/api/calendar-events-it.json', 'utf8'));
const it = JSON.parse(readFileSync('src/i18n/it.json', 'utf8'));
const desired = toGcalEvents(events, { siteUrl: SITE_URL, startsPrefix: it.calendar.starts });

const { GCAL_CREDENTIALS } = process.env;
if (!GCAL_CREDENTIALS) {
  if (DRY_RUN) {
    console.log(`${desired.length} eventi da pubblicare (dry run, nessuna credenziale):`);
    for (const e of desired) console.log(`  ${e.start.date ?? e.start.dateTime}  ${e.summary}`);
    process.exit(0);
  }
  console.log('::warning::GCAL_CREDENTIALS non impostato: sync del Google Calendar saltato.');
  process.exit(0);
}
// An empty list would delete every synced event: a broken build, not a real state.
if (desired.length === 0) {
  console.error('::error::Nessun evento nel calendario del sito: sync interrotto per non svuotare il Google Calendar.');
  process.exit(1);
}

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');

async function accessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/calendar.events',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(claims)}`;
  const signature = createSign('RSA-SHA256').update(unsigned).sign(key.private_key, 'base64url');
  const res = await request('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });
  return JSON.parse(res.text).access_token;
}

/**
 * One HTTP request, body included; retries rate limits, 5xx, timeouts (headers
 * or body past REQUEST_TIMEOUT_MS) and network errors with backoff. Returns
 * { status, text }. Retrying a write is safe: event ids are fixed, so a
 * repeated insert answers 409 and becomes an update.
 */
async function request(url, init, okStatuses = []) {
  for (let attempt = 0; ; attempt++) {
    let status;
    let text;
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
      status = res.status;
      text = await res.text();
      if (res.ok || okStatuses.includes(status)) return { status, text };
    } catch (err) {
      if (attempt >= 4) throw new Error(`${init.method} ${url}: ${err.name} ${err.message}`, { cause: err });
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      continue;
    }
    // Google answers rate limits with 403 too, but a 403 is also "calendar not shared".
    const retriable = status === 429 || status >= 500 || (status === 403 && /rateLimit/i.test(text));
    if (!retriable || attempt >= 4) throw new Error(`${init.method} ${url}: ${status} ${text}`);
    await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
  }
}

const token = await accessToken(JSON.parse(GCAL_CREDENTIALS));
const base = `${API}/calendars/${encodeURIComponent(GCAL_PUBLIC_CALENDAR)}/events`;

/** One Calendar API call with the token (see `request`). */
function call(method, url, body, okStatuses = []) {
  return request(
    url,
    {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    },
    okStatuses,
  );
}

const existing = [];
let pageToken = '';
do {
  const q = new URLSearchParams({
    privateExtendedProperty: `source=${GCAL_SOURCE}`,
    maxResults: '2500',
    fields: 'items(id,extendedProperties),nextPageToken',
  });
  if (pageToken) q.set('pageToken', pageToken);
  const page = JSON.parse((await call('GET', `${base}?${q}`)).text);
  existing.push(...(page.items ?? []));
  pageToken = page.nextPageToken ?? '';
} while (pageToken);

const plan = planSync(desired, existing);
console.log(
  `Google Calendar: ${plan.insert.length} nuovi, ${plan.update.length} modificati, ${plan.remove.length} rimossi ` +
    `(${desired.length} sul sito, ${existing.length} sul calendario)`,
);
// GCAL_ALLOW_REMOVALS=1 (repo variable) lets one intended big cleanup through.
// Checked before the dry-run exit, so a dry run tells what the real sync would do.
const limit = removalLimit(existing.length);
if (plan.remove.length > limit && process.env.GCAL_ALLOW_REMOVALS !== '1') {
  console.error(
    `::error::Lo sync rimuoverebbe ${plan.remove.length} eventi (limite ${limit}): interrotto senza modifiche. ` +
      'Se è voluto, imposta la variabile GCAL_ALLOW_REMOVALS=1 sul repo, rilancia il job e poi toglila.',
  );
  process.exit(1);
}
if (DRY_RUN) process.exit(0);

for (const e of plan.insert) {
  // 409: the id belongs to an event deleted earlier (Google keeps the id);
  // updating it brings it back.
  const res = await call('POST', base, e, [409]);
  if (res.status === 409) await call('PUT', `${base}/${e.id}`, { ...e, status: 'confirmed' });
}
for (const e of plan.update) await call('PUT', `${base}/${e.id}`, e);
// 410: already deleted.
for (const id of plan.remove) await call('DELETE', `${base}/${id}`, undefined, [404, 410]);
console.log('Sync completato.');
