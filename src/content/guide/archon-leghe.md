---
title: 'Archon Online: Leghe'
description: 'Creare e gestire una lega su Archon: serie di tornei, ranking RTP/GP/Score, leghe annidate (Meta-League).'
categoria: organizzare
audience: [principe]
ordine: 30
versione: '0.1'
aggiornato: 2026-05-18
correlate: [archon-principi, archon-giocatori, archon-judge]
locale: it
---

[Archon Online](https://archon.vekn.net) supporta le **leghe** dalla v0.51: una lega è una **serie di tornei** raggruppati che genera una classifica cumulativa unica. È lo strumento standard per le _league online_ europee (sessioni mensili o settimanali su Lackey/Discord), ma funziona anche per cicli locali in presenza.

Questa guida copre la parte _organizzatore_. Per la creazione del singolo torneo e il ciclo di torneo classico vedi [Archon Online per Principi](/guide/archon-principi/); per il punto di vista del giocatore [Archon Online per giocatori](/guide/archon-giocatori/).

> [!NOTE]
> La feature lega è recente (v0.51, novembre 2025) e in evoluzione: alcuni dettagli operativi della UI cambiano fra release. Quando questa guida e l'interfaccia divergono, **fa fede l'interfaccia** — apri una issue sul [repo Archon](https://github.com/vtes-biased/archon) o segnalalo al National Coordinator perché aggiorniamo la guida.

## 1. Cos'è una lega su Archon

Una lega è un **contenitore di tornei** con classifica aggregata calcolata da Archon. La pagina **Leagues** la descrive come _"Leagues are groups of tournaments"_. Caratteristiche:

- **Tre algoritmi di ranking** selezionabili in creazione: `RTP`, `GP`, `Score` (vedi [Punteggio](#4-punteggio-della-lega)).
- **Due tipi di lega** (campo _Type_): `League` (la lega aggrega direttamente tornei — è il caso normale) e `Meta-League` (la lega aggrega altre leghe — vedi [Meta-League](#5-meta-league-leghe-annidate)).
- **Finali escluse** dal cumulativo (changelog v0.51, _"pure score ranking (finals excluded)"_): la classifica di lega premia la performance nei round, non l'esito della finale.

Non è un nuovo formato di gioco: i singoli tornei della lega restano normali tornei VEKN (Constructed, V5, Limited, Draft) con propri stati, decklist e finale. La lega è uno strato **sopra** ai tornei, non al loro posto.

## 2. Creare una lega

> [!IMPORTANT]
> Come per i tornei (vedi [Procedura raccomandata](/guide/archon-principi/#2-creare-un-evento)), finché la sincronizzazione _archon → vekn.net_ non sarà stabile **annuncia la lega sul calendario VEKN** e gestiscila operativamente su Archon. Resta valido il vincolo VEKN dei **28 giorni** di anticipo per l'annuncio.

Dalla pagina **Leagues** di Archon (sezione visibile a chi ha il ruolo organizzatore) compare il pulsante <span class="archon-pill archon-pill--primary">Create League</span>. Il form chiede:

- **League name** — nome della lega (es. _Italian Online League — Spring 2026_).
- **Format** — formato dei tornei della lega: `Standard`, `V5`, `Limited`, `Draft`.
- **Ranking** — algoritmo di classifica: `RTP`, `GP`, `Score` (vedi [Punteggio](#4-punteggio-della-lega)).
- **Type** — `League` (lega che aggrega direttamente tornei: è il caso normale) o `Meta-League` (lega che aggrega altre leghe: vedi [Meta-League](#5-meta-league-leghe-annidate)).
- **Online** — toggle: rende la lega filtrabile col toggle **Include Online** su Archon.
- **Country** — nazione di riferimento; per leghe internazionali c'è l'opzione _Worldwide 🌍_.
- **Parent League (Optional)** — se non vuoto, innesta la lega dentro una Meta-League esistente.
- **Start** / **Finish** / **Timezone** — date di inizio/fine e fuso orario.
- **Description** — in [markdown](https://www.markdownguide.org/): usala per regolamento sintetico, calendario, tie-break, premi.
- **Add Judge** — aggiunge giudici/organizzatori della lega.

Per confermare usa <span class="archon-pill archon-pill--primary">Submit</span>; <span class="archon-pill archon-pill--grey">Cancel</span> annulla.

> [!TIP]
> **Start date obbligatoria, Finish opzionale.** La UI valida "A start date is required"; il campo Finish è "Optional finish date/time". Per leghe a calendario fisso conviene comunque compilare anche Finish, così i giocatori sanno fino a quando contano i risultati.

Una volta creata, la lega è in stato "vuoto" (zero contenders e zero tornei). Il passo successivo è associare alla lega i tornei (o le sotto-leghe).

## 3. Aggiungere tornei a una lega

I tornei non si aggiungono dalla pagina della lega. Il messaggio in-app è esplicito:

> _"To add a tournament, set the league in the tournament info page."_

Procedura (lega già creata):

1. Crea il torneo come al solito (vedi [Creare un evento](/guide/archon-principi/#2-creare-un-evento) nella guida per Principi se è la prima volta).
2. Apri il torneo creato e clicca <span class="archon-pill archon-pill--yellow">Tournament Manager</span> → tab **Info**.
3. Imposta il campo **league** sulla lega creata e salva.

Se vuoi inserire un torneo **già esistente** in una lega, applica i passi 2 e 3 sul torneo già creato.

Buone prassi:

- Crea **prima la lega**, poi i tornei: assegnare la lega in fase di creazione del torneo evita giri di modifica.
- Tieni **coerenti Format e Ranking** fra i tornei della lega: cambiare formato a metà serie genera classifiche difficili da spiegare ai partecipanti.
- Per le leghe online, attiva il flag **Online tournament** anche sui singoli appuntamenti, non solo sulla lega.

> [!WARNING]
> **Eventi caricati a posteriori (Excel storici archon).** Se importi risultati storici via file archon Excel, verifica che il file riferisca correttamente la lega: un torneo archon caricato senza link alla lega non entra nel cumulativo. Coordina con il National Coordinator prima del bulk upload.

## 4. Punteggio della lega

Archon offre **tre algoritmi di ranking** per la classifica di lega, scelti in fase di creazione tramite il campo **Ranking**:

| Algoritmo                          | Quando usarlo                                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Score` — _pure score_ cumulativo  | Somma GW/VP/TP dei round dei tornei collegati. **Finali escluse**. È il default storico (changelog v0.51).                                                              |
| `RTP` — _Rating Tournament Points_ | Ranking pesato sul rating VEKN dei tornei. Usalo per leghe lunghe in cui pesi diversi (campionato vs amichevoli) hanno senso. Verifica con il tuo National Coordinator. |
| `GP` — _Grand Prix_ style          | Punti assegnati per posizione (1°/2°/3°), tipo Grand Prix. Usalo per leghe dove conta più il piazzamento per tappa che il cumulativo grezzo.                            |

> [!NOTE]
> Le tre voci sono esposte come opzioni del campo `Ranking`, ma il _calcolo esatto_ è in `archon/scoring.py`: scegliere fra RTP, GP e Score significa scegliere _come_ Archon trasformerà i risultati dei tornei nella classifica di lega. Prima di chiudere una lega nuova con `RTP` o `GP`, fai una verifica a mano su 2-3 giocatori per assicurarti che la formula scelta produca il risultato che ti aspetti.

### Tie-break e regole di scarto

Archon mostra la classifica così com'è (Rank, VEKN #, Name, City, Country, Result): se la tua lega applica **scarti** (best 4 di 6, ecc.) o **tie-break personalizzati**, gestisci la classifica finale a parte (es. foglio Excel o [vtes-hook.com](https://www.vtes-hook.com)) e pubblica la classifica "ufficiale" come allegato al post di chiusura. Annota il criterio di scarto nella _Description_ in fase di creazione, così i giocatori sanno cosa aspettarsi.

## 5. Meta-League (leghe annidate)

Una lega di tipo `Meta-League` contiene **altre leghe** invece di tornei diretti. La maggior parte delle leghe (singola stagione, calendario lineare) usa il tipo `League` semplice e **non** ha bisogno di Meta-League. Usala solo per casi tipo:

- **Stagioni multi-circuito**: una _stagione_ (Meta-League) aggrega più _circuiti_ (League), divisi per area geografica o per formato.
- **Qualifiche → finale di lega**: una Meta-League "annuale" raccoglie più tornate di qualificazione, ognuna una League.

Come per i tornei, **il collegamento si imposta dalla lega figlia**, non dalla Meta-League. Il messaggio in-app:

> _"To add a league, set the parent in the league page."_

Procedura:

1. Crea prima la Meta-League (Type = `Meta-League`).
2. Apri la lega figlia con il pulsante <span class="archon-pill archon-pill--primary">Edit</span> e imposta **Parent League** sulla Meta-League appena creata, poi <span class="archon-pill archon-pill--primary">Submit</span>.

Sulla pagina della Meta-League compare la sezione **Child Leagues** con le colonne `Name`, `Start Date`, `Format`, `Ranking`, `Location`.

> [!TIP]
> Tieni la gerarchia **piatta** se puoi: due livelli (Meta-League → League → tornei) sono in genere sufficienti. Tre o più livelli rendono la classifica difficile da raccontare ai giocatori e moltiplicano i punti di rottura quando un torneo viene riassegnato.

## 6. Operatività durante la lega

La lega "vive" mentre i suoi tornei vengono giocati. Quando apri una lega dalla lista, la sua pagina pubblica mostra:

- **Badge `Online`** (se la lega è online), contatore **contenders** (giocatori distinti che hanno partecipato ad almeno un torneo).
- **Organizers** (giudici e organizzatori della lega).
- **Child Leagues** — se è una Meta-League.
- **Tournaments** — elenco dei tornei con `Name`, `Date`, `Format` e stato (`Planned`, `Registration`, `In Progress`, `Finished`).
- **Rankings** — classifica cumulativa (`Rank`, `VEKN #`, `Name`, `City`, `Country`, `Result`).

Cose da ricordare:

- **Ogni torneo della lega ha il proprio ciclo** (PLANNED → REGISTRATION → WAITING → PLAYING → FINALS → FINISHED): la lega non sovrascrive gli stati dei figli.
- **Decklist e sanzioni** sono per-torneo, non per-lega: un `WARNING` applicato in tappa 1 resta sul profilo VEKN del giocatore ma non viene "ereditato" come stato attivo nelle tappe successive.
- **Drop di tappa ≠ drop di lega**: un giocatore che droppa il torneo 3 può comunque iscriversi al torneo 4. Se vuoi un meccanismo "fuori dalla lega definitivamente", documentalo nel regolamento e tienine traccia a mano: Archon non ha (ancora) un flag _league drop_ separato.
- **Multideck**: standard per le league online europee. Permette decklist diverse per ogni round e correzioni per round senza toccare gli altri. Vedi [Multideck per giocatori](/guide/archon-giocatori/#tornei-multideck).
- **Pairing on-demand**: nelle sessioni online Archon genera i tavoli al momento. Per league con molti partecipanti, quando puoi, usa il _seating ottimale pre-calcolato_ dal foglio Excel storico VEKN al posto del pairing automatico.

### Modificare o cancellare una lega

Sulla pagina della lega, gli organizzatori vedono i pulsanti <span class="archon-pill archon-pill--primary">Edit</span> e <span class="archon-pill archon-pill--red">Delete</span>.

> [!WARNING]
> Il dialogo di conferma di Delete avverte: _"This will permanently and officially delete this league. Tournaments will be kept."_ I tornei collegati **non vengono cancellati** quando elimini la lega: restano come tornei autonomi senza più riferimento a quella lega. Se vuoi anche eliminare i tornei, fallo a mano dalle pagine dei tornei stessi.

## 7. Standings e cross-check

La sezione **Rankings** della pagina lega è soggetta agli stessi bug ricorrenti degli standings online (vedi [Bug noti per Principi](/guide/archon-principi/#7-bug-noti-e-workaround)). Prima di pubblicare la classifica finale:

- **Confronta con [vtes-hook.com](https://www.vtes-hook.com)**: ricalcola i totali dai singoli tornei e verifica che coincidano con quanto mostrato da Archon.
- **Controlla che tutti i tornei della lega siano in stato `Finished`**: una tappa rimasta in `In Progress` o `Registration` può falsare i totali.
- **Se applichi scarti o tie-break custom**, pubblica anche la classifica "grezza" di Archon così i giocatori possono verificare i propri punteggi sessione per sessione.

## 8. Bug noti

> [!WARNING]
> Sintesi dei bug documentati sul [repo Archon](https://github.com/vtes-biased/archon) e nel [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md) tra novembre 2025 e maggio 2026. Verifica sul CHANGELOG aggiornato prima di assumere che un bug sia ancora aperto.

**Vista lega su torneo vuoto.** Storicamente la vista lega andava in errore quando un torneo collegato era ancora vuoto (zero iscritti). Risolto in v0.64 (_"Fix league view on niche case (empty tournament)"_). Se vedi ancora il problema, segnalalo.

**Standings online buggati (storico).** Bug ricorrenti sui standings online si riflettono anche sulla classifica di lega: usa [vtes-hook.com](https://www.vtes-hook.com) come fallback prima di pubblicare la classifica finale.

**Sync archon → vekn.net.** Lo stesso pattern di bug dei tornei (campi country/venue/proxies sbagliati post-import) può ripresentarsi sui contenitori lega: meglio annunciare la lega su `vekn.net` e gestirla da Archon (vedi [Bug noti — Principi](/guide/archon-principi/#7-bug-noti-e-workaround)).

## 9. Riferimenti

- [Archon Online per Principi](/guide/archon-principi/) — creazione del singolo torneo, ciclo, finale, report.
- [Archon Online per Giudici](/guide/archon-judge/) — decklist, sanzioni, override.
- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules) — regolamento ufficiale dei tornei.
- Repository Archon: [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon) e [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md).
- [vtes-hook.com](https://www.vtes-hook.com) — fallback per la verifica dei standings.
