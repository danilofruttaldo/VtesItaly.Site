---
title: 'Archon Online per Giudici'
description: 'Verificare le decklist, applicare sanzioni e intervenire durante i round dalla piattaforma ufficiale VEKN.'
categoria: organizzare
audience: [judge]
ordine: 20
versione: '0.5'
aggiornato: 2026-05-14
correlate: [archon-giocatori, archon-principi]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma ufficiale VEKN per la gestione dei tornei di **Vampire: The Eternal Struggle**. Questa guida è dedicata ai **Giudici** (_Judges_): cosa puoi fare dal portale durante un torneo e come coordinarti con il Principe organizzatore. Per la creazione dell'evento e il ciclo completo vedi [Archon Online per Principi](/guide/archon-principi/).

> [!NOTE]
> Il Giudice e il Principe sono **ruoli operativi distinti** ma con poteri **largamente sovrapponibili** sul portale. In tornei medi/grandi è prassi separarli (Principe = organizzazione/flow, Giudice = verifica decklist, sanzioni, chiamate a tavolo). In tornei piccoli è normale che la stessa persona indossi entrambi i cappelli, e Archon non vincola formalmente la divisione. Vedi la [mappa completa delle capability](#5-cosa-puoi-fare-come-giudice-e-cosa-no).

## 1. Come diventare giudice di un torneo

Per operare come giudice su un torneo Archon devi essere stato aggiunto dall'organizzatore al campo **Judges and Organizers** in fase di creazione (o successivamente dal _Tournament Manager_, tab _Info_). Senza questa associazione la piattaforma ti mostra l'evento come a un giocatore qualunque.

Verifica con il Principe **prima dell'inizio** del torneo:

- che il tuo account Archon (Discord o email) sia quello corretto;
- che il tuo VEKN ID sia stato aggiunto come judge sull'evento;
- accedi all'evento e controlla che compaia il pulsante <span class="archon-pill archon-pill--yellow">Tournament Manager</span>.

### Ruoli VEKN nel sistema

Archon riconosce diversi gradi VEKN — `JUDGEKIN`, `JUDGE`, `RULEMONGER` per i giudici; `PRINCE` per gli organizzatori con sanzione VEKN per Constructed; oltre a `NC` (National Coordinator), `ADMIN`, `PTC` (Playtest Coordinator), `PLAYTESTER`, `ETHICS` (Ethics Committee). Ai fini del Tournament Manager, **tutti i gradi judge hanno gli stessi permessi**: il grado conta per responsabilità formali e nomine (es. `RULEMONGER`, nominato dal VEKN Rules Director, co-mantiene rulebook, rulings e judges test), non per cosa puoi cliccare sul portale.

## 2. Verifica delle decklist

Le decklist si verificano dal **Tournament Manager → tab Registration**, prima dell'inizio del primo round.

Su ogni giocatore in elenco trovi il pulsante <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**, che apre la scheda con _sanzioni_ e _decklist_. La decklist è in formato testo: qui controlli la legalità del mazzo (formato, totale carte, banlist).

Se trovi una lista non conforme:

- avvisa subito il Principe;
- chiedi al giocatore di correggere la lista.

> [!WARNING]
> Con il **check-in aperto** il giocatore **non può** modificare la decklist anche se il comando appare attivo nella sua interfaccia. Per consentire l'edit serve che il Principe usi <span class="archon-pill archon-pill--grey">Cancel Check-in</span>, lasci correggere il giocatore, poi riapra il check-in. Coordina sempre questo passaggio con l'organizzatore.

## 3. Sanzioni

Dalla stessa scheda <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** raggiungibile dal tab _Registration_ e dal tab _Round_ si accede al modulo **sanzioni** del giocatore. Archon prevede **quattro livelli** di sanzione, cumulativi per gravità e tracciamento:

| Livello            | Effetto sul torneo                                                                       | Registrazione                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `CAUTION`          | Solo informativa, nessun effetto meccanico — richiamo verbale al giocatore.              | **Non registrata** nel database VEKN (richiamo informale).      |
| `WARNING`          | Richiamo formale.                                                                        | Registrata sul profilo VEKN pubblico, consultabile da chiunque. |
| `GAME_LOSS`        | Sconfitta forzata del giocatore al tavolo corrente. Accompagnata sempre da un `WARNING`. | Registrata sul profilo VEKN pubblico (incluso il `WARNING`).    |
| `DISQUALIFICATION` | Rimuove il giocatore dal torneo (eventualmente "without prize" nei casi gravi).          | Registrata sul profilo VEKN pubblico.                           |

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
> **Tracciabilità.** Ogni sanzione registra esplicitamente il **giudice che l'ha emessa** e la motivazione. Le sanzioni non sono anonime: in revisione futura si sa chi ha applicato cosa, e perché. Lo stesso vale per la rimozione di una sanzione e per gli override di punteggio (vedi [Interventi durante il round](#4-interventi-durante-il-round)).

### Rimuovere una sanzione

Se hai applicato una sanzione per errore o se la situazione si è poi chiarita, puoi rimuoverla cliccando il <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> cestino accanto alla sanzione nella scheda del giocatore. Coordinati con il Principe: in genere è bene farlo prima della chiusura del torneo, così la versione "pulita" finisce nel report finale.

> [!IMPORTANT]
> **`DISQUALIFICATION` ≠ Drop.** Per espellere un giocatore dal torneo per motivi disciplinari **usa la sanzione `DISQUALIFICATION`**, non il pulsante <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop**. Il drop è un'azione neutra del giocatore (rinuncia volontaria, motivi logistici); la squalifica resta nello storico VEKN e ha peso nei tornei futuri. Confondere le due cose svaluta sia il drop che la squalifica.

> [!TIP]
> `CAUTION` è il richiamo più leggero e **non lascia traccia sul profilo VEKN**: usala come richiamo verbale per primi avvisi che non vuoi formalizzare. `WARNING` invece **viene registrato**: applicalo se il comportamento era già stato segnalato verbalmente o se ritieni serva una nota disciplinare permanente. Pesa bene la motivazione che scrivi nel `WARNING`: la leggerà chiunque consulti il profilo del giocatore in futuro.

> [!TIP]
> Nei **tornei online**, in assenza di clock fisico, `SLOW_PLAY` è la sanzione più ricorrente; `UNSPORTSMANLIKE_CONDUCT` copre disconnect intenzionali e abbandono del canale vocale.

## 4. Interventi durante il round

Dal **tab Round** del Tournament Manager vedi l'elenco completo dei tavoli. Per ogni giocatore al tavolo:

- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: rapida verifica della decklist e dello storico sanzioni di quel giocatore, utile quando arrivi al tavolo per una chiamata.
- <span class="archon-btn archon-btn--pencil archon-btn--purple" aria-hidden="true"></span> **matita** (inserimento risultati): nei tornei medi/grandi è il Principe a inserire i VP; nei tornei piccoli o quando ti viene chiesto, lo fai tu. I risultati che imposti come giudice **fanno fede**: i giocatori non possono sovrascriverli dalla loro vista.

> [!TIP]
> Per le chiamate a tavolo, leggi la regola dal regolamento ufficiale prima di rispondere, anche se la sai a memoria: i giocatori si fidano di più di una risposta dove ti vedono consultare la fonte. Il [VEKN Rulebook](https://www.vekn.net/rulebook) è consultabile online dal cellulare.

### Override su punteggio irregolare

A volte un tavolo chiude con un punteggio "non standard" che il sistema non accetterebbe nel flusso normale: tipicamente una squalifica a metà round, oppure VP che non sommano a 5 per regolamento. In quei casi usa il pulsante <span class="archon-pill archon-pill--yellow">Override</span> (solo giudici).

L'override si applica al singolo tavolo e ti chiede tre cose:

- **Round** — numero del round.
- **Tavolo** — numero del tavolo.
- **Motivazione** — obbligatoria, in chiaro (es. "DQ giocatore P3 al round 2 per `CHEATING`, VP redistribuiti come da regolamento").

L'azione resta tracciata sul tuo nome. Per annullare un override, rimuovilo dalla riga con il <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> cestino.

### CheckOut (assenza temporanea)

Distinta dal Drop, l'azione <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **Check out** marca un giocatore come **temporaneamente assente** per uno o più round (es. si è allontanato per un round senza ritirarsi). Permette ri-check-in al round successivo, mentre il Drop è permanente. Usala quando il Principe ti chiede di "saltare" un giocatore senza dropparlo definitivamente.

## 5. Cosa puoi fare come Giudice (e cosa no)

Sul _Tournament Manager_ il Giudice ha accesso a tutto ciò che riguarda **giocatori, sanzioni e correzioni a tavolo**. Il Principe organizzatore mantiene il controllo del **ciclo del torneo** (avvio/chiusura round, chiusura evento, dati dell'evento).

Come **Giudice**, dai tab _Registration_, _Round_ e dalle schede giocatore puoi:

- **Registrare giocatori**: aprire/chiudere la registrazione, iscrivere un giocatore esistente o crearne uno nuovo (con generazione VEKN ID al volo).
- **Gestire il check-in**: aprire/annullare il check-in, fare check-in di un singolo giocatore o di tutti in blocco, fare check-out (assenza temporanea) o drop (uscita dal torneo).
- **Modificare lo seating pre-round** con `Alter Seating` quando il Principe ti chiede di correggere un accoppiamento prima dell'avvio.
- **Applicare e rimuovere sanzioni** dalla scheda <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** del giocatore (vedi [Sanzioni](#3-sanzioni)).
- **Correggere punteggi anomali** con `Override` / `Unoverride` su un singolo tavolo (vedi [Override su punteggio irregolare](#override-su-punteggio-irregolare)).
- **Gestire la finale**: calcolare il seeding (`SeedFinals`) e assegnare i posti (`SeatFinals`). Sono azioni **esclusive del giudice**: se il Principe non è anche giudice, serve un giudice presente per la finale.

Restano **solo del Principe** (se ti servono, chiediglielo):

- avviare, chiudere o annullare un round (`RoundStart` / `RoundFinish` / `RoundCancel`);
- chiudere il torneo e inviare i risultati a `vekn.net` (`Finish`);
- modificare i dati dell'evento (sede, descrizione, orari) dal tab _Info_.

Per la lista esaustiva delle action (utile in caso di dubbi o per filtrare i log), vedi il [README di Archon](https://github.com/vtes-biased/archon).

> [!IMPORTANT]
> **Ruolo misto nei tornei piccoli.** Quando il Principe è anche unico giudice (caso tipico nei tornei locali), la distinzione sopra cade: la stessa persona ha entrambi i set di poteri. In pratica puoi fare più cose, ma **non hai meno responsabilità**: anche se fai tutto da solo, applica le buone prassi di entrambi i ruoli — tracciabilità delle sanzioni, motivazione esplicita negli override, separazione netta fra Drop e squalifica.

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
