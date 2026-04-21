// Force the test runner to UTC so Date.toDateString() / setHours() etc. give
// the same results on a CI Ubuntu runner (UTC) and on a developer's local
// machine (often Europe/Rome). Without this, status.ts tests using late-day
// UTC instants would flip days under DST.
process.env.TZ = 'UTC';
