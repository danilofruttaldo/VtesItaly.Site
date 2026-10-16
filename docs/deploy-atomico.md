# Deploy atomico e pulizia dei file vecchi

> **Da verificare sull'hosting prima di attivarlo.** Niente di quello che segue è attivo: il deploy di oggi resta il
> tar-pipe in `.github/workflows/deploy.yml`. Questo documento descrive come passare a un deploy per cartelle di release,
> con i comandi esatti, ma le premesse (rinomine nella home, symlink come document root, posizione dei sottodomini)
> dipendono dall'hosting condiviso e nessuno le ha ancora provate.

## Il problema

Il job `deploy` fa `tar -C dist -cz . | ssh ... "tar -C ~/public_html -xz"`. Funziona, ma:

- **non è atomico**: per i secondi dell'estrazione `public_html` contiene un misto di vecchia e nuova versione. Una
  pagina nuova può chiedere un CSS in `/_astro/` non ancora arrivato;
- **non cancella mai niente**: i file con hash di ogni release precedente (`/_astro/*`, i frammenti di Pagefind) e le
  pagine tolte dal sito restano pubblicati per sempre. Una pagina rimossa continua a rispondere 200;
- **non ha un ritorno indietro**: per tornare alla versione precedente bisogna rilanciare la pipeline sul commit vecchio;
- il controllo dopo il deploy c'è da ottobre 2026 (`scripts/smoke-test.sh`), ma se fallisce il sito rotto resta online.

Le due soluzioni sotto sono indipendenti. La **B** (pulizia con manifest) è la meno invasiva e si può adottare da sola.

## Verifiche da fare prima (una volta, via SSH)

```bash
# 1. public_html è una cartella vera, non già un symlink?
ls -ld ~/public_html

# 2. ~/releases starebbe sullo stesso filesystem di public_html?
#    Serve perché `mv` sia una rinomina istantanea e non una copia.
mkdir -p ~/releases && df ~/public_html ~/releases

# 3. Dove stanno le document root dei sottodomini (stats.vtesitaly.com, Matomo)?
#    cPanel > Domini. Se una sta DENTRO public_html (es. public_html/stats),
#    lo scambio di cartella della soluzione A la farebbe sparire: va prima
#    spostata fuori, oppure si usa solo la soluzione B.
ls -la ~/public_html | grep -v -e '_astro' -e '\.html$'

# 4. File che esistono solo sul server, da preservare a ogni release.
ls -la ~/public_html/.htaccess ~/public_html/.well-known ~/public_html/cgi-bin \
       ~/public_html/.user.ini ~/public_html/php.ini 2>/dev/null

# 5. Strumenti GNU disponibili (servono -T, -d, comm).
mv --version | head -n 1; xargs --version | head -n 1; command -v comm
```

File solo-server noti o probabili: `.htaccess` (gestito a mano), `.well-known/` (rinnovo AutoSSL di cPanel), `cgi-bin/`,
`.user.ini` / `php.ini`, `error_log`, e le cartelle di eventuali sottodomini o addon domain.

## Soluzione A: cartelle di release

Struttura sul server:

```
~/releases/<sha>/     una cartella per release, al massimo 5
~/releases/CURRENT    lo sha della release attiva
~/public_html         la release attiva (cartella rinominata, oppure symlink)
```

### A1. Estrazione dalla pipeline

Al posto del passo `Deploy via tar-pipe over SSH`, stesse variabili d'ambiente e stessa preparazione della chiave:

```bash
SHA="${GITHUB_SHA}"
SSH="ssh -i $HOME/.ssh/deploy_key -p $SSH_PORT -o StrictHostKeyChecking=yes -o BatchMode=yes $SSH_USER@$SSH_HOST"

# Estrae in una cartella nuova: public_html non viene toccato.
$SSH "rm -rf ~/releases/$SHA.tmp && mkdir -p ~/releases/$SHA.tmp"
tar -C dist -cz . | $SSH "tar -C ~/releases/$SHA.tmp -xz && mv ~/releases/$SHA.tmp ~/releases/$SHA"

# Attiva (script sotto, passato su stdin: niente da installare sul server).
$SSH "bash -s -- $SHA" < scripts/activate-release.sh
```

Se la pipeline viene interrotta durante l'estrazione resta solo una cartella `.tmp`: il sito non se ne accorge.

### A2. Attivazione con due rinomine (variante senza symlink)

Contenuto proposto per `scripts/activate-release.sh` (non ancora nel repo):

```bash
#!/usr/bin/env bash
set -euo pipefail
SHA="$1"
R="$HOME/releases"
NEW="$R/$SHA"
LIVE="$HOME/public_html"

[ -f "$NEW/index.html" ] || { echo "release $SHA incompleta"; exit 1; }

# File che esistono solo sul server: copiati dalla release attiva nella nuova.
for f in .htaccess .well-known cgi-bin .user.ini php.ini; do
  if [ -e "$LIVE/$f" ] && [ ! -e "$NEW/$f" ]; then cp -a "$LIVE/$f" "$NEW/"; fi
done

PREV="$(cat "$R/CURRENT" 2>/dev/null || echo "pre-release-$(date +%Y%m%d%H%M%S)")"

# Lo scambio: due rinomine sullo stesso filesystem, pochi millisecondi in cui
# public_html non esiste (una richiesta in quell'istante riceve un errore).
mv "$LIVE" "$R/$PREV"
mv "$NEW" "$LIVE"
echo "$SHA" > "$R/CURRENT"
echo "$PREV" > "$R/PREVIOUS"

# Tiene le ultime 5 release (le cartelle in ~/releases sono tutte quelle non attive).
ls -1dt "$R"/*/ | tail -n +6 | xargs -r -d '\n' rm -rf --
echo "attiva $SHA, precedente $PREV"
```

### A3. Attivazione con symlink (variante atomica, se l'hosting la permette)

Con `public_html` symlink verso la release, lo scambio è una sola rinomina atomica del link: nessun istante a vuoto. Va
provato prima su un sottodominio di prova: alcuni hosting cPanel non accettano una document root che sia un symlink, o
richiedono `SymLinksIfOwnerMatch`.

Prima volta (a mano): `mv ~/public_html ~/releases/iniziale && ln -s ~/releases/iniziale ~/public_html`.

Poi, al posto delle due `mv` dell'A2:

```bash
cp -a "$HOME/shared/.htaccess" "$NEW/"          # con i symlink il .htaccess vive in ~/shared
ln -sfn "$NEW" "$HOME/public_html.next"
mv -T "$HOME/public_html.next" "$HOME/public_html"   # rinomina atomica del link
echo "$SHA" > "$R/CURRENT"
# Pulizia: tutte le release tranne le 5 più recenti, mai quella attiva.
ls -1dt "$R"/*/ | grep -v "/$SHA/$" | tail -n +5 | xargs -r -d '\n' rm -rf --
```

### A4. Ritorno alla release precedente

Variante con rinomine:

```bash
R=~/releases; CUR=$(cat $R/CURRENT); PREV=$(cat $R/PREVIOUS)
mv ~/public_html "$R/$CUR" && mv "$R/$PREV" ~/public_html
echo "$PREV" > $R/CURRENT; echo "$CUR" > $R/PREVIOUS
```

Variante con symlink:

```bash
ln -sfn ~/releases/<sha-precedente> ~/public_html.next && mv -T ~/public_html.next ~/public_html
echo <sha-precedente> > ~/releases/CURRENT
```

Lo smoke test (`scripts/smoke-test.sh`) può fare da innesco: se fallisce, la pipeline esegue il ritorno indietro con lo
stesso `bash -s` e poi fallisce lo stesso, così l'errore resta visibile.

## Soluzione B: pulizia dei file vecchi con un manifest

Funziona anche con il deploy in place di oggi, e non tocca mai i file solo-server: cancella **solo** file che un deploy
precedente ha creato e che il deploy nuovo non contiene più. Un file che nessun manifest ha mai elencato (`.htaccess`,
`.well-known/`, Matomo) non può essere cancellato.

Nella pipeline, dopo il tar-pipe:

```bash
# Elenco dei file della release, fuori da public_html (non va pubblicato).
(cd dist && find . -type f | LC_ALL=C sort) | $SSH "cat > ~/deploy-manifest.new"
$SSH 'bash -s' <<'EOF'
set -euo pipefail
cd ~/public_html
if [ -f ~/deploy-manifest ]; then
  # Righe del manifest vecchio assenti dal nuovo, con una rete di sicurezza in più
  # sui file solo-server anche se per errore fossero finiti in un manifest.
  LC_ALL=C comm -23 ~/deploy-manifest ~/deploy-manifest.new \
    | grep -vE '^\./(\.htaccess|\.well-known/|cgi-bin/|\.user\.ini$|php\.ini$|error_log$)' \
    > ~/deploy-stale || true
  echo "file da rimuovere: $(wc -l < ~/deploy-stale)"
  xargs -r -d '\n' rm -f -- < ~/deploy-stale
  # Cartelle rimaste vuote, solo fra quelle che contenevano file rimossi.
  xargs -r -d '\n' -n 1 dirname < ~/deploy-stale | LC_ALL=C sort -u \
    | xargs -r -d '\n' rmdir -p --ignore-fail-on-non-empty -- 2>/dev/null || true
fi
mv ~/deploy-manifest.new ~/deploy-manifest
EOF
```

Note:

- **Al primo giro non cancella niente**: non esiste ancora un manifest vecchio. I file stantii accumulati fino a oggi si
  trovano una volta a mano confrontando `find . -type f` su `public_html` con il manifest, e vanno guardati uno per uno
  prima di cancellarli.
- **Un giro di ritardo, se serve**: chi ha la pagina vecchia aperta (o in cache nel service worker) chiede ancora i CSS e
  JS della release precedente. Per lasciarli vivi una release in più, confrontare con il manifest di due deploy fa
  (`deploy-manifest.prev`) invece che con l'ultimo.
- `-d '\n'` richiede GNU xargs (verifica 5). I nomi dei file generati da Astro non contengono a capo.

## Ordine consigliato

1. Verifiche della sezione iniziale, annotando i risultati in questo file.
2. Soluzione B da sola: è reversibile (basta togliere il passo) e risolve le pagine rimosse che rispondono ancora 200.
3. Soluzione A2 o A3 solo se le verifiche 2 e 3 sono positive, provata prima a mano con uno sha già pubblicato.
