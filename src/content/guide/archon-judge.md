---
title: 'Archon Online per Giudici'
description: 'Verificare le decklist, applicare sanzioni e intervenire durante i round dalla piattaforma ufficiale VEKN.'
categoria: organizzare
audience: [judge]
ordine: 20
versione: '0.3'
aggiornato: 2026-05-13
correlate: [archon-giocatori, archon-principi]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma ufficiale VEKN per la gestione dei tornei di **Vampire: The Eternal Struggle**. Questa guida è dedicata ai **Giudici** (_Judges_): cosa puoi fare dal portale durante un torneo e come coordinarti con il Principe organizzatore. Per la creazione dell'evento e il ciclo completo vedi [Archon Online per Principi](/guide/archon-principi/).

> [!NOTE]
> Il Giudice e il Principe sono **ruoli operativi distinti** ma con poteri **largamente sovrapponibili** sul portale. In tornei medi/grandi è prassi separarli (Principe = organizzazione/flow, Giudice = verifica decklist, sanzioni, chiamate a tavolo). In tornei piccoli è normale che la stessa persona indossi entrambi i cappelli, e Archon non vincola formalmente la divisione. Vedi [§5](#5-capability-del-giudice-e-ruolo-del-principe) per la mappa completa.

## 1. Come diventare giudice di un torneo

Per operare come giudice su un torneo Archon devi essere stato aggiunto dall'organizzatore al campo **Judges and Organizers** in fase di creazione (o successivamente dal _Tournament Manager_, tab _Info_). Senza questa associazione la piattaforma ti mostra l'evento come a un giocatore qualunque.

Verifica con il Principe **prima dell'inizio** del torneo:

- che il tuo account Archon (Discord o email) sia quello corretto;
- che il tuo VEKN ID sia stato aggiunto come judge sull'evento;
- accedi all'evento e controlla che compaia il pulsante <span class="archon-pill archon-pill--yellow">Tournament Manager</span>.

### Ruoli VEKN nel sistema

Archon distingue diversi gradi VEKN (`MemberRole` nel codice sorgente):

- **`JUDGE`** — judge standard.
- **`RULEMONGER`** — "super-judge", riferimento per le interpretazioni regolamentari.
- **`JUDGEKIN`** — judge in formazione (mentoring).
- **`PRINCE`** — organizzatore con sanzione VEKN per Constructed.
- **`NC`** — National Coordinator.
- Altri: `ADMIN`, `PTC` (Playtest Coordinator), `PLAYTESTER`, `ETHICS` (Ethics Committee).

Sul portale, ai fini operativi del torneo (capability nel _Tournament Manager_), gli effetti pratici di `JUDGE` / `RULEMONGER` / `JUDGEKIN` sono allineati: il grado VEKN incide su responsabilità formali e nomine, non su cosa puoi cliccare.

## 2. Verifica delle decklist

Le decklist si verificano dal **Tournament Manager → tab Registration**, prima dell'inizio del primo round.

Per ogni giocatore in elenco è disponibile il pulsante <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** che apre la scheda con _sanzioni_ e _decklist_. La decklist viene mostrata in formato testuale: controllo della legalità del mazzo (formato, totale carte, banlist) si fa qui.

Se trovi una lista non conforme:

- avvisa subito il Principe;
- chiedi al giocatore di correggere la lista.

> [!WARNING]
> Con il **check-in aperto** il giocatore **non può** modificare la decklist anche se il comando appare attivo nella sua interfaccia. Per consentire l'edit serve che il Principe usi <span class="archon-pill archon-pill--grey">Cancel Check-in</span>, lasci correggere il giocatore, poi riapra il check-in. Coordina sempre questo passaggio con l'organizzatore.

## 3. Sanzioni

Dalla stessa scheda <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** raggiungibile dal tab _Registration_ e dal tab _Round_ si accede al modulo **sanzioni** del giocatore. Archon prevede **tre livelli** di sanzione, distinti per effetto e persistenza:

| Livello            | Effetto sul torneo                          | Persistenza storico VEKN                                   |
| ------------------ | ------------------------------------------- | ---------------------------------------------------------- |
| `CAUTION`          | Solo informativa, nessun effetto meccanico. | Non registrata sul profilo.                                |
| `WARNING`          | Richiamo formale.                           | Registrata, visibile agli organizzatori nei tornei futuri. |
| `DISQUALIFICATION` | Rimuove il giocatore dal torneo.            | Registrata sul profilo VEKN.                               |

A ciascuna sanzione puoi associare una **categoria** che chiarisce il motivo:

- `DECK_PROBLEM` — problema con la decklist.
- `PROCEDURAL_ERRORS` — errori procedurali.
- `CARD_DRAWING` — problemi di pesca.
- `MARKED_CARDS` — carte marcate.
- `SLOW_PLAY` — gioco lento.
- `UNSPORTSMANLIKE_CONDUCT` — comportamento antisportivo.
- `CHEATING` — comportamento fraudolento.

Compila sempre **categoria** e **motivazione** in chiaro: chi rileggerà la sanzione fra sei mesi deve potersi orientare.

> [!NOTE]
> **Audit trail.** Ogni sanzione registra esplicitamente il **giudice che l'ha emessa** (campo `judge` nel modello `Sanction`) oltre al `comment`. Le sanzioni non sono anonime: in revisione futura si sa chi ha applicato cosa, e perché. Questo vale anche per `Unsanction` (chi ha rimosso) e per gli `Override` di punteggio (vedi §4).

### Rimuovere una sanzione

Se hai applicato una sanzione per errore o se la situazione si è poi chiarita, puoi rimuoverla cliccando il <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> cestino accanto alla sanzione nella scheda del giocatore. Coordinati con il Principe: in genere è bene farlo prima della chiusura del torneo, così la versione "pulita" finisce nel report finale.

> [!IMPORTANT]
> **`DISQUALIFICATION` ≠ Drop.** Per espellere un giocatore dal torneo per motivi disciplinari **usa la sanzione `DISQUALIFICATION`**, non il pulsante <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop**. Il drop è un'azione neutra del giocatore (rinuncia volontaria, motivi logistici); la squalifica resta nello storico VEKN e ha peso nei tornei futuri. Confondere le due cose svaluta sia il drop che la squalifica.

> [!TIP]
> `CAUTION` non lascia traccia: usala per primi richiami dove vuoi che il giocatore sia informato senza penalizzazioni. `WARNING` invece pesa nel medio termine: applicala se il comportamento è già stato segnalato verbalmente o se ritieni che il giocatore debba averne un record consultabile dagli organizzatori futuri.

> [!TIP]
> Nei **tornei online**, in assenza di clock fisico, `SLOW_PLAY` è la sanzione più ricorrente; `UNSPORTSMANLIKE_CONDUCT` copre disconnect intenzionali e abbandono del canale vocale.

## 4. Interventi durante il round

Dal **tab Round** del Tournament Manager vedi l'elenco completo dei tavoli. Per ogni giocatore al tavolo:

- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: rapida verifica della decklist e dello storico sanzioni di quel giocatore, utile quando arrivi al tavolo per una chiamata.
- <span class="archon-btn archon-btn--pencil archon-btn--purple" aria-hidden="true"></span> **matita** (inserimento risultati): in tornei medi/grandi è il Principe a inserire i VP; in tornei piccoli o quando ti viene chiesto, lo fai tu. I risultati che imposti come giudice **sono autoritativi**: i giocatori non possono sovrascriverli dalla loro vista (commento esplicito nel codice `TableSeat`).

> [!TIP]
> Per le chiamate a tavolo, leggi la regola dal regolamento ufficiale prima di rispondere, anche se la sai a memoria: i giocatori si fidano di più di una risposta dove ti vedono consultare la fonte. Il [VEKN Rulebook](https://www.vekn.net/rulebook) è consultabile online dal cellulare.

### Override su punteggio irregolare

A volte un tavolo chiude con un punteggio "non standard" che il sistema non accetterebbe in flusso normale: tipico caso una squalifica a metà round, oppure VP che non sommano a 5 per ragioni regolamentari. In quei casi serve il pulsante <span class="archon-pill archon-pill--yellow">Override</span> (judge-only).

Lo override si applica al singolo tavolo con tre campi:

- `round` — numero del round.
- `table` — numero del tavolo.
- `comment` — motivazione obbligatoria in chiaro (es. "DQ giocatore P3 al round 2 per `CHEATING`, VP redistribuiti come da regolamento").

L'azione resta tracciata sul tuo nome. Per annullare un override già emesso, rimuovilo dalla riga con il <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> cestino.

### CheckOut (assenza temporanea)

Distinta dal Drop, l'azione <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **Check out** marca un giocatore come **temporaneamente assente** per uno o più round (es. si è allontanato per un round senza ritirarsi). Permette ri-check-in al round successivo, mentre il Drop è permanente. Usala quando il Principe ti chiede di "saltare" un giocatore senza dropparlo definitivamente.

## 5. Capability del Giudice e ruolo del Principe

Il README di Archon ([vtes-biased/archon](https://github.com/vtes-biased/archon)) elenca esplicitamente le capability del Giudice. Sul portale puoi:

- **Registrazione**: `OpenRegistration` / `CloseRegistration`, `Register` (anche `New Member` con creazione VEKN ID).
- **Check-in**: `OpenCheckin`, `CancelCheckin`, `CheckIn`, `CheckEveryoneIn`, `CheckOut`, `Drop`.
- **Round**: `Alter Seating` (modifica accoppiamenti pre-round).
- **Punteggi**: `Override` / `Unoverride` di un singolo tavolo (vedi §4).
- **Sanzioni**: `Sanction` / `Unsanction` (vedi §3).
- **Finale**: `SeedFinals` (calcolo seeding finalisti) + `SeatFinals` (assegnazione posti). Tecnicamente sono eventi judge-only: in un torneo dove il Principe non è anche giudice, serve un giudice presente per la finale.

Restano **esclusive del Principe organizzatore** (non azionabili come Judge):

- `RoundStart` / `RoundFinish` / `RoundCancel` — avvio, chiusura e annullamento di un round.
- `Finish` — chiusura del torneo e submit risultati a `vekn.net`.
- Editing dei metadati evento (sede, descrizione, orari, ecc.) dal tab _Info_.

> [!IMPORTANT]
> **Ruolo misto in tornei piccoli.** Quando il Principe è anche unico giudice (caso tipico nei tornei locali), la distinzione qui sopra cade: la stessa persona ha entrambi i set di capability. Ai fini pratici questo amplia ciò che puoi fare ma **non riduce le responsabilità**: anche se fai tutto da solo, applica le buone prassi di entrambi i ruoli (audit trail nelle sanzioni, commento esplicito negli override, separazione concettuale fra Drop e Disqualification).

## 6. Modalità offline

Archon supporta una **modalità offline** per tornei in sedi senza connessione affidabile: gli eventi vengono conservati localmente e sincronizzati quando torna la connettività. La modalità offline **può essere disattivata da qualsiasi giudice** una volta tornata online — non serve essere il Principe creatore dell'evento, basta avere il ruolo Judge sul torneo.

## 7. Coordinamento con l'organizzatore

Buone prassi prima e durante il torneo:

- **Briefing iniziale** (5 minuti prima del check-in): formato, eventuali deroghe annunciate, banlist applicata, _proxies_ ammessi o no.
- **Canale di comunicazione rapido** (chat, Telegram, voce diretta) con il Principe per coordinare apertura/chiusura check-in quando serve correggere decklist.
- **Note di fine torneo**: passa al Principe l'elenco delle sanzioni applicate e il contesto, in modo che possa includerlo nel post di report se rilevante.

## Riferimenti

- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules) — regolamento ufficiale dei tornei.
- [VEKN Rulebook](https://www.vekn.net/rulebook) — regolamento di gioco.
- Repository ufficiale Archon Online: [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon).
- Per bug o suggerimenti sulla UI di Archon, pulsante **Report Issue** in alto a destra in ogni pagina di `archon.vekn.net` (serve account GitHub).
