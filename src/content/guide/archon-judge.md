---
title: 'Archon Online per Giudici'
description: 'Sanzioni, sovrascritture, chiamate a tavolo e verifica delle decklist sulla piattaforma ufficiale VEKN.'
categoria: organizzare
audience: [judge]
ordine: 20
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-giocatori, archon-principi, archon-leghe]
locale: it
---

Questa guida è dedicata a chi fa il **giudice** su [Archon Online](https://archon.vekn.net): cosa puoi fare dal portale durante un torneo, come si emettono le sanzioni nel nuovo modello e come ci si coordina con l'organizzatore. Per il ciclo completo dell'evento vedi [Archon Online per Principi](/guide/archon-principi/).

> [!IMPORTANT]
> **Il modello delle sanzioni è cambiato.** Il vecchio impianto `CAUTION` / `WARNING` / `GAME_LOSS` / `DISQUALIFICATION` con categorie generiche non esiste più. Adesso Archon implementa la tabella delle penalità della **Guida del Giudice VEKN**: quattro livelli — di cui uno nuovo, l'**Aggiustamento di Classifica** — tre categorie di infrazione con sottocategorie precise, penalità base per sottocategoria e suggerimenti di escalation. Il **game loss non esiste più**.

## 1. Come si diventa giudice di un torneo

Su Archon **non esiste un ruolo "giudice del torneo" separato**: i giudici sono **co-organizzatori** dell'evento. L'organizzatore ti aggiunge da **Strumenti → Organizzatori** (o dalla scheda **Preparazione** prima dell'evento) e da quel momento hai i suoi stessi poteri sulla console — accesso paritario, nessuna gerarchia. I membri **IC** hanno accesso da organizzatore su tutti i tornei.

Verifica **prima** dell'inizio:

- di essere loggato con l'account giusto (passkey, Discord o email — puoi averli tutti collegati allo stesso profilo);
- che il tuo VEKN ID sia collegato al profilo;
- di essere stato aggiunto come organizzatore: apri il torneo e controlla che compaia la console (barra delle azioni + schede), non solo la vista giocatore.

### Gradi VEKN e cosa cambiano

Archon espone i gradi come badge: **Judge**, **Judgekin** (mostrato come **Sheriff**), **Rulemonger** per la parte giudiziaria; **Prince**, **NC**, **IC** per la governance; **Ethics** per il Comitato Etico. Ai fini di quello che puoi cliccare sull'evento, **il grado non conta**: conta essere fra gli organizzatori del torneo. Il grado pesa sulle responsabilità formali (il Rulemonger, per esempio, è nominato dal Rules Director) e su alcune azioni fuori dal torneo — creare eventi, andare offline, revocare sanzioni altrui.

> [!NOTE]
> **Archon non distingue il capo giudice.** Non c'è un flag che separi il head judge dagli altri giudici: è una cosa che vi accordate fra co-organizzatori prima dell'evento. Nei tornei piccoli è normale che Principe e giudice siano la stessa persona.

## 2. Sanzioni

Dalla scheda **Giocatori**, l'icona del martello accanto a un giocatore apre **Emetti Sanzione di Torneo**. Scegli **livello**, **categoria** e **sottocategoria**. Dopo l'emissione compare un punto colorato accanto al giocatore: premilo per rivedere o annullare le sue sanzioni per questo evento.

### I quattro livelli di torneo

| Livello                              | Effetto                                                                |
| ------------------------------------ | ---------------------------------------------------------------------- |
| **Avvertimento** (_Caution_)         | Richiamo verbale, non tracciato formalmente                            |
| **Richiamo** (_Warning_)             | Registrato, visibile per 18 mesi                                       |
| **Aggiustamento di Classifica** (SA) | Penalità di **−1 VP** applicata a un round specifico                   |
| **Squalifica** (DQ)                  | Fuori dall'evento; blocca il check-in futuro finché non viene revocata |

**Sospensione**, **probation** e **ban** sono di livello _membership_: li emette il **Comitato Etico** dalla pagina del profilo, non tu dal torneo. Sono sempre visibili e bloccano il check-in ovunque.

### Categorie e sottocategorie

| Categoria                 | Sottocategorie                                                                                                                                                                                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Errore Procedurale**    | Violazione delle Regole di Gioco · Mancato Mantenimento dello Stato di Gioco · Effetto Obbligatorio Mancato · Errore di Accesso alle Carte                                                                                                                                                                  |
| **Errore di Torneo**      | Decklist Illegale · Deck Principale Illegale (Decklist Legale) · Deck Principale Illegale (Nessuna Decklist) · Assistenza Esterna · Gioco Lento · Violazione di Procedura Limited · Errore di Comunicazione Info Pubbliche · Occultamento dello Stato di Gioco · Carte Segnate · Mescolamento Insufficiente |
| **Condotta Antisportiva** | Minore · Maggiore · Comportamento Aggressivo · Temporeggiamento · Corruzione e Scommesse · Collusione · Cheating · Frode · Furto di Materiale di Torneo · Violazione di Salute e Sicurezza · Abbandono per Rabbia · Mancata Volontà di Vincere                                                              |

Ogni sottocategoria ha una **penalità base** che Archon ti mostra quando la selezioni: è il punto di partenza secondo la Guida del Giudice, non un'imposizione.

### Escalation

Se il giocatore ha già preso sanzioni della stessa sottocategoria, Archon mostra un **suggerimento di escalation** («N infrazioni precedenti di questo tipo — livello suggerito: …»), calcolato risalendo la scala a partire dalla penalità base. Se scegli un livello **inferiore** al suggerito compare un **avviso di declassamento**: puoi comunque procedere.

> [!IMPORTANT]
> **Compila sempre la sottocategoria.** Una sanzione con la sottocategoria vuota è invisibile al tracciamento dell'escalation: il prossimo giudice che incontra lo stesso giocatore non vedrà il precedente. Archon te lo segnala esplicitamente quando ci sono sanzioni pregresse nella categoria.

L'app **non applica le linee guida per forza**: la decisione è del capo giudice. Detto questo, i giudici non dovrebbero discostarsene senza il suo avallo, e il capo giudice dovrebbe essere prudente nelle deviazioni. Il riferimento normativo completo è la [Guida del Giudice](https://archon.vekn.net/help/judges-guide) dentro Archon (in inglese e spagnolo).

### Chi vede cosa

- **Avvertimento** — privato a questo torneo. Non compare sul profilo del giocatore né in altri eventi (fatta salva la visibilità di IC ed Etica).
- **Richiamo, SA, Squalifica** — visibili sul profilo del giocatore e agli organizzatori dei suoi altri tornei per **18 mesi**: è così che le infrazioni ripetute emergono fra un evento e l'altro.
- **Sospensioni e ban** — sempre visibili.

Le regole qui sopra sono un **filtro di visualizzazione**: i record si sincronizzano sul dispositivo di ogni membro, e IC ed Etica vedono ogni livello ovunque. Scrivi le motivazioni pensando che le rileggerà qualcun altro fra sei mesi.

### Aggiustamento di Classifica: come funziona davvero

Emettendo un SA selezioni **il round** a cui si applica (di default la partita corrente o più recente del giocatore, finale inclusa). Il −1 VP viene sottratto dai VP rettificati di quel round.

- Se i VP grezzi del giocatore in quel round sono **inferiori a 1,0**, la differenza (1,0 − VP grezzi) si riversa come deduzione dal totale VP in classifica.
- Il SA **non modifica i punteggi memorizzati**: agisce sul calcolo di GW e TP. Un giocatore che avrebbe preso un GW può perderlo dopo l'aggiustamento.
- Se il giocatore non ha ancora disputato alcun round, il SA non è applicabile.

### Revocare ed eliminare

- **Revoca** — toglie effetto a una squalifica, così il giocatore può tornare a fare check-in. Il record resta.
- **Elimina** — rimuove del tutto la sanzione. Come organizzatore puoi eliminare solo le sanzioni emesse **nel tuo evento**, e solo finché il torneo non è **Terminato**. Serve a correggere un errore: si elimina e si riemette, non si modifica sul posto. IC ed Etica possono eliminare qualsiasi sanzione.

> [!IMPORTANT]
> **Squalifica ≠ Abbandono.** Per espellere qualcuno per motivi disciplinari usa la **Squalifica**, non il pulsante _Abbandona_. L'abbandono è un'azione neutra (il giocatore se ne va, motivi logistici); la squalifica resta nello storico VEKN, blocca il check-in e — nei [campionati](/guide/archon-leghe/) — si estende a **tutti gli altri tornei della stessa serie**. Confonderle svaluta entrambe.

Se squalifichi un giocatore attualmente seduto: **rimuovilo prima dal tavolo**, poi chiudi il tavolo con una **Sovrascrittura**. I punteggi già registrati restano. Se era nel top 5, subentra il sesto in classifica.

## 3. Interventi durante il round

Dalla scheda **Round** vedi tutti i tavoli e il loro stato.

**Sovrascrivi** è lo strumento per chiudere d'autorità un tavolo con una decisione del giudice: un giocatore che se ne va a metà partita senza VP assegnati, il tempo che scade su una situazione irrisolta, una squalifica a metà round. Richiede un **commento obbligatorio** che spiega la decisione e **blocca l'inserimento dei punteggi da parte dei giocatori** — da quel momento solo gli organizzatori possono toccare quel tavolo. **Rimuovi sovrascrittura** lo annulla se la situazione cambia.

Sui punteggi vale la pena ricordare che:

- i VP dei giocatori sono validati simulando l'**ordine degli oust**: le distribuzioni impossibili vengono rifiutate. Un punteggio _valido ma sbagliato_ passa: quello lo correggi tu;
- come organizzatore puoi **forzare qualsiasi valore**; se i conti non tornano il tavolo passa in stato **Non valido**;
- la classifica si ricalcola solo al **Termina Round**.

**Chiamate al giudice**: il pulsante **Chiama il giudice** sul dispositivo del giocatore (o `/judge` sul bot Discord) fa comparire un banner ambra in cima alla tua schermata con segnale acustico, numero del tavolo e nome del giocatore. Il banner resta 2 minuti o finché non lo chiudi; le chiamate multiple si accumulano. C'è un cooldown di 30 secondi per giocatore.

> [!TIP]
> Negli eventi online la chiamata è l'unico modo che hanno per raggiungerti: entra nel canale vocale del tavolo e **fatti raccontare la situazione dal giocatore che ha chiamato**, perché non puoi vedere lo stato del tavolo.

### Ritiri e assenze

- **Abbandona** segna il giocatore come **Completato**. Lo possono attivare sia lui che tu.
- **Check out** riporta un giocatore da Registrato a Iscritto: è l'assenza temporanea, e al round successivo può rifare il check-in.
- **Rimuovi Giocatore** è per chi **non ha ancora giocato** alcun round; se ha già giocato usa **Abbandona**, che conserva i punteggi e lo esclude dalle sedute future.

## 4. Decklist

Il ciclo di visibilità è cambiato ed è importante saperlo:

- **prima dell'inizio del primo round** gli organizzatori **non vedono** il contenuto dei mazzi; i giocatori possono caricarli, modificarli ed eliminarli liberamente;
- **appena parte un round** puoi vedere e modificare tutti i mazzi, e i giocatori con mazzo singolo non possono più toccarlo (nei multideck possono caricare quello del round successivo);
- **a torneo concluso** i giocatori tornano a poter caricare e correggere — serve al vincitore per completare l'invio al TWDA.

Se l'organizzatore ha attivato **Decklist Obbligatoria**, chi non ha caricato prende un badge di avvertimento, ma **non viene bloccato al check-in**: è una segnalazione, non un cancello. Dalla scheda **Giocatori** il filtro dei mazzi ti mostra chi ha la lista mancante o problematica; da lì decidi se emettere un **Errore di Torneo** e a che livello.

> [!NOTE]
> **Il controllo di legalità è automatico.** Archon valida il mazzo al caricamento e segnala errori (mazzo illegale) e avvertimenti (per esempio carte non-V5 in un evento V5). Il tuo lavoro non è ricontare le carte: è decidere cosa fare quando la segnalazione compare.

## 5. Modalità offline

Se l'organizzatore ha messo il torneo in **modalità offline**, l'evento è **bloccato sul suo dispositivo**: nessun altro può modificarlo, e i giocatori vedono dati fermi. Se devi intervenire, o lavori sul suo dispositivo, o si torna online.

**Prendi controllo** trasferisce il blocco a un altro organizzatore che sia ufficiale VEKN (Prince, NC, IC) quando il dispositivo originale non è disponibile — batteria scarica, telefono dimenticato. Attenzione: le modifiche non ancora sincronizzate su quel dispositivo possono andare perse. Usalo come ultima risorsa, non come scorciatoia.

## 6. Coordinamento con l'organizzatore

- **Briefing prima del check-in**: formato, proxy ammessi o no, decklist obbligatoria, chi fa il capo giudice, chi inserisce i punteggi.
- **Concordate chi sovrascrive**: la sovrascrittura resta tracciata con il commento di chi l'ha emessa; meglio che sia una persona sola a farlo, per coerenza.
- **Annunci**: se l'evento ne ha bisogno (chiamate a tavolo, tempi), usateli — compaiono sulla pagina di tutti e negli eventi online sono l'unico canale certo.
- **Fine torneo**: passa all'organizzatore l'elenco delle sanzioni con il contesto, così può informarne il National Coordinator se rilevante.

> [!TIP]
> Per le chiamate a tavolo, apri la regola sul telefono anche se la sai a memoria: [Regole complete di VTES](https://archon.vekn.net/help/rules) e [Regole dei tornei](https://archon.vekn.net/help/tournament-rules) sono dentro Archon, offline incluso. I giocatori accettano molto meglio una risposta in cui ti vedono consultare la fonte.

## 7. Segnalare problemi

Per bug e proposte sull'app usa **Invia feedback** dalla pagina **Guida** di Archon, sezione Feedback: apre una issue su GitHub. Per dubbi di regolamento, il canale giusto resta il gruppo giudici della comunità o il tuo National Coordinator.

## Riferimenti

- [Guida del Giudice](https://archon.vekn.net/help/judges-guide) — tabella delle penalità e procedure ufficiali, dentro Archon.
- [Codice etico](https://archon.vekn.net/help/code-of-ethics) — competenza del Comitato Etico.
- [Regole dei tornei](https://archon.vekn.net/help/tournament-rules) e [VEKN Tournament Rules](https://www.vekn.net/tournament-rules).
- [Archon Online per Principi](/guide/archon-principi/) — console, round, finale, chiusura.
