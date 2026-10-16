# .htaccess di vtesitaly.com

Dal 16/10/2026 il `.htaccess` è versionato in [`public/.htaccess`](../public/.htaccess) e pubblicato con il sito: Astro lo
copia in `dist/` e il deploy lo porta in `public_html` insieme al resto. **Si modifica nel repo, mai sul server**: il
deploy successivo sovrascriverebbe una modifica fatta a mano. La copia del vecchio file gestito sul server sta
sull'hosting in `~/backup_htaccess/htaccess.prima-del-2026-10-16`.

Tutto quello che il file promette lo verifica `scripts/smoke-test.sh` dopo ogni deploy, con controlli bloccanti.

## Blocco per blocco

### Header di sicurezza

`Header always set` invece di `Header set`: la variante semplice vale solo per le risposte 2xx, e sui 301 e sui 404
gli header mancavano. Ci sono `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin` e HSTS (solo su HTTPS). `X-XSS-Protection` non c'è più:
i browser l'hanno abbandonato.

La CSP degli script resta nel `<meta>` che genera Astro (`security.csp` in `astro.config.mjs`, con gli hash `sha256`).
L'header porta solo le direttive che un meta non può esprimere o che non riguardano gli script: `frame-ancestors 'self'`,
`object-src 'none'`, `base-uri 'self'`. Con header e meta presenti insieme il browser li applica **tutti e due**: per
questo l'header non deve mai contenere `script-src`, che senza gli hash della build bloccherebbe gli script inline.

### Cache

- `/_astro/`: un anno, `immutable`. I nomi contengono l'impronta del contenuto, quindi cambiano quando cambia il file.
- Immagini, PDF e icone: 30 giorni. Un'immagine sostituita con lo stesso nome può restare vecchia fino a un mese per chi
  l'ha già vista: per un cambio urgente si rinomina il file.
- Tutto il resto (HTML, `sw.js`, manifest, sitemap, `/api/`): `no-cache`, cioè «ricontrolla prima di riusare». Per
  `sw.js` è indispensabile: in cache, gli utenti non vedrebbero mai la versione nuova del sito.

### Compressione

`no-gzip` e `no-brotli` per WebP, AVIF, PNG, JPEG, GIF, WOFF2 e PDF: sono già compressi, ricomprimerli costa CPU e non
risparmia byte. La compressione degli altri formati la fa già l'hosting.

### File protetti e indici

`error_log` e lo stesso `.htaccess` non si servono; `Options -Indexes` toglie l'elenco dei file nelle cartelle senza
`index.html`.

### Pagina 404

`ErrorDocument 404 /404.html`, e `/en/404/index.html` sotto `/en/`. `ErrorDocument` dentro `<If>` mantiene il codice
404 e cambia solo il corpo; una `RewriteRule` verso la pagina inglese la servirebbe con 200. Fino al 16/10/2026 il file
sul server aveva un ripiego da applicazione a pagina singola verso `/index.html`, che rispondeva con la home e codice 200
a ogni indirizzo inesistente (soft 404). Il sito è completamente statico: un ripiego non serve e non va rimesso.

### Redirect permanenti

- `www.vtesitaly.com` verso il dominio senza `www`.
- Le guide archon confluite in `/guide/archon-italia/` (e `/en/guides/archon-italia/`): 301 veri al posto delle pagine
  di meta refresh che Astro genera da `redirects` in `astro.config.mjs`, che restano come rete di sicurezza. Uno slug
  aggiunto lì va aggiunto anche qui.
- Gli indirizzi delle versioni precedenti del sito, ancora condivisi fuori (infopack per email, link sui social):
  `/docs/gp-AAAA/`, `/docs/nc-AAAA/`, `/docs/wos-AAAA/`, i regolamenti del tour 2026 in `/docs/tour/`, `/blog/` e
  `/week-of-sabbat`. Prima rispondevano perché i vecchi file restavano in `public_html`; il deploy a release li ha tolti
  (vedi [deploy-atomico.md](deploy-atomico.md)) e questi 301 li portano dove stanno oggi.

Le destinazioni sono sempre assolute e con la barra finale per le pagine, la forma canonica.

## Se qualcosa va storto

Un errore di sintassi nel `.htaccess` dà un 500 su tutto il sito: lo smoke test fallisce e il deploy rimette la release
precedente, con il suo `.htaccess`. Il dettaglio dell'errore sta in cPanel, sezione Errori. Prima di pubblicare una
modifica conviene provarla con `curl -sI` sull'indirizzo interessato subito dopo il deploy.
