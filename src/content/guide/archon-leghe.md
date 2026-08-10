---
title: 'Archon Online: Campionati (Leghe)'
description: 'Creare e gestire un campionato su Archon: serie di tornei, classifiche RTP/GW-VP-TP/Grand Prix, meta-campionati.'
categoria: organizzare
audience: [principe]
ordine: 30
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-principi, archon-giocatori, archon-judge]
locale: it
---

Su [Archon Online](https://archon.vekn.net) un **campionato** (in inglese _league_) è una **serie di tornei** con una classifica aggregata: un circuito regionale, una stagione, un gran premio. È lo strumento per le league online e per i cicli locali in presenza.

Questa guida copre la parte organizzatore. Per il singolo torneo vedi [Archon Online per Principi](/guide/archon-principi/); per il punto di vista del giocatore [Archon Online per giocatori](/guide/archon-giocatori/).

> [!IMPORTANT]
> **Archon è stato riscritto e la funzione è cambiata parecchio.** In italiano l'interfaccia dice **Campionati**, non "leghe". Le modalità di classifica ora sono **RTP** (predefinita), **GW/VP/TP** e **Grand Prix**, i tornei si collegano anche **dalla pagina del campionato**, e la creazione è riservata a **NC e IC**. Le vecchie URL `/league/<uid>/display.html` non esistono più: adesso è `archon.vekn.net/leagues/<uid>`.

## 1. Chi può creare un campionato

Solo i membri **NC (National Coordinator)** e **IC (Inner Circle)**. Se sei Prince e vuoi una serie di tornei, parla con il tuo NC: può creare il campionato e aggiungerti come organizzatore, oppure aprirlo ai **Prince del paese** (vedi sotto).

Gli **organizzatori del campionato** funzionano come i co-organizzatori di un torneo: accesso paritario, nessuna gerarchia, rimovibili in qualsiasi momento — ma non si può rimuovere l'ultimo.

## 2. Creare il campionato

Vai su **Campionati** e premi **+ Nuovo Campionato**:

- **Nome** — mostrato sulla pagina del campionato.
- **Tipo** — **Campionato** (aggrega tornei: il caso normale) o **Meta-Campionato** (aggrega altri campionati).
- **Modalità classifica** — RTP, GW/VP/TP o Grand Prix (vedi [Modalità di classifica](#4-modalità-di-classifica)).
- **Formato** — facoltativo. Se lo imposti, solo i tornei di quel formato possono essere collegati.
- **Nazione** — facoltativa, per i campionati regionali; c'è anche **Mondiale**.
- **Data di inizio** (obbligatoria) e **Data di fine** — lascia la fine vuota per un campionato in corso.
- **Campionato genitore** — facoltativo, per agganciarlo a un meta-campionato.
- **Aperto ai Prince del paese** — se attivo, i Prince della nazione del campionato possono collegare i propri tornei senza essere organizzatori del campionato. È l'opzione giusta per un circuito nazionale a cui partecipano molte città.
- **Descrizione** — Markdown. Usala per regolamento sintetico, calendario, criteri di scarto e premi: è il posto dove i giocatori li cercheranno.

## 3. Collegare i tornei

Due percorsi, entrambi validi:

1. **Dalla pagina del campionato** — **Aggiungi evento** elenca i tuoi tornei senza campionato che corrispondono al formato richiesto.
2. **Dal torneo** — **Strumenti → Impostazioni → Generale**, campo **Campionato**. È anche disponibile nel modulo di creazione del torneo, quindi conviene creare **prima il campionato** e poi i tornei.

Chi può collegare cosa: gli **organizzatori del campionato** sempre; i membri **IC** su qualsiasi campionato; i **NC** sui campionati del proprio paese; i **Prince del paese** solo se il campionato è marcato **Aperto ai Prince del paese**.

> [!TIP]
> Se **Aggiungi evento** dice che non ci sono eventi collegabili, il motivo è quasi sempre uno di questi: il torneo ha già un campionato, oppure il suo **formato non corrisponde** a quello del campionato, oppure non ne sei organizzatore.

## 4. Modalità di classifica

La modalità si sceglie alla creazione ed è indicata sulla pagina pubblica del campionato, così i giocatori sanno cosa stanno guardando.

| Modalità                             | Come funziona                                                                                                                                                                                                                | Cosa premia                                                                                                                |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Punti Rating (RTP)** — predefinita | Punti rating VEKN guadagnati a ogni evento, sommati su **tutti** gli eventi del campionato, **finali incluse**. A differenza del rating di profilo, il totale della stagione **non** è limitato ai migliori 8 né ai 18 mesi. | Partecipazione, vittorie e dimensione degli eventi. La scelta equilibrata.                                                 |
| **GW/VP/TP**                         | Game win, victory point e tournament point dei **soli round preliminari**, sommati. Dimensione dell'evento e finali ignorate.                                                                                                | Puramente partecipazione e gioco: ottima per promuovere i piccoli eventi locali, ma vincere la finale non dà nulla in più. |
| **Grand Prix (GP)**                  | Punti di piazzamento fissi per torneo: **Vincitore 25**, altri **finalisti 15**, poi 10, 9, 8… a scendere in classifica, fino a un minimo di 3. Finali incluse, dimensione dell'evento ignorata.                             | _Vincere_ eventi di alto profilo. Buono per un circuito di grandi tornei, debole per i piccoli.                            |

> [!NOTE]
> **RTP include le finali.** È l'errore più comune nel raccontarlo ai giocatori: la modalità che esclude le finali è **GW/VP/TP**, non RTP.

### Scarti e tie-break personalizzati

Archon mostra la classifica così com'è: non supporta gli scarti («i migliori 4 risultati su 6») né tie-break su misura. Se il tuo regolamento li prevede, calcola la classifica ufficiale a parte e pubblica **entrambe**: quella grezza di Archon, così ognuno può verificare i propri punteggi tappa per tappa, e quella con gli scarti applicati. E scrivi il criterio nella **Descrizione** fin dall'inizio.

## 5. Meta-campionati

Un **Meta-Campionato** aggrega altri campionati invece dei tornei. La gerarchia ha **massimo 2 livelli**: meta-campionato → campionati → tornei.

Serve per stagioni multi-circuito (una stagione che raccoglie più circuiti regionali) o per cicli di qualificazione. Per la maggior parte dei casi — una stagione, un calendario lineare — il tipo **Campionato** semplice basta e avanza.

I figli si agganciano impostando il **Campionato genitore** sul campionato figlio, o si aggiungono dalla pagina del meta-campionato nella sezione **Campionati figli**.

> [!NOTE]
> Il meta-campionato ha una **propria modalità di classifica**, applicata a tutti gli eventi dei campionati figli. Un figlio può usare una modalità diversa per la propria classifica: sono due calcoli indipendenti, non una somma di classifiche.

## 6. Durante la stagione

La pagina del campionato mostra descrizione, elenco dei tornei collegati con il loro stato, **classifica combinata** e — se è un meta-campionato — i campionati figli. C'è anche un **feed .ics** per abbonarsi al calendario delle tappe.

Cose da tenere a mente:

- **Ogni tappa resta un torneo normale**, con il suo ciclo, le sue decklist e la sua finale. Il campionato è uno strato sopra, non al posto.
- **I giocatori entrano da soli**: vengono conteggiati appena giocano una tappa collegata, non c'è un'iscrizione al campionato.
- **Le classifiche appaiono quando i tornei sono terminati.** Una tappa lasciata aperta non entra nel totale: prima di pubblicare, controlla che tutte le tappe siano concluse.
- **Un abbandono in una tappa non è un abbandono dal campionato**: chi si ritira alla tappa 3 può giocare la 4.

### Squalifiche a livello di campionato

Una **squalifica** presa in una tappa **blocca il check-in in tutte le altre tappe dello stesso campionato**, finché un organizzatore del campionato non la revoca. È il meccanismo più incisivo che Archon offre a livello di serie: usalo consapevolmente e mettine conto nel regolamento.

### Chiudere la stagione

**Termina Campionato** chiude la stagione in qualsiasi momento; il campionato passa a stato **Terminato** e il primo in classifica viene incoronato **Campione**. Senza data di fine il campionato resta in corso a tempo indeterminato.

Eliminare un campionato **non elimina i tornei collegati**: i tornei restano, è il contenitore a sparire.

## 7. Buone prassi per i campionati italiani

- **Annuncia comunque le singole tappe** con i 28 giorni di anticipo previsti dal [regolamento VEKN](https://www.vekn.net/tournament-rules): il campionato non sostituisce la sanzione dei tornei che lo compongono.
- **Tieni coerenti formato e rank** fra le tappe: cambiare formato a metà stagione produce classifiche difficili da spiegare.
- **Per le league online**, marca **Online** anche i singoli tornei, non solo il campionato, e valuta il **multideck** (mazzo diverso per round) che è lo standard delle serie online.
- **Scegli la modalità pensando a cosa vuoi incentivare**: GW/VP/TP se vuoi che la gente venga alle tappe piccole, GP se vuoi che le tappe grandi contino, RTP se vuoi la classifica coerente con il ranking VEKN globale.
- **Documenta tutto nella Descrizione** prima della prima tappa. Cambiare le regole a stagione iniziata è il modo più rapido per perdere la fiducia dei partecipanti.

## 8. Segnalare problemi

Per bug e proposte usa **Invia feedback** dalla pagina **Guida**, sezione Feedback: apre una issue su GitHub. Per i dubbi organizzativi sulla scena italiana, il canale è il tuo National Coordinator.

## Riferimenti

- [Guida dell'Organizzatore](https://archon.vekn.net/help/organizer-guide) — sezione Campionati della documentazione ufficiale in-app.
- [Archon Online per Principi](/guide/archon-principi/) — creazione del torneo, console, finale, chiusura.
- [Archon Online per Giudici](/guide/archon-judge/) — sanzioni e squalifiche, che a livello di campionato hanno effetti sulle altre tappe.
- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules).
