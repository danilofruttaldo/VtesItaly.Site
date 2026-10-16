# Deploy per cartelle di release

> **Attivo dal 16/10/2026.** Il job `deploy` di `.github/workflows/deploy.yml` fa quello che descrive questo documento.
> Prima di quella data il sito veniva estratto direttamente dentro `public_html` con un tar-pipe: niente atomicità,
> nessun file vecchio cancellato, nessun ritorno indietro.

## Premesse verificate sull'hosting (16/10/2026)

- `public_html` è una cartella vera, e `~/releases` sta sullo stesso filesystem: `mv` è una rinomina istantanea.
- Matomo (`~/stats.vtesitaly.com`) e gp2025 (`~/gp2025.vtesitaly.com`) hanno la document root fuori da `public_html`:
  lo scambio non li tocca.
- L'unico file che esiste solo sul server è `.well-known/` (le verifiche di AutoSSL). Il `.htaccess` arriva dal repo
  (`public/.htaccess`, vedi [htaccess.md](htaccess.md)).

## Cosa fa il job

```
~/releases/<sha>/              la release in arrivo (diventa public_html)
~/releases/prev-AAAAMMGGhhmmss/ le release precedenti, al massimo 5
~/releases/fallita-AAAAMMGGhhmmss/ una release rimossa dal ritorno indietro automatico
~/releases/.ultima-precedente  segnaposto: "<sha> <cartella prev>" fra scambio e conferma
~/public_html                  la release attiva
```

1. **Caricamento**: il tarball di `dist/` viene estratto in una cartella nuova, `~/releases/<sha>`. `public_html` non
   viene toccato: un'interruzione qui lascia online la versione precedente.
2. **Scambio** (script passato a `bash -s`, niente da installare sul server):
   - controlla che la release contenga `index.html` e `.htaccess`, altrimenti si ferma;
   - copia `~/public_html/.well-known` nella release e le dà i permessi `755`;
   - `mv ~/public_html ~/releases/prev-<data UTC>`, poi `mv ~/releases/<sha> ~/public_html`. Fra le due rinomine
     `public_html` manca per pochi microsecondi. Se la seconda fallisce, la prima viene annullata subito;
   - scrive `~/releases/.ultima-precedente` con lo sha di questo giro e la cartella `prev-*` appena creata;
   - cancella le `prev-*` oltre le cinque più recenti.
3. **Smoke test** (`scripts/smoke-test.sh`) dal runner, cioè da fuori dell'hosting.
4. **Conferma**: se lo smoke test passa, il segnaposto viene cancellato.
5. **Ritorno indietro automatico**, solo se un passo precedente è fallito: legge il segnaposto e agisce solo se lo sha
   è quello di questo giro (un segnaposto rimasto da un giro precedente non va mai disfatto). Sposta la release rotta
   in `~/releases/fallita-<data UTC>`, rimette la `prev-*` registrata come `public_html` e cancella il segnaposto. Il
   job resta fallito, così l'errore si vede.

Ogni deploy carica tutto il sito, senza delta: accettato perché Astro cambia comunque gli hash di quasi tutti i file a
ogni build. I file tolti dal sito spariscono da soli con la release successiva; per gli indirizzi vecchi ancora
condivisi fuori ci sono i 301 nel `.htaccess`.

## Ritorno indietro a mano

Per esempio quando un difetto passa lo smoke test e si nota dopo. Via SSH:

```bash
PREV=$(ls -1dt ~/releases/prev-* | head -n 1)   # la release precedente più recente
ls "$PREV/index.html" && \
  mv ~/public_html ~/releases/fallita-$(date -u +%Y%m%d%H%M%S) && \
  mv "$PREV" ~/public_html
rm -f ~/releases/.ultima-precedente
```

Per tornare ancora più indietro si ripete: ogni giro consuma la `prev-*` più recente. In alternativa si rilancia la
pipeline (`workflow_dispatch`) su un commit buono, che pubblica una release nuova.

## Manutenzione

- Le `fallita-*` non vengono mai cancellate in automatico: si guardano per capire cosa è andato storto e poi si
  rimuovono a mano (`rm -rf ~/releases/fallita-*`).
- Un `~/releases/.ultima-precedente` rimasto sul server vuol dire che un giro si è interrotto fra scambio e conferma: si
  controlla il sito e, se è a posto, si cancella.
- Una cartella `~/releases/<sha>` rimasta vuol dire un giro interrotto prima dello scambio: si può cancellare, il giro
  successivo sullo stesso commit la ricrea comunque da zero.
