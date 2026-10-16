# .htaccess: proposta da integrare sul server

Il `.htaccess` di `public_html` su vtesitaly.com è gestito a mano sull'hosting e non sta nel repo. Questo documento
**non viene mai pubblicato**: è una proposta da fondere nel file esistente, blocco per blocco, dopo averne fatto una
copia (`cp .htaccess .htaccess.bak-AAAAMMGG`).

Ogni blocco è racchiuso in `<IfModule>`: se un modulo manca sull'hosting il blocco viene ignorato invece di dare un
errore 500. I blocchi `<If>` richiedono Apache 2.4 (l'hosting risponde `Server: Apache`, versione da confermare in
cPanel); su un server LiteSpeed le stesse direttive sono in genere accettate, ma vanno provate una per una. Dopo ogni modifica conviene ricaricare il sito e rilanciare lo smoke test (`npm run smoke`): le prove
`NOTE` che oggi falliscono devono passare a `OK`.

## Cosa risponde oggi il server (16/10/2026)

| Prova                                        | Oggi                                     | Atteso                            |
| -------------------------------------------- | ---------------------------------------- | --------------------------------- |
| URL inesistente                              | 200 con la home (241.309 byte, soft 404) | 404 con `/404.html`               |
| `/guide/archon-principi/` (slug ritirato)    | 200 con una pagina di meta refresh       | 301 verso `/guide/archon-italia/` |
| `Cache-Control` su HTML e su `/_astro/`      | assente                                  | `no-cache` / un anno `immutable`  |
| Header di sicurezza sul 301 di `/principati` | solo HSTS (gli altri mancano)            | tutti, anche su 301 e 404         |
| `X-XSS-Protection`                           | `1; mode=block`                          | assente (deprecato)               |

## 1. Pagina 404 vera al posto del soft 404

```apache
# La pagina d'errore del sito, con il codice 404 vero.
ErrorDocument 404 /404.html

# Sotto /en/ la versione inglese, appena la build la genera
# (oggi dist/ non contiene en/404/index.html: lasciare commentato fino ad allora).
# <If "%{REQUEST_URI} =~ m#^/en/#">
#   ErrorDocument 404 /en/404/index.html
# </If>
```

Perché `<If>` e non una `RewriteCond %{REQUEST_URI} ^/en/`: con mod_rewrite si può solo riscrivere l'URL mancante
verso la pagina inglese, e Apache la servirebbe con **200**, cioè di nuovo un soft 404. `ErrorDocument` dentro `<If>`
mantiene il codice 404 e cambia solo il corpo della risposta.

**Da togliere**: il soft 404 di oggi nasce da un ripiego verso `index.html`, rimasto da un CMS o da un modello per
applicazioni a pagina singola. Si riconosce da una di queste forme (vanno cancellate, non commentate a metà):

```apache
FallbackResource /index.html

# oppure il blocco classico di WordPress / SPA:
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Un `ErrorDocument 404 /index.html` darebbe invece la home con codice 404: sbagliato anche quello, ma oggi il codice è
200, quindi la causa è una delle due forme sopra. Il sito è statico: ogni pagina esiste come file, nessun URL ha
bisogno di un ripiego.

Verifica: `curl -sI https://vtesitaly.com/pagina-che-non-esiste/` deve rispondere `HTTP/1.1 404`.

## 2. Redirect permanenti degli slug ritirati

Le quattro guide Archon confluite in una (agosto 2026) oggi rispondono con le paginette di meta refresh che Astro genera
da `redirects` in `astro.config.mjs`: i motori di ricerca le trattano come redirect deboli. Un 301 vero va qui, prima di
ogni altra regola di riscrittura. Le pagine di meta refresh restano in `dist/` come rete di sicurezza.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  # Slug delle guide Archon ritirati: elenco in astro.config.mjs (redirects).
  # Destinazione sempre con la barra finale, la forma canonica.
  RewriteRule ^guide/archon-(principi|giocatori|leghe)/?$ /guide/archon-italia/ [R=301,L]
  RewriteRule ^en/guides/archon-(principi|giocatori|leghe)/?$ /en/guides/archon-italia/ [R=301,L]
</IfModule>
```

Quando si aggiunge una voce a `redirects` in `astro.config.mjs` va aggiunta anche qui. Le regole esistenti per
`http` → `https` (e per `www`, se c'è) non vanno toccate.

Verifica: `curl -sI https://vtesitaly.com/guide/archon-principi/` deve rispondere `301` con
`Location: https://vtesitaly.com/guide/archon-italia/`.

## 3. Cache del browser

Astro mette un hash nel nome di ogni file in `/_astro/`: quei file non cambiano mai, possono restare in cache un anno.
L'HTML, `sw.js`, il manifest e le sitemap invece cambiano a ogni pubblicazione con lo stesso nome: il browser deve
ricontrollarli ogni volta (`no-cache` non vuol dire «non salvare», vuol dire «chiedi prima di riusare»: con
`Last-Modified` la risposta è un 304 di pochi byte). Immagini e font hanno nomi stabili ma cambiano di rado: 30 giorni.

```apache
<IfModule mod_headers.c>
  # Immagini e font: 30 giorni.
  <FilesMatch "\.(webp|avif|png|jpe?g|gif|svg|ico|woff2?)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>

  # HTML, service worker, manifest, sitemap, robots: sempre ricontrollati.
  # sw.js in particolare: se resta in cache, gli utenti non vedono mai la versione nuova.
  <FilesMatch "\.(html|xml|txt|webmanifest)$|^(sw\.js|manifest\.json)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>

  # Indice di Pagefind: pagefind.js e pagefind-entry.json non hanno hash nel nome.
  <If "%{REQUEST_URI} =~ m#^/pagefind/#">
    Header set Cache-Control "no-cache"
  </If>

  # File con hash nel nome: un anno, immutabili. <If> viene valutato dopo
  # <FilesMatch>, quindi vince anche sulle immagini ottimizzate in /_astro/.
  <If "%{REQUEST_URI} =~ m#^/_astro/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
</IfModule>
```

Le pagine si chiedono come cartella (`/principati/`) ma il file servito è `index.html`, quindi la regola sull'HTML le
copre. Un'immagine sostituita mantenendo lo stesso nome può restare vecchia fino a 30 giorni per chi l'ha già vista:
per un cambio urgente, rinominare il file.

Se nel `.htaccess` c'è già un blocco `mod_expires` (`ExpiresActive On`, `ExpiresByType ...`), conviene toglierlo:
genera un secondo `Cache-Control` che può contraddire questo.

Verifica: `curl -sI https://vtesitaly.com/` deve mostrare `Cache-Control: no-cache`; un file `/_astro/*.css` preso
dalla home deve mostrare `max-age=31536000, immutable`.

## 4. Compressione solo dove serve

WebP, AVIF, PNG, JPEG e WOFF2 sono già compressi: comprimerli di nuovo costa CPU al server e non risparmia byte.

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/xml \
    application/javascript text/javascript application/json application/manifest+json image/svg+xml
  <IfModule mod_setenvif.c>
    SetEnvIfNoCase Request_URI "\.(?:webp|avif|png|jpe?g|gif|woff2?)$" no-gzip no-brotli
  </IfModule>
</IfModule>

<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/xml application/xml \
    application/javascript text/javascript application/json application/manifest+json image/svg+xml
</IfModule>
```

Se l'hosting comprime già a livello di server (lo fa capire `Content-Encoding: br` o `gzip` sulla home con
`curl -sI -H 'Accept-Encoding: br, gzip'`), questo blocco è innocuo ma superfluo.

## 5. Header di sicurezza, anche su redirect ed errori

Oggi gli header sono impostati con `Header set`, che vale solo per le risposte 2xx: sul 301 di `/principati` arriva solo
HSTS. `Header always set` li applica anche a 301, 404 e 500. **Il blocco attuale va sostituito, non affiancato**:
`Header set` e `Header always set` scrivono in due tabelle diverse, e tenerli entrambi raddoppia gli header sulle
risposte 200.

```apache
<IfModule mod_headers.c>
  # HSTS come oggi (un anno, sottodomini compresi).
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Cross-Origin-Opener-Policy "same-origin"
  # Protezione dal clickjacking per i browser vecchi; i nuovi usano frame-ancestors (sotto).
  Header always set X-Frame-Options "SAMEORIGIN"
  # Deprecato: i browser moderni lo ignorano e nei vecchi apriva falle proprie.
  Header always unset X-XSS-Protection
  Header unset X-XSS-Protection
</IfModule>
```

Se HSTS lo imposta già l'hosting a livello di server (oggi compare anche sul 301, a differenza degli altri), la riga qui
lo sovrascrive con lo stesso valore: nessun doppione.

## 6. Content-Security-Policy come header

La CSP del sito sta in un `<meta http-equiv>` generato da Astro nel layout. Un header serve per le direttive che il meta
**non può** esprimere, prima fra tutte `frame-ancestors` (ignorata nel meta).

Va tenuto presente che quando ci sono sia l'header sia il meta, **il browser li applica tutti e due**: una risorsa passa
solo se la permettono entrambe le politiche. Per questo l'header non deve ripetere `script-src`: gli script inline del
sito sono autorizzati dagli hash `sha256` che Astro calcola a ogni build e scrive nel meta; un header scritto a mano con
`script-src 'self' https://stats.vtesitaly.com` e senza quegli hash bloccherebbe tutti gli script inline, e copiare gli
hash qui vorrebbe dire aggiornare il `.htaccess` a ogni pubblicazione.

Proposta consigliata: un header complementare, che lascia gli script al meta.

```apache
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests"
</IfModule>
```

Alternativa, solo se un giorno il sito non avrà più nessuno script inline (tutti in file esterni): l'equivalente
completo del meta, che allora si potrebbe anche togliere dal layout.

```apache
# NON attivare finché nel sito restano script inline: li bloccherebbe.
# Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://stats.vtesitaly.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://stats.vtesitaly.com; font-src 'self'; connect-src 'self' https://stats.vtesitaly.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
```

`https://stats.vtesitaly.com` è Matomo: carica `matomo.js` (script), invia le visite (`connect-src`) e usa un pixel di
ripiego (`img-src`). Se la CSP del meta cambia, l'alternativa va riallineata a mano.

Verifica dopo l'attivazione: aprire il sito con gli strumenti per sviluppatori, scheda Console: nessun errore
`Refused to ...`. Poi `curl -sI https://vtesitaly.com/principati` (il 301) deve mostrare tutti gli header di questa
sezione e della precedente.

## Ordine consigliato nel file

1. Regole già presenti per `https` e `www` (non toccarle).
2. Sezione 2 (redirect 301), subito dopo.
3. Sezione 1 (`ErrorDocument`), dopo aver tolto il ripiego verso `index.html`.
4. Sezioni 3, 4, 5, 6.

Se qualcosa va storto (errore 500 su tutto il sito), ripristinare la copia: `cp .htaccess.bak-AAAAMMGG .htaccess`. Il
log dell'errore sta in cPanel, sezione Errori.
