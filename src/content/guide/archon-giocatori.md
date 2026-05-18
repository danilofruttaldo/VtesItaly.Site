---
title: 'Archon Online per giocatori'
description: 'Registrarsi, iscriversi a un torneo e caricare la decklist sulla piattaforma ufficiale VEKN.'
categoria: piattaforme
audience: [giocatore]
ordine: 10
versione: '0.4'
aggiornato: 2026-05-18
correlate: [archon-principi, archon-judge]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma web ufficiale VEKN per la gestione dei tornei di **Vampire: The Eternal Struggle**. Sostituisce progressivamente il vecchio file Excel "Archon" e si sincronizza automaticamente con il calendario eventi e con il sistema di rating su vekn.net.

Questa guida copre la parte _giocatore_: registrazione, iscrizione a un torneo e caricamento della decklist. Per la parte _organizzatore_ vedi la guida [Archon Online per Principi](/guide/archon-principi/).

## 1. Registrazione sulla piattaforma

Al primo accesso su [archon.vekn.net](https://archon.vekn.net) ti viene chiesto di accedere. Due modi:

- **Login con Discord**: serve un account Discord; al primo collegamento autorizzi l'app.
- **Login con email**: inserisci l'email, lascia il campo password vuoto e clicca _Reset Password_. Arriva una mail con il link per impostare la password (controlla anche lo spam).

Se l'email è già associata a un VEKN ID, il profilo si compila in automatico: verifica i dati e conferma. Altrimenti inserisci a mano VEKN ID, nazione e città. Il collegamento a Discord è facoltativo.

> [!TIP]
> Salva la password nel browser. In ogni caso la procedura _Reset Password_ è sempre disponibile per riavviarla da zero.

## 2. Iscrizione a un torneo

Dopo il login, il tab **Tournaments** mostra l'elenco dei tornei, filtrabile per nome, nazione, anno e stato (_Upcoming_, _Ongoing_, _Finished_). Il toggle **Include Online** mostra o nasconde i tornei online.

Aprendo un evento in stato _Registration_ vedi la pagina del torneo. Clicca <span class="archon-pill archon-pill--green">Register</span>: nome e VEKN ID compaiono nell'elenco iscritti.

> [!TIP]
> I filtri sono un po' lenti. Cliccando sul menu _Country_ puoi digitare direttamente la nazione (per esempio "I-T-A" per Italy) ed evitare di scorrere tutto l'elenco.

## 3. Caricamento della decklist

Dal pulsante <span class="archon-pill archon-pill--primary">Decklist</span> si carica il mazzo in tre modi:

- **Testo**: incolla la lista in formato testuale (da VDB: _Export → Clipboard text_).
- **URL**: incolla il link da uno dei deck builder supportati.
- **Scan**: scansione tramite fotocamera del QR code generato dal deck builder.

### Tipologie di deckbuilder supportati

Archon accetta URL da tutti i principali deck builder VTES, oltre al testo libero:

- **[VDB](https://vdb.im)** — esporta `URL → Standard URL` (con QR o Deck-in-URL).
- **[Amaranth](https://amaranth.vtes.co.nz)** — incolla il link condivisibile del mazzo.
- **[VTESDecks](https://vtesdecks.com)** — incolla l'URL pubblico del mazzo.
- **Plain text** — formato testuale standard (`<count>x <card name>`, una per riga).

La spunta **Allow attribution** (di default disattivata) autorizza la pubblicazione del mazzo con il proprio nome negli archivi. Se non attivata, la lista resta anonima.

> [!TIP]
> Dopo il caricamento puoi rivedere la decklist appena caricata dalla tua scheda evento (funzione disponibile dalle versioni recenti di Archon). Se il deck non corrisponde, ricarica.

> [!NOTE]
> Al submit può comparire un messaggio di errore anche se la lista è stata caricata correttamente (bug noto). Se il deck risulta poi visibile nella tua scheda, è ok — non serve segnalarlo ogni volta.

### Tornei multideck

Nei tornei **multideck** puoi caricare un mazzo diverso per ogni round, e il giudice può correggere un singolo round senza toccare gli altri. È il formato standard delle league online europee.

## 4. Drop e CheckOut dal torneo

Archon distingue due tipi di assenza con eventi distinti:

- <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop** — ritiro **permanente** dal torneo. Puoi farlo tu dal pulsante _Drop from the tournament_, oppure lo applica un giudice se vede che te ne sei andato senza segnalarlo. Il tuo nome resta visibile con flag _drop_ ma non finisci più nei seating dei round successivi (a meno che l'organizzatore non ti riaggiunga a mano).
- <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **CheckOut** — assenza **temporanea**, applicata da un giudice. Caso tipico: ti allontani per un round senza ritirarti dal torneo. Nel round successivo puoi tornare e fare _check-in_ di nuovo.

> [!IMPORTANT]
> **Drop ≠ Squalifica.** Il pulsante _Drop_ è uno strumento volontario del giocatore: significa "non gioco più". La squalifica (`DISQUALIFICATION`) è invece una sanzione applicata dal giudice e resta registrata nello storico VEKN: spetta al giudice spiegarne motivo e modalità.

## 5. Risultati di tavolo e autorità del giudice

I VP del tuo tavolo a fine partita li inseriscono i giocatori stessi su Archon. In casi particolari possono essere inseriti o confermati dall'organizzatore o dal giudice.

> [!IMPORTANT]
> **I risultati confermati da un giudice fanno fede.** Una volta che un giudice ha impostato o validato il punteggio del tuo tavolo, **non puoi modificarlo dalla tua vista**. Se noti un errore segnalalo subito — a voce o nella chat dell'evento — **prima del _Finish Round_**: dopo la chiusura del round, per correggerlo serve un _Override_ del giudice.

## Riferimenti

- Segnalare bug o suggerimenti: [github.com/vtes-biased/archon/issues](https://github.com/vtes-biased/archon/issues), o dal pulsante **Report Issue** in alto a destra in ogni pagina di archon.vekn.net (serve account GitHub).
