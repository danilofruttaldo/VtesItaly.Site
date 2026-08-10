---
title: 'Archon Online per giocatori'
description: "Creare l'account, iscriversi a un torneo, caricare la decklist, fare check-in e leggere la classifica."
categoria: piattaforme
audience: [giocatore]
ordine: 10
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-principi, archon-judge, archon-leghe]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma web ufficiale VEKN per i tornei di **Vampire: The Eternal Struggle**: iscrizioni, decklist, check-in, punteggi, classifiche e rating. Questa guida copre la parte _giocatore_. Per l'organizzazione vedi [Archon Online per Principi](/guide/archon-principi/).

> [!IMPORTANT]
> **Archon è stato riscritto da zero.** L'interfaccia è nuova, è **tradotta in italiano** ed è installabile come app sul telefono. Se avevi già un account, funziona ancora: cambia dove si trovano le cose. Le vecchie URL `.../tournament/<uid>/display.html` non esistono più — adesso è `archon.vekn.net/tournaments/<uid>`.

## 1. Creare l'account

Vai su [archon.vekn.net](https://archon.vekn.net) → **Login**. In cima ci sono due schede: **Login** e **Registrati**.

Scegli **Registrati**, spunta la casella di consenso (finché non lo fai i pulsanti restano disattivati) e poi uno di questi metodi:

- **Passkey** — il più rapido e sicuro, consigliato. Usa impronta, volto o PIN del dispositivo. Nessuna password da ricordare.
- **Discord** — un tocco, e il bot Discord VEKN ti riconoscerà negli eventi online.
- **Email** — ricevi un magic link, lo clicchi e imposti una password.

Non devi sceglierne uno per sempre: dalla pagina **Profilo → Account collegati** puoi aggiungerne altri in qualsiasi momento. È anche il modo per **unire** due accessi separati in un unico profilo.

### Collegare il VEKN ID

Per giocare i tornei ufficiali serve un **VEKN ID** collegato all'account.

- **Ce l'hai già** → **Profilo → Reclama VEKN ID**, inserisci il numero. Così la tua storia nei tornei si riattacca al nuovo account.
- **Non l'hai mai avuto** → devi essere **sponsorizzato** da un ufficiale VEKN: il tuo National Coordinator, un Prince, o l'organizzatore al banco iscrizioni. Ti cerca nella pagina **Comunità → Membri** e preme **Sponsor**. Ti viene creato un numero nuovo.

Se hai reclamato il numero sbagliato, l'icona di scollegamento accanto al VEKN ID nel profilo lo stacca dall'account senza perdere lo storico.

## 2. Impostare l'app

Dalla pagina **Profilo**:

- **Lingua** — inglese, francese, spagnolo, portoghese e **italiano**. Cambia tutto immediatamente.
- **Tema** — Auto, Chiaro o Scuro.
- **Notifiche push** — attivale per essere avvisato dell'inizio dei round e delle chiamate al giudice anche con l'app chiusa.
- **Avatar** — foto del profilo, visibile nelle classifiche.
- **Risincronizza** — se qualcosa sembra vecchio, riscarica i tuoi dati dal server.

> [!TIP]
> **Installa l'app.** Archon è una Progressive Web App: su iPhone _Condividi → Aggiungi a schermata Home_, su Android _⋮ → Installa app_, su desktop l'icona di installazione nella barra degli indirizzi. Si apre più in fretta in sede e continua a funzionare se la connessione cade.

## 3. Trovare i tornei

La pagina **Tornei** ha due viste: **La tua agenda** (i tornei a cui sei iscritto o che organizzi) e **Tutti i tornei**. Puoi cercare per nome e filtrare per nazione, formato, se l'evento è prossimo o già terminato, e con **Includi online** decidere se vedere anche gli eventi online.

Sotto i filtri c'è il **feed calendario**: da **La tua agenda** premi **Genera link** una volta sola, poi **Apri nell'app del calendario** oppure **Copia link** — le date dei tornei entrano nel calendario del telefono e si aggiornano da sole.

## 4. Iscriversi

Quando l'organizzatore apre le iscrizioni, sulla pagina del torneo compare **Registrati**. Premilo: il tuo stato diventa **Iscritto**.

- Per ritirarti prima dell'apertura del check-in: **Annulla Registrazione**. Dopo, solo l'organizzatore può rimuoverti.
- Se l'evento ha un **tetto iscrizioni** già raggiunto puoi iscriverti comunque: vedrai solo un avviso che la sede potrebbe essere piena. Chiedi conferma all'organizzatore prima di metterti in viaggio.

> [!WARNING]
> **Iscriversi non è fare check-in.** Sono due passaggi distinti. Prima del primo round l'organizzatore apre una fase di check-in: se non lo fai, per quel round risulti ritirato. Vedi [Fare check-in](#6-fare-check-in).

## 5. Caricare la decklist

Sulla pagina del torneo, scorri fino alla sezione **Il Tuo Deck**. Tre modi:

- **Da URL** — incolla un link da [VDB](https://vdb.im), [VTESDecks](https://vtesdecks.com) o [Amaranth](https://amaranth.vtes.co.nz).
- **Incolla Deck** — incolla direttamente il testo della lista.
- **Scansiona QR** — inquadra con la fotocamera il QR di un mazzo VDB.

Il nome del mazzo è facoltativo. L'**attribuzione** si sceglie fra **Il tuo deck**, **Anonimo** e **Altro**: decide come verrà pubblicata la lista negli archivi.

Il mazzo viene **validato subito**: vedi immediatamente gli errori (mazzo illegale) e gli avvertimenti (per esempio carte non-V5 in un evento V5).

**Quando puoi cambiarlo:**

| Momento                           | Cosa puoi fare                                                          |
| --------------------------------- | ----------------------------------------------------------------------- |
| Prima dell'inizio del torneo      | Sostituire o eliminare liberamente                                      |
| Durante il torneo (mazzo singolo) | Bloccato: il mazzo si chiude quando parte un round                      |
| Durante il torneo (**multideck**) | Ogni round ha il suo slot; puoi caricare il mazzo del round successivo  |
| Dopo il torneo                    | Se non ne avevi mai caricato uno, puoi ancora farlo (utile per il TWDA) |

> [!TIP]
> Se l'organizzatore ha attivato **Decklist Obbligatoria**, finché non carichi il mazzo vedi un badge di avvertimento. Caricala **prima del check-in**: eviti un potenziale richiamo dal giudice.

## 6. Fare check-in

Prima di ogni round l'organizzatore apre il **check-in**: serve a stabilire chi c'è davvero.

- **In presenza**: inquadra il **codice QR** dell'organizzatore e sei registrato all'istante. In alternativa ti registra lui dalla sua lista.
- **Online**: **non c'è nessun QR**. Usa il pulsante **Accedi** sulla pagina del torneo per entrare nel server (di solito Discord). Se l'evento usa il bot Discord fai check-in da lì con `/checkin`, altrimenti ti registra l'organizzatore.

**Come capire se devi agire**: guarda il tuo stato sulla pagina del torneo.

- Vedi **Scansiona QR per il check-in** (o **Registrati e fai check-in**, che fa entrambe le cose) → devi fare qualcosa.
- Il tuo stato dice **Registrato** → sei a posto.
- Il tuo stato dice **Completato** o **Abbandonato** e il round nuovo non è ancora partito → cerca il pulsante di check-in: l'organizzatore potrebbe averlo riaperto.

Alcuni organizzatori fanno **un check-in solo** all'inizio e mantengono tutti registrati fra i round; altri **riaprono il check-in a ogni round**. In caso di dubbio: se c'è un pulsante, premilo; se non c'è, sei già dentro.

> [!IMPORTANT]
> **Se non fai il check-in prima dell'inizio del round, non giochi**: vieni segnato come ritirato. Non è definitivo — se arrivi in ritardo l'organizzatore può registrarti in qualsiasi momento, anche a round iniziato. Sederti a un tavolo o aspettare il round successivo lo decide lui: chiediglielo e non sederti finché non te lo dice.

Una **squalifica** o una **sospensione** attive bloccano il check-in, e l'organizzatore non può fare eccezioni.

## 7. Durante il round

Quando il round parte, la tua **scheda tavolo** compare vicino alla cima della pagina: numero di tavolo e tutti i seduti in ordine di seduta — il tuo predatore sopra di te, la tua preda sotto. Il tuo posto è evidenziato. Sta tutto in un solo scorrimento, non ci sono schede da cercare.

**Riportare i risultati**: a fine partita, chiunque sia seduto al tavolo può inserire i VP. Ci sono i pulsanti 0–4 sulla riga di ogni giocatore, più **+½** per il mezzo punto. Quando i punteggi tornano, il tavolo risulta concluso.

- Se l'organizzatore o il giudice ha applicato una **sovrascrittura** al tuo tavolo, l'inserimento dei giocatori è bloccato: solo lui può modificare i risultati.
- **Chiama il giudice** avvisa gli organizzatori che il tuo tavolo ha bisogno di assistenza. È una notifica in tempo reale e non interrompe la partita. Funziona quando il tuo dispositivo è online e l'evento non è in modalità offline; c'è un'attesa di 30 secondi fra una chiamata e l'altra.

### Auto-organizzare un round

Alcuni eventi casual "a round liberi" permettono ai giocatori di avviare i propri round. Se l'organizzatore lo ha abilitato, dopo l'iscrizione vedi **Auto-organizza un round**: raduna altri 3 o 4 iscritti, selezionali dall'elenco (tu sei già incluso), premi **Avvia round** e l'app assegna i posti al vostro pod di 4–5. Si gioca e si dichiarano i punteggi normalmente; il round lo chiude l'organizzatore.

## 8. Classifica, punteggi e finale

La classifica sta sotto il tuo tavolo. Quanto ne vedi dipende dall'impostazione dell'organizzatore: **Privata** (nascosta durante l'evento), **Taglio** (mostra solo il punteggio che serve per entrare nel top 5), **Top 10**, oppure **Pubblica**. A torneo finito la classifica completa è sempre visibile, e la tua riga viene evidenziata sopra la tabella.

Come si calcolano i numeri:

- **GW** (game win) — 1 se hai il VP più alto al tuo tavolo **e** almeno 2,0 VP. Se due giocatori pareggiano in testa, nessuno dei due lo prende.
- **VP** (victory point) — i tuoi punti vittoria.
- **TP** (tournament point) — dipendono dalla posizione al tavolo: 60 al primo, fino a 12 all'ultimo. I pari merito fanno la media.

**Finale**: ci si qualifica nel top 5 per GW, poi VP, poi TP; i pareggi si risolvono con un sorteggio. La seduta si stabilisce con la procedura VEKN di estrazione delle carte. In finale **non c'è la soglia dei 2,0 VP**: il GW va sempre a chi ha più VP, e a parità vince chi aveva la testa di serie migliore.

**Decklist a fine torneo**: diventano pubbliche secondo l'impostazione dell'organizzatore — solo il vincitore, i finalisti, oppure tutte. Il tuo mazzo è sempre visibile a te.

## 9. Rating e classifiche

A torneo concluso i tuoi **punti rating (RtP)** vengono calcolati e compaiono nella pagina **[Classifiche](https://archon.vekn.net/rankings)**. I rating sono separati per categoria — Constructed, Constructed Online, Limited, Limited Online — e il tuo totale si basa sui **migliori 8 tornei degli ultimi 18 mesi**.

Per torneo: 5 RtP di base, +4 per VP, +8 per GW, più un bonus finalista proporzionato alla dimensione dell'evento e al piazzamento. La **Hall of Fame** raccoglie chi ha 5 o più vittorie in torneo.

## 10. Sanzioni

Se ricevi una sanzione durante un torneo, appare come badge accanto al tuo nome. I livelli:

| Livello                         | Cosa comporta                                                          |
| ------------------------------- | ---------------------------------------------------------------------- |
| **Avvertimento** (_Caution_)    | Richiamo verbale, non tracciato formalmente                            |
| **Richiamo** (_Warning_)        | Registrato sul tuo profilo, visibile per 18 mesi                       |
| **Aggiustamento di Classifica** | Penalità di −1 VP applicata a un round specifico                       |
| **Squalifica**                  | Fuori dall'evento; blocca il check-in futuro finché non viene revocata |

**Sospensioni e ban** non li emettono gli organizzatori: sono di competenza del **Comitato Etico VEKN**. Il dettaglio delle infrazioni è nella [Guida del Giudice](https://archon.vekn.net/help/judges-guide) dentro Archon.

## 11. Campionati

Un **campionato** (in inglese _league_) raggruppa una serie di tornei in una classifica unica: un circuito regionale, una stagione, un gran premio. Li trovi nella pagina **Campionati**; aprendone uno vedi descrizione, tornei collegati e classifica combinata.

Non devi fare niente per parteciparvi: vieni conteggiato automaticamente appena giochi un torneo collegato. Il criterio con cui viene calcolata la classifica (punti rating, GW/VP/TP grezzi o punti posizione) lo sceglie l'organizzatore ed è indicato sulla pagina.

> [!NOTE]
> Una **squalifica** presa in un torneo del campionato blocca il check-in in **tutti gli altri tornei dello stesso campionato**, finché un organizzatore non la revoca.

## 12. Modalità offline

Se l'organizzatore passa il torneo in **modalità offline** (sedi senza connessione affidabile), sulla tua pagina compare un avviso: l'evento viene gestito sul suo dispositivo.

In quel periodo **quello che vedi nell'app può essere vecchio o incompleto**: tavoli, punteggi e classifica non sono aggiornati. Segui le indicazioni a voce dell'organizzatore e i fogli affissi in sala. Appena torna online tutto si sincronizza da solo.

## 13. Segnalare problemi

Per bug e proposte usa **Invia feedback** dalla pagina **Guida**, sezione Feedback: apre una issue su GitHub. Se colleghi il tuo account GitHub dal profilo puoi seguire la discussione.

## Riferimenti

- [Guida del Giocatore](https://archon.vekn.net/help/player-guide) — documentazione ufficiale in-app, in italiano, più dettagliata di questa pagina.
- [Regole complete di VTES](https://archon.vekn.net/help/rules) e [Regole dei tornei](https://archon.vekn.net/help/tournament-rules) — consultabili dal telefono, dentro Archon.
- [Archon Online per Principi](/guide/archon-principi/) — se ti capita di organizzare.
