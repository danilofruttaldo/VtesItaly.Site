---
title: 'Archon Online per Principi'
description: 'Creare un evento, gestire check-in, round, finali e report sulla piattaforma ufficiale VEKN.'
categoria: organizzare
audience: [principe]
ordine: 10
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-giocatori, archon-judge, archon-leghe]
locale: it
---

[Archon Online](https://archon.vekn.net) è la piattaforma ufficiale VEKN per la gestione dei tornei di **Vampire: The Eternal Struggle**. Questa guida copre la parte _organizzatore_: creazione dell'evento, ciclo di torneo, finale, chiusura e report. Per la parte _giocatore_ vedi [Archon Online per giocatori](/guide/archon-giocatori/); per le sanzioni e il lavoro a tavolo vedi [Archon Online per Giudici](/guide/archon-judge/); per le serie di tornei vedi [Archon Online: Campionati](/guide/archon-leghe/).

> [!IMPORTANT]
> **Archon è stato riscritto da zero.** Se hai usato la versione precedente, quasi tutto quello che sapevi sulla UI è cambiato: non c'è più il _Tournament Manager_ come pagina separata, l'interfaccia è **tradotta in italiano**, e — soprattutto — **gli eventi ora si creano su Archon**, non più su `vekn.net`. Vedi [Cosa è cambiato](#cosa-è-cambiato).

## Cosa è cambiato

| Prima                                                             | Adesso                                                                                               |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Evento creato su `vekn.net`, poi gestito da Archon                | Evento creato **su Archon**, pubblicato in automatico sul calendario VEKN                            |
| URL `/tournament/<uid>/display.html`                              | URL `/tournaments/<uid>` (i vecchi uid dei tornei importati sono stati rigenerati)                   |
| Pulsante _Tournament Manager_ su una pagina a parte               | **Console** sulla stessa pagina del torneo, visibile solo se sei organizzatore                       |
| Tab _Info / Registration / Round_                                 | **Barra delle azioni** + schede _Preparazione / Giocatori / Round / Finali_ + cassetto **Strumenti** |
| Interfaccia solo in inglese                                       | Interfaccia in **italiano** (e EN/FR/ES/PT), impostabile dal profilo                                 |
| Sanzioni `CAUTION` / `WARNING` / `GAME_LOSS` / `DISQUALIFICATION` | Avvertimento / Richiamo / **Aggiustamento di Classifica** / Squalifica (il game loss non esiste più) |
| Risultati inviati a mano a VEKN                                   | Invio automatico alla chiusura, con ritentativi in background                                        |

Archon include anche una **documentazione ufficiale in italiano** dentro l'app, alla voce **Guida** del menu: [Guida dell'Organizzatore](https://archon.vekn.net/help/organizer-guide), [Guida del Giocatore](https://archon.vekn.net/help/player-guide), [Regole dei tornei](https://archon.vekn.net/help/tournament-rules) e [Codice etico](https://archon.vekn.net/help/code-of-ethics). Questa guida non la sostituisce: la riassume e ci aggiunge la parte di prassi italiana.

## 1. Prima di iniziare

- **Chi può creare tornei**: solo **Prince**, **National Coordinator (NC)** e **Inner Circle (IC)**. Se non sei ancora Prince, contatta il tuo NC. Riferimento: [How to run a V:TES tournament](https://www.vekn.net/how-to-run-a-v-tes-tournament).
- **Account**: passkey, Discord o email/password — tutti equivalenti. Puoi collegarne più di uno allo stesso profilo dalla pagina **Profilo → Account collegati**.
- **Lingua**: **Profilo → Impostazioni → Lingua → IT**. Le etichette usate in questa guida sono quelle italiane.
- **Installa l'app**: Archon è una PWA. Installala sul telefono (iOS: _Condividi → Aggiungi a schermata Home_; Android: _⋮ → Installa app_) — serve per la [modalità offline](#10-modalità-offline).

> [!NOTE]
> **Attenzione ai due termini.** Nell'interfaccia italiana **Iscritto** significa "iscritto al torneo" e **Registrato** significa "ha fatto check-in". Sono lo stesso `Registered` / `Checked in` dell'inglese, ma è facile confondersi quando li leggi ad alta voce al banco iscrizioni.

## 2. Creare l'evento

Vai su **Tornei** e premi **+ Nuovo Torneo**. Il modulo è diviso nelle stesse sezioni che ritroverai poi in **Strumenti → Impostazioni**:

- **Generale** — Nome, **Formato** (Standard, V5, Limited), **Rank** (Base, Campionato Nazionale, Campionato Continentale), **Campionato** opzionale, data/ora e fuso orario.
- **Sede** — nazione, nome e link della sede, indirizzo, link mappa; oppure spunta **Torneo Online**. In fondo si impostano le **Sale Tavoli** per le sedi con più stanze.
- **Round e timer** — **Numero di round** (2, 3 o 4 per gli eventi che vanno sul calendario VEKN), **Tetto iscrizioni** opzionale, timer di round e finale (solo online).
- **Visibilità** — **Visibilità Classifiche** (Privata / Taglio Top 5 / Top 10 / Pubblica) e **Visibilità Decklist** (Solo il vincitore / Finalisti / Tutti).
- **Descrizione** — facoltativa, in Markdown.

> [!WARNING]
> **Alcuni campi si bloccano subito.** La voce sul calendario VEKN viene scritta una sola volta e da lì non è più correggibile: **formato**, **rank**, **orario di inizio**, **proxy**, **numero di round** e **round aperti** si bloccano nel momento in cui l'evento arriva sul calendario — cioè, in pratica, appena lo crei. Impostali bene **nel modulo di creazione**.

Vincoli utili da sapere: i **Campionati Nazionali e Continentali** non ammettono né multideck né proxy, e gli eventi **V5 non possono essere campionati** (il calendario VEKN non ha quel tipo).

### Calendario VEKN

L'evento viene pubblicato **automaticamente** sul calendario VEKN alla creazione: non devi fare nulla. Se per qualche motivo non compare, **Strumenti → Preparazione → Aggiungi al calendario VEKN** lo pubblica su richiesta (la riga appare solo se manca).

> [!IMPORTANT]
> **Non creare l'evento in due posti.** Se lo crei prima su `vekn.net` si sincronizzerà su Archon da solo; se lo crei su Archon finisce sul calendario da solo. Farli entrambi produce duplicati difficili da risolvere. Scegli un percorso — per gli eventi italiani il consiglio è **crearlo su Archon** — e avvisa il tuo NC se ti accorgi di un doppione.

Restano validi i vincoli del [regolamento VEKN](https://www.vekn.net/tournament-rules): richiedere la sanzione e annunciare l'evento almeno **28 giorni prima**, indicando data, ora e luogo; conservare copia del report per almeno **1 anno**.

### Banner

**Strumenti → Preparazione → Aggiungi banner** carica l'immagine di copertina (consigliata **1200 × 630**). Il banner compare in cima alla pagina del torneo ed è l'anteprima ogni volta che il link viene condiviso su WhatsApp, Discord o sui social. Tieni gli elementi importanti dentro l'area sicura mostrata nel ritaglio: le anteprime mobile tagliano in quadrato.

## 3. Orientarsi nella console

Aprendo un tuo torneo da organizzatore, la pagina diventa una **console**. Non c'è più una schermata separata: è la stessa URL che vedono i giocatori, con i comandi in più.

- Sotto il titolo, una riga di pulsanti: **Condividi**, **Vai offline**, **Strumenti**.
- La **barra delle azioni** dice a che punto è l'evento e propone **l'unica azione del momento**: _Apri Registrazione_, _Inizia Check-in_, _Inizia Round 2_, _Termina Round_, _Inizia Finali_, _Concludi Finali_. Le azioni più rare dello stesso momento stanno accanto o dentro **Altro**. Scorrendo verso i tavoli, l'azione ti segue in una fascia ancorata in basso.
- Le **schede** sono lo spazio di lavoro: **Giocatori** sempre, **Preparazione** prima dell'evento, **Round** appena esiste un round, **Finali** quando la finale è a portata.
- **Strumenti** è il cassetto di tutto il resto, raggruppato in **Preparazione**, **All'ingresso**, **Chiusura** — nell'ordine in cui si svolge un evento. Il gruppo giusto è già aperto quando apri il foglio.

Gli stati del torneo, mostrati dal badge accanto al titolo, sono: **Pianificato** → **Iscrizione** → **Registrazione** (check-in) → **In gioco** → **Terminato**. Fra un round e l'altro il torneo torna in **Registrazione**.

## 4. Iscrizioni

Premi **Apri Registrazione**: da quel momento i giocatori possono iscriversi da soli dalla pagina del torneo.

- **Iscrizioni raccolte altrove** — **Strumenti → Preparazione → Importa iscrizioni (CSV)** carica un elenco intero in un colpo solo.
- **Tetto iscrizioni** — è un limite _indicativo_: superato il tetto le iscrizioni non vengono bloccate, compare solo un avviso. Serve a te per dimensionare la sede.
- **Eventi walk-in** — puoi saltare del tutto le iscrizioni anticipate: fare il check-in di un giocatore non iscritto lo iscrive e lo registra in un solo passaggio.
- **Pagamenti** — dalla scheda **Giocatori** ogni giocatore mostra **In attesa** o **Pagato**; toccare il badge lo alterna. **Segna tutti pagati** è in **Altro**. È solo informativo: non blocca niente.

> [!TIP]
> Tutti i giocatori dovrebbero avere il **VEKN ID collegato** prima della chiusura del torneo, altrimenti i risultati non possono essere inviati a VEKN. Chi non ce l'ha lo può reclamare dal proprio profilo; chi non l'ha mai avuto va **sponsorizzato** da un ufficiale (tu, se sei Prince) dalla pagina **Comunità → Membri**.

## 5. Check-in

**Inizia Check-in** apre la fase che stabilisce chi è davvero presente. È il passaggio che evita il problema più comune: iniziare un round con qualcuno che non c'è.

Metodi disponibili:

- **Codice QR** (solo eventi in presenza) — prima del primo round la barra delle azioni offre **Mostra codice QR per il check-in**; in qualsiasi altro momento è in **Strumenti → All'ingresso**. I giocatori lo inquadrano e si registrano da soli.
- **Manuale** — dalla scheda **Giocatori**. Finché il primo round non parte, le schede giocatore sono già aperte con check-in, pagamento e mazzo a portata di dito: è la _modalità ingresso_.
- **Check In Tutti** — registra in blocco tutti gli Iscritti rimasti.
- **Check out** — riporta un singolo giocatore da Registrato a Iscritto.
- **Resetta Check-In** — riporta _tutti_ a Iscritto fra un round e l'altro. Sugli eventi online è un pulsante a sé (le disconnessioni silenziose sono frequenti), in presenza sta in **Altro**.
- **Riapri Registrazione** — se hai aperto il check-in troppo presto, torna alle iscrizioni.

Cose che vale la pena sapere:

- **Il check-in non chiude mai.** Puoi registrare qualcuno mentre un round è già **In gioco**; registrare un giocatore mai iscritto lo iscrive sul momento.
- **Chi non fa il check-in viene droppato automaticamente** all'avvio del round (stato **Completato**). La barra delle azioni te li elenca per nome _prima_, e l'operazione è reversibile: se arriva in ritardo, rifai il check-in.
- Registrare qualcuno **non lo fa sedere**: resta _presente ma non seduto_ e la barra delle azioni te lo segnala. Puoi farlo sedere subito con **Fai sedere un giocatore** (scheda **Round**) a un tavolo con posto libero, oppure tenerlo per il round successivo — decidi tu.
- **Squalifica o sospensione attive bloccano il check-in**, anche se sei tu a farlo.
- Se **Decklist Obbligatoria** è attiva, chi non ha caricato il mazzo prende un badge di avvertimento, ma **non** viene bloccato.

**Fra i round** lo stato di check-in si mantiene. Per round consecutivi in giornata di solito si lascia tutto com'è; per pause pranzo, eventi su più giorni e tornei online conviene **Resetta Check-In** e rifare l'appello.

## 6. Round e seduta

**Inizia Round** assegna i posti con l'algoritmo di seduta VEKN, che ottimizza 9 regole (R1–R9) in ordine di priorità: R1 predatore-preda ripetuto e R2 avversario a ogni round sono vincoli rigidi, le altre riguardano equità di VP, posti e posizioni relative. Archon mostra la qualità della seduta come **Perfetto**, **OK** o **Non valido**, con il dettaglio di quali regole ha dovuto sacrificare.

Requisiti: almeno **4 giocatori registrati** e non aver esaurito il numero di round configurato.

> [!NOTE]
> **Seduta sfalsata.** Con numeri che non si dividono in tavoli da 4–5 (6, 7, 11 giocatori) Archon aggiunge round extra e fa ruotare chi salta il round, dando la precedenza a chi ha giocato meno partite. È automatico.

Dalla scheda **Round**:

- **Modifica posti** — tocca un giocatore, poi un altro posto per scambiarli o un posto vuoto per spostarlo. Il pulsante **Tavolo** aggiunge un tavolo vuoto.
- **Fai sedere un giocatore** — sotto ogni tavolo, elenca i presenti non seduti.
- **Rimuovi giocatore dal tavolo** / **Rimuovi tavolo vuoto**.
- **Stampa la disposizione** — foglio da affiggere in sala. Indispensabile oltre i 30 giocatori e in sedi senza campo.

> [!WARNING]
> Spostare un giocatore su un **tavolo diverso azzera il suo punteggio**; spostarlo di posto **sullo stesso tavolo** lo conserva. L'editor rifiuta le modifiche che ricreerebbero una coppia predatore-preda già vista (violazione R1).

### Punteggi

Il flusso normale è **l'auto-dichiarazione dei giocatori**: al termine della partita ciascuno inserisce i propri VP dai pulsanti sul proprio dispositivo, e tu controlli. Negli eventi piccoli puoi inserirli tutti tu.

- I VP si inseriscono in incrementi di 0,5 e vengono **validati simulando l'ordine degli oust**: le distribuzioni impossibili vengono rifiutate. Il totale del tavolo deve essere pari al numero di giocatori.
- Un giocatore ottiene il **Game Win** se ha **almeno 2,0 VP** ed è **strettamente il più alto** al tavolo. Un pareggio in testa non assegna GW a nessuno.
- I **Tournament Point** dipendono dalla posizione: 60/48/36/24/12 su un tavolo da 5, 60/48/24/12 su un tavolo da 4 (i 36 mancanti sono il "bye di tavolo"). I pari merito fanno la media.
- Ordine di classifica: **GW > VP > TP**.
- **Sovrascrivi** chiude d'autorità un tavolo con una decisione del giudice (abbandono a metà partita, tempo scaduto con situazione irrisolta): richiede un **commento obbligatorio** e blocca l'inserimento dei punteggi da parte dei giocatori. **Rimuovi sovrascrittura** lo annulla.

**Termina Round** diventa l'azione principale quando ogni tavolo è concluso o sovrascritto. La classifica si aggiorna **solo alla fine del round**.

**Annulla Round** invalida un round andato storto. Un round non-ultimo viene conservato ma escluso dalla classifica (badge **Annullato**) e ripristinabile con **Ripristina Round**; **l'ultimo round viene scartato definitivamente**.

## 7. Finale

Prima di poter avviare la finale devi risolvere gli eventuali **pareggi nel top 5**: i controlli del sorteggio compaiono nella scheda **Giocatori** quando un pareggio sta effettivamente bloccando la finale. Puoi usare **Toss casuale** (Archon estrae) o **Modifica sorteggio** (inserisci a mano l'esito di un tiro fisico, in linea con il "fair random method" del regolamento).

Requisiti per **Inizia Finali**: torneo nello stato **Registrazione** (cioè la fase di check-in) con il round corrente concluso, almeno **2 round preliminari** completati, almeno **5 giocatori idonei** e nessun pareggio irrisolto. I finalisti sono i primi 5 per GW > VP > TP > sorteggio; uno squalificato viene saltato e subentra il sesto.

Selezionati i finalisti, si esegue la **procedura di seduta VEKN** ([Tournament Rules 3.1.3](https://archon.vekn.net/help/tournament-rules)): a ogni finalista un cartellino, il giudice rivela tre carte a caso dalla cripta di ciascuno, e — partendo dalla **testa di serie più bassa** — ognuno a turno mette il proprio cartellino a un'estremità della fila o in uno spazio fra due già posizionati. Si legge poi **da sinistra a destra** e si inserisce l'ordine in Archon; chi gioca per primo lo determina il giudice a caso.

- **Modifica posti** nella scheda **Finali** scambia due finalisti (devono restare gli stessi 5).
- **Annulla Finali** riporta a **Registrazione** se un finalista non si presenta, così puoi rifare la selezione.
- **In finale non c'è la soglia dei 2,0 VP**: il GW va sempre a chi ha più VP, e un pareggio si risolve a favore della testa di serie migliore.

**Concludi Finali** determina il vincitore, blocca i risultati, calcola i rating, applica la visibilità delle decklist, invia il mazzo del vincitore al TWDA e manda i risultati a VEKN.

> [!NOTE]
> **Puoi anche chiudere senza finale** — tappe di campionato, o eventi finiti dopo i preliminari: **Strumenti → Chiusura → Concludi Torneo**. I giocatori prendono comunque i punti rating base; solo il bonus vincitore/secondo richiede la finale.

## 8. Chiusura, report e condivisione

- **Invio a VEKN**: automatico alla chiusura. Finché la sincronizzazione è in sospeso vedi il badge «Risultati non ancora inviati a vekn.net» — è normale, viene ritentata in background. Per forzarla: **Strumenti → Chiusura → Invia i risultati a VEKN**.
- **Risultati sbagliati?** **Strumenti → Chiusura → Riapri Torneo** riporta l'evento allo stato **Registrazione** (check-in): correggi e richiudi, i rating si ricalcolano. Le squalifiche restano.
- **Condividi** (riga sotto il titolo) passa il link al menu di condivisione del telefono, con la scheda social generata dal tuo banner.
- **Strumenti → Chiusura** aggiunge, quando la classifica esiste: **Copia i risultati** (classifica in Markdown + mazzo del vincitore, pronta da incollare su Discord) e **Scarica una copia dell'evento** (JSON completo per il tuo archivio). Nella scheda **Giocatori** c'è anche **Stampa la classifica**.
- **Carte promo** — se hai distribuito promo, registrale in **Strumenti → Chiusura → Carte promo distribuite**: tiene onesto l'inventario degli ufficiali. Non è obbligatorio per chiudere.

### Prassi italiana

Oltre a quello che fa Archon, per gli eventi italiani:

- pubblica il **report sul forum VEKN** nella sezione [Event Reports and TWD](https://www.vekn.net/forum/event-reports-and-twd), includendo il link `archon.vekn.net/tournaments/<uid>`;
- manda il link della pagina Archon al canale della comunità (Discord/WhatsApp) — la classifica pubblica è già leggibile da tutti;
- se hai applicato sanzioni rilevanti, informane il tuo **National Coordinator**.

## 9. Strumenti per gli eventi grandi

- **Co-organizzatori** — **Strumenti → Organizzatori** (o la scheda **Preparazione** prima dell'evento). Accesso paritario, nessuna gerarchia, rimovibili in qualsiasi momento; i membri IC ce l'hanno d'ufficio su tutti i tornei. È così che si danno i poteri ai **giudici**: su Archon non esiste un ruolo "giudice del torneo" separato.
- **Annunci** — dal check-in in poi, sopra la console: fino a 280 caratteri, compaiono come banner sulla pagina di tutti. «Round 2 fra 10 minuti», «pausa pranzo fino alle 14».
- **Timer** — Avvia / Pausa / Reimposta, sincronizzato in tempo reale. Archon lo presenta come strumento per gli eventi online, ma compare in ogni torneo per cui hai impostato un **Tempo del round**, con **estensioni per singolo tavolo** (+1/+2/+5/+10 minuti, fino a 30) per i tavoli fermati da una chiamata al giudice.
- **Sale Tavoli** — nomi delle sale per intervalli di tavoli: le assegnazioni compaiono accanto ai numeri di tavolo nella disposizione.
- **Estrazione** — **Strumenti → Chiusura → Estrazione**, disponibile già dal primo round. Filtra il pool (tutti, non finalisti, vincitori di partita, senza VP…), scegli quanti vincitori e se **escludere chi ha già vinto**. Le estrazioni appaiono sulla pagina di tutti.
- **Giocatori proxy** — chi occupa un posto senza essere in gara (tipicamente un ufficiale che sostituisce un assente con un mazzo casuale): attiva **Proxy** sulla sua scheda. I suoi VP contano per gli avversari, ma lui è escluso da classifica, rating e finale. È **diverso** dall'impostazione **Permetti Proxy**, che riguarda le _carte_ proxy nelle decklist.
- **Importa Excel storico** — **Strumenti → Preparazione**, per migrare i dati dai vecchi fogli Archon `.xlsx` (non è lo stesso file del JSON esportato da Archon).

## 10. Modalità offline

Pensata per le sedi senza connessione affidabile — il seminterrato del negozio, la sala senza campo.

1. Apri la pagina del torneo **mentre sei ancora online**, così tutti i dati arrivano sul dispositivo.
2. Premi **Vai offline** nella riga sotto il titolo (è lì e non in Strumenti perché la userai quando la linea sta già saltando). È riservata agli organizzatori che sono ufficiali VEKN — Prince, NC, IC — perché offline si possono creare nuovi membri sul posto.
3. Il torneo viene **bloccato sul tuo dispositivo**: solo quello può modificarlo.

Puoi prepararti da casa: carica il torneo, vai offline, chiudi l'app; in sede riapri e funziona interamente dai dati locali. Gestisci tutto normalmente; con connettività intermittente Archon salva un backup sul server ogni 30 secondi (rete di sicurezza, non sincronizzazione: gli altri vedono lo stato del backup, in sola lettura). **Torna online** riconcilia tutto — in caso di conflitto vince il server.

Se il dispositivo originale non è disponibile (batteria, dimenticato a casa), un altro organizzatore che sia ufficiale VEKN può usare **Prendi controllo** per reclamare il blocco: le modifiche non ancora sincronizzate su quel dispositivo possono andare perse.

> [!TIP]
> In modalità offline i giocatori **non vedono niente di aggiornato**: tavoli, punteggi e classifica sul loro telefono possono essere vecchi. Dillo ad alta voce a inizio evento e affiggi la disposizione stampata.

## 11. Round Aperti, round autogestiti, Discord

**Round Aperti** è un _formato casalingo_ non VEKN per eventi casual o su più settimane: ogni giocatore gioca fino a **Round max per giocatore** pescati da un pool comune, chi raggiunge il limite passa a **Completato** (ancora idoneo per la finale). La finale è opzionale.

> [!WARNING]
> Gli eventi a Round Aperti **non vengono inviati a VEKN e non contano per il ranking**. Per gli eventi sanzionati usa il formato standard.

Sopra ai Round Aperti puoi attivare i **Round autogestiti** (**Strumenti → Impostazioni → Round e timer**): i giocatori iscritti compongono da soli un pod di 4–5 e Archon assegna i posti, senza che tu sia presente. Ogni tavolo autogestito è marcato **Organizzato da …**, e resti tu a chiudere i round e a poter annullare o sovrascrivere.

Per gli **eventi online**, contrassegna il torneo come **Online** e metti il link di invito Discord come link della sede: così i giocatori raggiungono il server con un tocco. Timer, **Chiama il giudice** e annunci non dipendono da questo flag: funzionano anche in presenza. In più esiste un **bot Discord**: un organizzatore lancia `/setup <url-del-torneo>` e il bot crea la categoria con `#announcement`, `#lobby` e `#judges`, un canale vocale per ogni tavolo e l'evento a calendario sul server. I giocatori usano `/register`, `/checkin`, `/report <vp>` e `/judge`; gli organizzatori `/announce`, `/sync` e `/teardown`. App e bot sono due finestre sullo **stesso** torneo. Il bot è comunque **facoltativo**: un torneo online funziona interamente dall'app.

## 12. Segnalare problemi

Archon è in sviluppo attivo. Per bug e proposte usa **Invia feedback** dalla pagina **Guida**, sezione Feedback: apre una issue su GitHub. Collegando il tuo account GitHub dal profilo puoi seguire la discussione ed essere menzionato.

Se un comportamento ti sembra sbagliato ma non sei sicuro che sia un bug, chiedi prima sul canale della comunità italiana o al tuo National Coordinator: capita spesso che sia una funzione nuova e non un difetto.

## Riferimenti

- [Guida dell'Organizzatore](https://archon.vekn.net/help/organizer-guide) — documentazione ufficiale in-app, in italiano.
- [Regole dei tornei](https://archon.vekn.net/help/tournament-rules) e [Guida del Giudice](https://archon.vekn.net/help/judges-guide) — riferimento normativo dentro Archon.
- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules) — regolamento ufficiale.
- [Archon Online per Giudici](/guide/archon-judge/) e [Archon Online: Campionati](/guide/archon-leghe/).
