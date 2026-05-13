---
title: 'Archon Online per Principi'
description: 'Creare un evento, gestire check-in, round, finali e report sulla piattaforma ufficiale VEKN.'
categoria: organizzare
audience: [principe]
ordine: 10
versione: '0.3'
aggiornato: 2026-05-13
correlate: [archon-giocatori, archon-judge]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma ufficiale VEKN per la gestione dei tornei di **Vampire: The Eternal Struggle**. Questa guida copre la parte _organizzatore_: creazione dell'evento, ciclo di torneo, finali, report. Per la parte _giocatore_ vedi [Archon Online per giocatori](/guide/archon-giocatori/); per il ruolo del giudice vedi [Archon Online per Giudici](/guide/archon-judge/).

Per creare tornei sanzionati _Constructed_ devi essere **Prince VEKN**. I non-Prince possono creare solo eventi _Demo_, _Launch Party_ e _Unsanctioned_. Per diventare Prince contatta il tuo National Coordinator. Riferimento: [How to run a V:TES tournament](https://www.vekn.net/how-to-run-a-v-tes-tournament).

> [!IMPORTANT]
> **Archon è il futuro, ma non è ancora "production-only".** Il _BCP Organized Play Coordinator_ ha dichiarato che il vecchio sistema calendario/eventi su `vekn.net` sarà gradualmente dismesso e che Archon va usato il più possibile. Al tempo stesso, fino a quando la sincronizzazione _archon → vekn.net_ non sarà stabile, gli eventi vanno **creati su `vekn.net`** e poi gestiti su Archon. Vedi sezione [Bug noti](#7-bug-noti-e-workaround) per i casi documentati.

## 1. Stati del torneo

Su Archon ogni torneo attraversa un ciclo definito di stati:

| Stato            | Cosa succede                                                   |
| ---------------- | -------------------------------------------------------------- |
| **PLANNED**      | Stato iniziale. Solo i giudici possono registrare giocatori.   |
| **REGISTRATION** | Registrazione self-service aperta ai giocatori.                |
| **WAITING**      | Check-in aperto. Gli iscritti possono ancora auto-registrarsi. |
| **PLAYING**      | Round in corso.                                                |
| **FINALS**       | Finale in corso.                                               |
| **FINISHED**     | Torneo chiuso, vincitore calcolato automaticamente.            |

Transizioni utili da ricordare:

- `WAITING → REGISTRATION` via **Cancel Check-in** (per consentire modifiche alle decklist).
- `PLAYING → REGISTRATION` dopo **Finish Round** (per gestire drop e iscrizioni last-minute prima del round successivo).

## 2. Creare un evento

### Procedura raccomandata: via calendario VEKN

La raccomandazione ufficiale VEKN è di creare gli eventi su [vekn.net → Create an Event](https://www.vekn.net/create-event). Una volta creati, gli eventi compaiono su Archon dopo la sincronizzazione **giornaliera**. Verifica poi su Archon che i dati coincidano (sono comunque modificabili dal _Tournament Manager_).

> [!NOTE]
> La sincronizzazione vekn.net → Archon è giornaliera, non immediata. Crea l'evento con sufficiente anticipo rispetto all'apertura iscrizioni.

### Procedura alternativa: archon.vekn.net (Create Tournament)

Dalla pagina **Tournaments** c'è il pulsante **Create Tournament** che apre un form completo (nome, formato, rank, proxies, multideck, decklist required, online, sede, date, fuso orario, descrizione in markdown, giudici e organizzatori). In teoria l'evento generato qui si sincronizza con `vekn.net`.

> [!WARNING]
> In pratica la sincronizzazione _archon → vekn.net_ ha ancora bug documentati su country, venue, proxies flag e rounds. Fino a comunicazione contraria della VEKN: **crea sempre da `vekn.net`** e gestisci da Archon.

### Registrare nuovi giocatori VEKN direttamente da Archon

Prince e National Coordinator possono creare nuovi account VEKN direttamente da Archon, senza passare dall'admin VEKN. Utile per registrazioni dell'ultimo minuto.

> [!NOTE]
> Il record del nuovo giocatore può non sincronizzarsi correttamente con il VEKN registry (casi noti: country errato). Se serve usarlo per upload futuri di archon Excel storici, conviene fare un giro di verifica con il proprio NC.

## 3. Tournament Manager

Aprendo un evento di cui sei organizzatore compare il pulsante <span class="archon-pill archon-pill--yellow">Tournament Manager</span> (i giocatori vedono solo la vista di iscrizione). Da qui gestisci l'intero ciclo del torneo.

### Tab Info

Permette di modificare i dati dell'evento (sede, descrizione, orari, ecc.) in qualsiasi momento.

### Tab Registration — Check-in

Mostra la lista degli iscritti (compresi i _drop_). All'orario di inizio apri il check-in e inserisci i giocatori effettivamente presenti.

Per ogni giocatore sono disponibili tre azioni:

- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: accede a sanzioni e decklist. Con il check-in aperto **non è possibile** aggiornare la decklist anche se il comando appare attivo.
- <span class="archon-btn archon-btn--check-in archon-btn--green" aria-hidden="true"></span> **check-in**: include il giocatore nel round.
- <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **drop**: ritiro dal torneo.

> [!NOTE]
> Distinto dal Drop: l'azione <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **Check out** (judge-only) marca un'**assenza temporanea** per uno o più round (giocatore che si allontana senza ritirarsi). Permette ri-check-in al round successivo. Il pulsante <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop** è il ritiro permanente; per il check-out temporaneo coordina con un giudice.

Comandi globali:

- <span class="archon-pill archon-pill--primary">Check everyone in</span>: fa check-in di tutti gli iscritti in un colpo solo.
- <span class="archon-pill archon-pill--grey">Cancel Check-in</span>: chiude il check-in (torna a stato `REGISTRATION`). Necessario per consentire modifiche alle decklist; dopo le modifiche riapri il check-in.
- <span class="archon-pill archon-pill--primary">Register / New Member</span>: registra last-minute un giocatore (richiede VEKN ID, o ne crea uno nuovo).
- <span class="archon-pill archon-pill--green">Start Round</span>: avvia il round, genera tavoli e seating.

### Tab Round — gestione del round

Durante il round i giocatori vedono il proprio tavolo sui loro dispositivi. L'organizzatore vede l'elenco completo dei tavoli.

- <span class="archon-btn archon-btn--pencil archon-btn--purple" aria-hidden="true"></span> **matita**: inserire il risultato del giocatore (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5 VP).
- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: sanzioni, view decklist.
- <span class="archon-btn archon-btn--seating archon-btn--yellow" aria-hidden="true"></span> **Alter Seating**: modifica gli accoppiamenti del round. Funzione poco testata: usare solo in casi eccezionali.
- <span class="archon-pill archon-pill--green">Finish Round</span>: chiude il round. Tutti i tavoli devono essere in stato _Finished_; per validare un punteggio irregolare prima della chiusura, vedi _Override_ sotto.

#### Override su punteggio irregolare

Il pulsante <span class="archon-pill archon-pill--yellow">Override</span> (judge-only) valida un punteggio non standard di tavolo — tipico caso: giocatore squalificato a metà round, VP che non sommano a 5 per ragioni regolamentari. Si applica al singolo tavolo con campi `round`, `table` e un `comment` obbligatorio. L'azione resta tracciata sul giudice che l'ha emessa. Per annullarla, rimuovi l'override dalla riga corrispondente con il <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> cestino.

Nei tornei medi/grandi l'override lo emette il **giudice**. Nei tornei piccoli dove tu sei sia Principe sia giudice, lo applichi tu — vedi [guida Giudice](/guide/archon-judge/#5-capability-del-giudice-e-ruolo-del-principe).

Dopo _Finish Round_ si torna a `REGISTRATION`: droppa chi abbandona, riapri il check-in e ripeti il ciclo fino alla fine dei round.

> [!TIP]
> **No-show automatico**: dalla v0.51 i giocatori registrati ma non presenti al check-in vengono droppati automaticamente. Non serve passarli a mano uno per uno.

### Modalità offline

Archon supporta una **modalità offline** per gestire un torneo in una sede senza connessione affidabile: gli eventi vengono conservati localmente e sincronizzati quando torna la connettività. La modalità offline **può essere disattivata da qualsiasi giudice** una volta tornata online — non serve essere il Principe creatore dell'evento.

## 4. Sanzioni

Dalla scheda **i (info)** raggiungibile da _Registration_ e da _Round_ si accede al modulo sanzioni del giocatore. Archon prevede **tre livelli**:

| Livello            | Effetto                          | Persistenza                                                                 |
| ------------------ | -------------------------------- | --------------------------------------------------------------------------- |
| `CAUTION`          | Solo informativa.                | Non registrata sul profilo.                                                 |
| `WARNING`          | Richiamo formale.                | Registrata sul profilo VEKN, visibile agli organizzatori nei tornei futuri. |
| `DISQUALIFICATION` | Rimuove il giocatore dal torneo. | Registrata sul profilo VEKN.                                                |

Le sanzioni possono essere categorizzate (campo `category`):

- `DECK_PROBLEM` — problema con la decklist.
- `PROCEDURAL_ERRORS` — errori procedurali.
- `CARD_DRAWING` — problemi di pesca.
- `MARKED_CARDS` — carte marcate.
- `SLOW_PLAY` — gioco lento.
- `UNSPORTSMANLIKE_CONDUCT` — comportamento antisportivo.
- `CHEATING` — comportamento fraudolento.

Un giudice può rimuovere una sanzione applicata cliccando il <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> cestino accanto alla sanzione — utile in caso di errore o di sanzione applicata in attesa di chiarimenti che poi rientrano.

> [!IMPORTANT]
> **`DISQUALIFICATION` ≠ Drop.** Per espellere un giocatore dal torneo per motivi disciplinari usa la sanzione `DISQUALIFICATION`, **non** il pulsante _Drop_. Il drop è un'azione neutra del giocatore o per cause logistiche; la squalifica resta nello storico VEKN e ha peso in tornei futuri.

In genere il flusso di lavoro è: il **Giudice** verifica e propone la sanzione, il **Principe** la registra (in tornei piccoli il Principe può essere anche giudice). Per il dettaglio del ruolo giudice vedi [Archon Online per Giudici](/guide/archon-judge/).

## 5. Finale

Dopo l'ultimo round, la finale si svolge in due step espliciti:

1. **Seed Finals** — il sistema calcola il seeding dei finalisti sulla base dei risultati. Verifica che tutti i finalisti siano presenti; chi non c'è va droppato prima del seeding.
2. **Seat Finals** — i finalisti scelgono il posto al tavolo nell'**ordine di seed** (regola VEKN: il top seed sceglie per ultimo). Archon gestisce l'inserimento delle scelte.

### Spareggio fra finalisti a pari merito

Quando due o più giocatori hanno GW/VP/TP identici, le loro righe nella modale **Seed Finals** vengono evidenziate in giallo e si abilita il pulsante <span class="archon-pill archon-pill--yellow">Toss</span> (icona moneta). Il campo numerico **Toss** accanto a ciascun giocatore in pari **non è il risultato del dado** ma l'**ordine post-spareggio**: 1 = seed migliore, 2 = seed successivo, e così via.

Due modi per assegnarlo:

- <span class="archon-pill archon-pill--yellow">Toss</span> — Archon estrae casualmente lui i valori per il gruppo in pari. Soluzione veloce se non hai dadi sotto mano.
- **Manuale**: fai un tiro fisico (dado, moneta) tra i giocatori coinvolti e inserisci `1` per il vincitore del tiro, `2` per il successivo, ecc. È la procedura "ufficiale" da tavolo, in linea con il [regolamento VEKN §3.1](https://www.vekn.net/tournament-rules) ("any fair random method").

> [!IMPORTANT]
> Il campo accetta `0`–`5` ma quello che conta è solo l'**ordinamento relativo all'interno del gruppo in pari**: il valore più basso prende il seed migliore. Non serve mappare il risultato del dado (`d6 = 4`) al campo — basta che chi tira meglio prenda `1`.

A finale conclusa, registra il risultato e chiudi il torneo: Archon calcola automaticamente il vincitore e la classifica finale, e tenta la sincronizzazione con `vekn.net`.

Pagine utili da condividere coi giocatori:

- Vista pubblica del torneo: `archon.vekn.net/tournament/<uuid>/display.html`
- Console organizzatore (privata): `archon.vekn.net/tournament/<uuid>/console.html`

## 6. Tempistiche VEKN e formati

Dal [regolamento ufficiale VEKN](https://www.vekn.net/tournament-rules):

- **Sanzione VEKN**: richiedere la sanzione almeno **28 giorni** prima dell'evento.
- **Annuncio**: l'evento deve essere pubblicizzato almeno **28 giorni** prima, indicando data, ora e luogo.
- **Archiviazione**: l'organizzatore deve conservare copia del report per almeno **1 anno**.

### Chi può sanzionare cosa

- **Prince VEKN**: tutti i formati sanzionati (_Standard Constructed_, _Limited_, _National Championship_, _Continental Qualifier_, ecc.).
- **Non-Prince**: solo eventi _Demo_, _Launch Party_ e _Unsanctioned_.

### Tornei online

Per registrare un torneo online basta selezionare la spunta **Online tournament** nel form di creazione su `vekn.net`. L'evento sarà visibile su Archon attivando il toggle **Include Online**.

Specificità Archon per i tornei online:

- **Pairing on-demand**: Archon genera pairing e seating al momento — utile per sessioni multiple in una league. Quando possibile usa il _seating ottimale pre-calcolato_ dal foglio Excel storico VEKN (introdotto in repo v0.63).
- **Multideck**: i formati online sono in genere multideck (deck diverso per round); il _VEKN Online Constructed Ranking_ riconosce il formato.
- **Riconciliazione standings**: i standings di Archon su league online hanno avuto bug storici — vedi [Bug noti](#7-bug-noti-e-workaround) e usa [vtes-hook.com](https://www.vtes-hook.com) come fallback prima di pubblicare la classifica.

Gli aspetti operativi non-Archon (Discord per registrazioni e voce, Lackey CCG per il gioco) restano fuori dallo scope di questa guida.

## 7. Bug noti e workaround

> [!WARNING]
> Quanto segue è una sintesi dei bug documentati sul forum VEKN (Prince List e Organizational Questions) e nel repo [vtes-biased/archon](https://github.com/vtes-biased/archon) tra novembre 2025 e maggio 2026. La situazione cambia rapidamente: prima di assumere che un bug sia ancora aperto, controlla il [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md).

**Import evento archon → vekn.net con campi sbagliati.** Casi documentati: paese (evento ungherese finito a Palma de Mallorca), _proxies allowed_ invertito, venue, rounds, _limitedness_. _Workaround_: crea sempre l'evento da `vekn.net`, non con _Create Tournament_ di Archon. Se l'errore è già accaduto, in casi gravi conviene cancellare l'evento e ricrearlo su `vekn.net`.

**Sync nuovo giocatore Archon → VEKN registry.** Quando crei un nuovo player da Archon, può finire nel registry con country sbagliato. _Workaround_: verifica col tuo National Coordinator prima di affidarsi al record per upload archon Excel storici.

**"Unable to finish tournament" → internal server error.** Causa identificata da Lionel Panhaleux (sviluppatore di Archon, `lip` sul forum, ott 2025): la chiusura del torneo su Archon prova a inviare i risultati a `vekn.net`; se sul lato VEKN risulta già caricato un archon Excel storico per quell'evento, il submit fallisce e Archon non riesce a chiudere il torneo. _Workaround_: contatta il National Coordinator e chiedi di rimuovere il file archon già caricato lato `vekn.net`, poi ritenta la chiusura.

**Finalisti non vedono i risultati post-chiusura.** I finalisti, una volta che il torneo è in stato `FINISHED`, non sempre vedono i risultati della finale dalla loro vista. _Workaround_: condividi manualmente il link `display.html` del torneo.

**Conteggio "registered" include i drop.** Chi si pre-registra e poi droppa resta visibile nel conteggio "registered" del torneo. _Mitigazione_: nei comunicati pre-evento, riferisci il conteggio reale (registered − drop) per evitare aspettative sbagliate.

**Decklist visibili all'organizer in conflitto di interesse.** In tornei piccoli il Principe può essere anche giocatore: in quel caso vede tutte le decklist degli avversari. _Mitigazione etica_: demanda la _decklist review_ a un giudice non giocante (oppure a un Principe ospite) e annota chi ha controllato le liste nel report finale.

**Pairing irregolare in tornei piccoli.** Casi segnalati di giocatori che hanno incontrato 6-7 persone diverse in 2 round invece delle 8 attese (interpretazione della regola "no pair of players share a table through every single round"). _Mitigazione_: se possibile rivedi manualmente le seating dei tavoli prima di _Start Round_.

**Standings buggati per league online (storico).** Bug ricorrenti nei tornei online. _Workaround_: confronta con [vtes-hook.com](https://www.vtes-hook.com) come fallback.

## 8. Report a fine torneo

Una volta concluso il torneo e sincronizzati i dati con `vekn.net`, crea il post sul forum nella sezione [Event Reports and TWD](https://www.vekn.net/forum/event-reports-and-twd) e attendi l'approvazione del National Coordinator (che ha poteri di _tournament organizer_ su tutti i tornei della sua nazione).

Buona pratica: includi nel post sia il link all'evento su `vekn.net` sia la pagina `archon.vekn.net/tournament/<uuid>/display.html`, e — se hai applicato sanzioni rilevanti — la lista (senza dati personali sensibili).

> [!TIP]
> A fine torneo gli organizzatori possono **scaricare un file di testo pulito** del torneo (risultati, seating, sanzioni) dalla console Tournament Manager. Utile come backup locale, oltre alla copia per la VEKN.

## 9. Bug e segnalazioni

Archon Online è open source in sviluppo attivo. Il repository ufficiale è [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon). Per segnalare bug o suggerimenti sulla UI usa il pulsante **Report Issue** in alto a destra in ogni pagina di `archon.vekn.net` (apre un'issue su GitHub; serve un account GitHub gratuito).

Prima di segnalare, verifica che il bug non sia già noto: alcuni sono in fase di risoluzione e sono indicati nella sezione [Bug noti](#7-bug-noti-e-workaround) di questa guida o nel [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md).
