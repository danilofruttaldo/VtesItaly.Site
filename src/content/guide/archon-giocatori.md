---
title: 'Archon Online per giocatori'
description: 'Registrarsi, iscriversi a un torneo e caricare la decklist sulla piattaforma ufficiale VEKN.'
categoria: piattaforme
audience: [giocatore]
ordine: 10
versione: '0.3'
aggiornato: 2026-05-13
correlate: [archon-principi, archon-judge]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma web ufficiale VEKN per la gestione dei tornei di **Vampire: The Eternal Struggle**. Sostituisce progressivamente il vecchio file Excel "Archon" e si sincronizza automaticamente con il calendario eventi e con il sistema di rating su vekn.net.

Questa guida copre la parte _giocatore_: registrazione, iscrizione a un torneo e caricamento della decklist. Per la parte _organizzatore_ vedi la guida [Archon Online per Principi](/guide/archon-principi/).

## 1. Registrazione sulla piattaforma

Al primo accesso ad [archon.vekn.net](https://archon.vekn.net) viene richiesto il login. Sono disponibili due modalità:

- **Login con Discord**: serve un account Discord attivo; autorizzare la app al primo collegamento.
- **Login con email**: inserire l'email (senza password) e cliccare _Reset Password_. Arriva una mail con il link per impostare la password (controllare anche la cartella spam).

Se l'email risulta già associata a un VEKN ID, i campi del profilo vengono compilati in automatico: verificare i dati e confermare. Altrimenti inserire manualmente VEKN ID, nazione e città. Il collegamento a Discord resta facoltativo.

> [!TIP]
> Salva la password nel browser. In ogni caso la procedura _Reset Password_ è sempre disponibile per riavviarla da zero.

## 2. Iscrizione a un torneo

Dopo il login, dal tab **Tournaments** si vede l'elenco dei tornei sulla piattaforma, filtrabile per nome, nazione, anno e stato (_Upcoming_, _Ongoing_, _Finished_). Il toggle **Include Online** mostra o nasconde i tornei online.

Selezionando un evento in stato _Registration_ si apre la pagina del torneo. Cliccare <span class="archon-pill archon-pill--green">Register</span>: nome e VEKN ID compaiono nell'elenco dei contenders.

> [!TIP]
> I filtri sono un po' lenti. Cliccando sul menu _Country_ puoi digitare direttamente la nazione (per esempio "I-T-A" per Italy) ed evitare di scorrere tutto l'elenco.

## 3. Caricamento della decklist

Dal pulsante <span class="archon-pill archon-pill--primary">Decklist</span> si carica il mazzo in tre modi:

- **Testo**: incolla la lista in formato testuale (da VDB: _Export → Clipboard text_).
- **URL**: incolla il link da uno dei deck builder supportati.
- **Scan**: scansione tramite fotocamera del QR code generato dal deck builder.

### Tipologie di decklist supportate

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

Nei tornei dichiarati **multideck** puoi caricare un mazzo diverso per ogni round. Il giudice può, se necessario, correggere un singolo round senza toccare gli altri. Il formato è riconosciuto dal _VEKN Online Constructed Ranking_ ed è quello standard delle league online europee.

## 4. Drop e CheckOut dal torneo

Archon distingue due tipi di assenza con eventi distinti:

- <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop** — ritiro **permanente** dal torneo. Puoi farlo tu dal pulsante _Drop from the tournament_, oppure può applicarlo un giudice se si accorge che hai abbandonato senza segnalarlo. Il nome resta visibile con flag _drop_ ma non rientri nei seating dei round successivi (a meno di ri-registrazione manuale dell'organizzatore).
- <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **CheckOut** — assenza **temporanea**, applicata da un giudice. Tipico caso: ti allontani per un round senza ritirarti dal torneo. Nel round successivo puoi ripresentarti e fare _check-in_ di nuovo.

> [!IMPORTANT]
> **Drop ≠ Squalifica.** Il pulsante _Drop_ è uno strumento volontario del giocatore: significa "non gioco più". La squalifica (`DISQUALIFICATION`) è invece una sanzione applicata dal giudice e resta registrata nello storico VEKN: spetta al giudice spiegarne motivo e modalità.

## 5. Risultati di tavolo e autorità del giudice

I VP del tuo tavolo a fine partita vengono inseriti su Archon dall'organizzatore o dal giudice (in alcuni tornei è il capo-tavolo a comunicarli; in altri li inseriscono i giocatori stessi e l'organizzatore conferma).

> [!IMPORTANT]
> **I risultati confermati da un giudice sono autoritativi.** Una volta che un giudice ha impostato/validato il punteggio del tuo tavolo, **non puoi modificarli dalla tua vista**. Se noti un errore, segnalalo subito (a voce o nella chat dell'evento) **prima del _Finish Round_**: dopo la chiusura del round, una correzione richiede un _Override_ esplicito da parte di un giudice.

## Riferimenti

- Repository ufficiale Archon Online: [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon)
- Per segnalare bug o suggerimenti sulla UI, usare il pulsante **Report Issue** in alto a destra in ogni pagina di archon.vekn.net (serve un account GitHub gratuito).
