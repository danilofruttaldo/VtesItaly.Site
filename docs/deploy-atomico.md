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
~/releases/<sha>/                     la release in arrivo (diventa public_html)
~/releases/prev-AAAAMMGGhhmmss/       le release precedenti, al massimo 5
~/releases/prev-AAAAMMGGhhmmss.assets elenco dei file con hash (_astro, pagefind) di quella prev-*
~/releases/fallita-AAAAMMGGhhmmss/    le release rimosse dal ritorno indietro, al massimo 2
~/releases/.asset-list                elenco dei file con hash della release attiva
~/releases/.ultima-precedente         segnaposto: "<sha> <cartella prev>" fra scambio e conferma
~/public_html                         la release attiva
```

Gli elenchi (`.asset-list`, `prev-*.assets`) stanno fuori dalle cartelle di release apposta: dentro `public_html`
sarebbero serviti dal web.

1. **Caricamento**: il tarball di `dist/` viene estratto in una cartella nuova, `~/releases/<sha>`. `public_html` non
   viene toccato: un'interruzione qui lascia online la versione precedente. Prima di estrarre, il passo cancella le
   cartelle `~/releases/<sha>` rimaste da giri interrotti prima dello scambio (`prev-*` e `fallita-*` non le tocca).
2. **Scambio** (script passato a `bash -s`, niente da installare sul server):
   - controlla che la release contenga `index.html` e `.htaccess`, altrimenti si ferma;
   - copia `~/public_html/.well-known` nella release e le dà i permessi `755`;
   - porta nella release i file con hash della release attiva elencati in `~/releases/.asset-list` (solo quelli che
     aveva caricato lei, così non si accumulano): una scheda aperta prima del deploy carica ancora i suoi chunk e la sua
     ricerca. Usa hard link (`cp -pl`, stesso filesystem, niente spazio in più) e ripiega sulla copia se non si può;
   - `mv ~/public_html ~/releases/prev-<data UTC>`, poi `mv ~/releases/<sha> ~/public_html`. Fra le due rinomine
     `public_html` manca per pochi microsecondi. Se la seconda fallisce, la prima viene annullata subito;
   - scrive `~/releases/.ultima-precedente` con lo sha di questo giro e la cartella `prev-*` appena creata;
   - sposta `.asset-list` in `prev-<data UTC>.assets` (l'elenco segue la sua release) e mette al suo posto quello della
     release nuova;
   - cancella le `prev-*` oltre le cinque più recenti, le `fallita-*` oltre le due più recenti e i `.assets` rimasti
     senza cartella.
3. **Smoke test** (`scripts/smoke-test.sh`) dal runner, cioè da fuori dell'hosting. Lo script si limita da solo (circa
   3 minuti nel caso peggiore, si ferma subito se la home non risponde 200); il passo ha comunque `timeout-minutes: 5`, e
   un timeout conta come fallimento.
4. **Conferma**: se lo smoke test passa, il segnaposto viene cancellato. Il passo ha `continue-on-error`: se fallisce
   non fa partire il ritorno indietro (la release ha passato lo smoke test) e il segnaposto rimasto è innocuo, perché il
   deploy successivo lo sovrascrive.
5. **Ritorno indietro automatico**, solo se è fallito lo scambio (passo `swap`) o lo smoke test (passo `smoke`, timeout
   compreso), oppure se il giro è stato annullato:

   ```yaml
   if: always() && (steps.swap.outcome == 'failure' || steps.smoke.outcome == 'failure' || cancelled())
   ```

   Legge il segnaposto e agisce solo se lo sha è quello di questo giro: un segnaposto rimasto da un giro precedente non
   va mai disfatto, e un giro fallito o annullato prima dello scambio non ha niente da ripristinare. Sposta la release
   rotta in `~/releases/fallita-<data UTC>`, rimette la `prev-*` registrata come `public_html`, rimette il suo
   `prev-*.assets` come `.asset-list` (così il deploy successivo porta i file con hash della release ripristinata, non
   di quella rotta) e cancella il segnaposto. Il job resta fallito, così l'errore si vede.

Ogni deploy carica tutto il sito, senza delta: accettato perché Astro cambia comunque gli hash di quasi tutti i file a
ogni build. I file tolti dal sito spariscono da soli con la release successiva; per gli indirizzi vecchi ancora
condivisi fuori ci sono i 301 nel `.htaccess`.

## Ritorno indietro a mano

Per esempio quando un difetto passa lo smoke test e si nota dopo. Via SSH:

```bash
PREV=$(ls -1dt ~/releases/prev-*/ | head -n 1); PREV=${PREV%/}   # la release precedente più recente
ls "$PREV/index.html" && \
  mv ~/public_html ~/releases/fallita-$(date -u +%Y%m%d%H%M%S) && \
  mv "$PREV" ~/public_html && \
  rm -f ~/releases/.asset-list && \
  { [ ! -f "$PREV.assets" ] || mv "$PREV.assets" ~/releases/.asset-list; }
rm -f ~/releases/.ultima-precedente
```

Lo slash in `prev-*/` prende solo le cartelle, non i `prev-*.assets`. L'elenco va rimesso insieme alla release: con
quello della release tolta, il deploy successivo non porterebbe nessun file con hash. Se `$PREV.assets` manca, il
deploy successivo semplicemente non ne porta.

Per tornare ancora più indietro si ripete: ogni giro consuma la `prev-*` più recente. In alternativa si rilancia la
pipeline (`workflow_dispatch`) su un commit buono, che pubblica una release nuova.

## Manutenzione

- Le `fallita-*` restano per capire cosa è andato storto: lo scambio tiene le due più recenti e cancella le altre, quindi
  non serve pulirle a mano. Una da conservare più a lungo va spostata fuori da `~/releases`.
- Un `~/releases/.ultima-precedente` rimasto sul server vuol dire che un giro si è interrotto fra scambio e conferma, o
  che la conferma è fallita dopo uno smoke test passato. È innocuo: il deploy successivo lo sovrascrive, e il ritorno
  indietro confronta lo sha prima di agire. Si può cancellare dopo aver controllato il sito.
- Una cartella `~/releases/<sha>` rimasta (giro interrotto prima dello scambio) la cancella da solo il caricamento del
  deploy successivo: non serve intervenire.
