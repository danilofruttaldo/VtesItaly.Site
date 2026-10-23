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
`Permissions-Policy` (camera, microfono, posizione, pagamenti, USB e Topics spenti), `Cross-Origin-Opener-Policy:
same-origin` e HSTS. HSTS è senza condizione `env=HTTPS`: sulle risposte in http il browser lo ignora comunque, e la
condizione lo toglieva dove la variabile non arrivava; niente `preload`. `Header unset Upgrade` (più la variante `always`,
perché Apache lo scrive fra gli header normali) toglie l'header che Apache aggiunge quando c'è HTTP/2: su una risposta
HTTP/2 è vietato e Safari rifiuta la pagina. `X-XSS-Protection`
non c'è più: i browser l'hanno abbandonato.

`AddDefaultCharset UTF-8` e `AddCharset utf-8` per `.js`, `.mjs`, `.css`, `.json`, `.webmanifest`, `.xml` e `.txt`:
anche i file di testo che non sono HTML arrivano con `charset=utf-8`.

La CSP degli script resta nel `<meta>` che genera Astro (`security.csp` in `astro.config.mjs`, con gli hash `sha256`).
L'header porta solo le direttive che un meta non può esprimere o che non riguardano gli script: `frame-ancestors 'self'`,
`object-src 'none'`, `base-uri 'self'`. Con header e meta presenti insieme il browser li applica **tutti e due**: per
questo l'header non deve mai contenere `script-src`, che senza gli hash della build bloccherebbe gli script inline.

### Cache

- `/_astro/`: un anno, `immutable`. I nomi contengono l'impronta del contenuto, quindi cambiano quando cambia il file.
- Pagefind con l'hash nel nome (`/pagefind/fragment/`, `/pagefind/index/`, `/pagefind/filter/` e i file `*.pf_*`):
  un anno, `immutable`. `pagefind.js`, `pagefind-entry.json`, `pagefind-ui.*` e `wasm.*.pagefind` hanno nomi fissi e
  restano `no-cache`: sono loro a puntare ai file con hash della build corrente.
- Immagini, PDF e icone: `max-age=604800, must-revalidate`, una settimana. I nomi non hanno hash e un file può essere
  sostituito con lo stesso nome: dopo una settimana il browser lo ricontrolla. Per un cambio urgente si rinomina il
  file.
- Tutto il resto (HTML, `sw.js`, manifest, sitemap, `/api/`): `no-cache`, cioè «ricontrolla prima di riusare». Per
  `sw.js` è indispensabile: in cache, gli utenti non vedrebbero mai la versione nuova del sito.

### Indicizzazione di `/api/`

`X-Robots-Tag: noindex` sulle risposte sotto `/api/`: i JSON del calendario (`calendar-events-it.json`,
`calendar-events-en.json`) sono dati per gli script delle pagine e non devono comparire nei risultati di ricerca.

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
- La sezione inglese delle versioni precedenti: `/en/blog/` e `/en/comunita/<slug>/` verso `/en/community/<slug>/` (gli
  slug degli articoli non sono cambiati), `/en/nazionale/nazionale-AAAA/` verso `/en/national-championship/nc-AAAA/`,
  `/en/week-of-sabbat/` verso l'articolo della Week of Sabbat 2025.
- `/gp/gp-AAAA/` verso `/grand-prix/grand-prix-AAAA/`: la vecchia pagina del Grand Prix stava lì, oggi la cartella tiene
  solo immagini e PDF. I regolamenti del tour 2026 col vecchio nome (`/tour/tour-2026/regolamento-tour-2026.pdf` e
  `rules-tour-2026.pdf`) vanno agli infopack.
- L'articolo della lega di Treviso rinominato (`bleeding-the-vine-lega-vtes-treviso` diventato
  `bleeding-the-vine-lega-treviso`), in un solo salto da ogni vecchio percorso, IT ed EN.
- I cinque articoli cancellati a marzo 2026 (7° e 8° campionato milanese, torneo dello stile di Treviso, estate emiliana,
  EC 2024 a Varsavia): vanno all'elenco della comunità, `/comunita/` o `/en/community/`. Queste regole e quella dello slug
  rinominato stanno **prima** delle regole generiche su `/blog/` e `/en/comunita/`, che altrimenti li manderebbero a una
  pagina inesistente.

Le sorgenti sono state verificate sulla release precedente al primo deploy a release
(`~/releases/prev-20261016105511`), le destinazioni su `dist/`.

Le destinazioni sono sempre assolute e con la barra finale per le pagine, la forma canonica.

### Cartelle senza indice: 404 invece di 403

Con `Options -Indexes` una cartella senza `index.html` (`/api/`, `/fonts/`, `/_astro/`, `/images/`...) risponderebbe
con la pagina 403 di Apache, che non è del sito e dice al visitatore che lì c'è qualcosa di proibito. Le ultime righe del
blocco di riscrittura rispondono 404, con la pagina 404 del sito: `RewriteCond %{REQUEST_FILENAME} -d`, la cartella non
ha `index.html`, l'indirizzo non è sotto `/.well-known` (lo usa l'hosting per i certificati), e `RewriteRule ^ - [R=404,L]`.
Le cartelle con `index.html` non sono toccate, quindi il 301 di `mod_dir` che aggiunge la barra finale resta com'è. La
regola sta dopo tutti i redirect: messa prima, una cartella rimasta come `/gp/gp-2026/` risponderebbe 404 invece del 301.

## Se qualcosa va storto

Un errore di sintassi nel `.htaccess` dà un 500 su tutto il sito: lo smoke test fallisce e il deploy rimette la release
precedente, con il suo `.htaccess`. Il dettaglio dell'errore sta in cPanel, sezione Errori. Prima di pubblicare una
modifica conviene provarla con `curl -sI` sull'indirizzo interessato subito dopo il deploy.
