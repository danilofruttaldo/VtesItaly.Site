---
title: 'Schemi riassuntivi delle regole'
description: 'Diagrammi di riferimento per le fasi chiave di V:TES — le fasi del turno, la sequenza di un’azione e quella di un round di combattimento.'
categoria: regole-formati
audience: [giocatore, nuovi, judge]
ordine: 20
versione: '0.1'
aggiornato: 2026-06-07
correlate: [demo-eventi]
locale: it
---

Una raccolta di **schemi riassuntivi** delle fasi chiave di **Vampire: The Eternal Struggle**, pensati come riferimento rapido da tenere a tavolo. Non sostituiscono il [regolamento ufficiale VEKN](https://www.vekn.net/rulebook): ne riassumono la sequenza per chi sta imparando o vuole un colpo d’occhio. Gli schemi usano la **terminologia ufficiale inglese** (le parole chiave di gioco — _strike_, _press_, _block_, _range_… — non si traducono, come sulle carte); le spiegazioni qui sotto sono in italiano.

> [!NOTE]
> Schemi in continua aggiunta. Per ora coprono **le fasi del turno**, **l’azione** e il **combattimento**; seguiranno la fase politica (referendum) e altre. Hai un’idea per uno schema utile? Usa il link _Segnala un errore_ in fondo alla pagina.

## Le fasi del turno

Il turno di ogni giocatore (**Methuselah**) scorre attraverso **cinque fasi** fisse, sempre nello stesso ordine.

<figure class="schema-figure">
  <a href="/guide/regole/turno.webp" target="_blank" rel="noopener noreferrer" aria-label="Apri lo schema delle fasi del turno a dimensione piena">
    <img src="/guide/regole/turno.webp" alt="Schema verticale delle cinque fasi del turno in V:TES: Unlock, Master, Minion, Influence, Discard, più il nodo End of turn e il ritorno al turno del Methuselah successivo." width="800" height="560" loading="lazy" decoding="async" />
  </a>
  <figcaption>Le fasi del turno</figcaption>
</figure>

Le cinque fasi (descrizioni dal [rulebook ufficiale](https://www.vekn.net/rulebook/4-detailed-turn-sequence)):

1. **Unlock** — stappi (_unlock_) tutte le tue carte; se controlli l'**Edge** puoi guadagnare 1 _pool_.
2. **Master** — ricevi 1 **master phase action** (default): la usi per giocare una _master card_ (alcune carte cambiano questo numero o danno usi alternativi).
3. **Minion** — i tuoi _minion_ stappati compiono **azioni** (agire **locka**, cioè tappa, il minion). I minion **avversari** possono tentare il **block**, e il blocco li porta in **combat** con il minion attivo.
4. **Influence** — ricevi 4 **transfer** (default), da spendere per influenzare i vampiri _uncontrolled_ in gioco (1 transfer = 1 _pool_ su un vampiro uncontrolled; 4 transfer + 1 pool = sposti un vampiro dal crypt all'uncontrolled).
5. **Discard** — ricevi 1 **discard phase action** (default): scarti una carta e **ne peschi una di rimpiazzo**; in alternativa metti in gioco 1 carta **event** (max una per fase).

Dopo la **Discard** il turno **finisce** e passa al _Methuselah_ successivo.

> [!NOTE]
> **Timing tra le fasi** (utile ai veterani). Gli effetti che durano «**until end of turn**» scadono alla **fine del turno**, cioè **dopo** la fase Discard. Esempio: _Dreams of the Sphinx_ (+2 alla mano fino a fine turno) è ancora attivo durante il rimpiazzo carte della Discard e termina solo a turno concluso.

## L'azione

Dall’annuncio di un’azione fino a dopo la sua risoluzione: i tentativi di blocco, le due strade (azione **successful**, non bloccata, o **blocked**), l’eventuale **queued combat** e il ritorno al ciclo per continuare l’azione.

<figure class="schema-figure">
  <a href="/guide/regole/azione.webp" target="_blank" rel="noopener noreferrer" aria-label="Apri lo schema dell'azione a dimensione piena">
    <img src="/guide/regole/azione.webp" alt="Schema della sequenza di un'azione in V:TES: annuncio, tentativi di blocco, risoluzione (azione non bloccata o bloccata), combattimento in coda e ritorno al ciclo dell'azione." width="1320" height="730" loading="lazy" decoding="async" />
  </a>
  <figcaption>Sequenza di un'azione</figcaption>
</figure>

In sintesi:

- **As the action is announced** — la finestra di gioco dedicata che si apre all'annuncio dell'azione (carte come _Seduction_).
- **Block attempts** — la finestra **separata** in cui si dichiarano i **block** (tentativi di blocco).
- Se l'azione è **successful** (non bloccata), se ne applicano gli effetti (**Apply the effects**).
- Se è **blocked** (bloccata), si passa alla **Block resolution** (block / combat).
- Entrambi i rami possono includere un **Queued combat** (combattimento accodato) — opzionale, non più di uno alla volta. Carte come <em>Psyche!</em> o <em>Coordinated Attacks</em> ne accodano un altro (<strong>1</strong>); carte come <em>Hidden Lurker</em> o <em>Fast Reaction</em> saltano direttamente all'**After combat** (<strong>2</strong>).
- Conclusa la **Resolution**, l'azione **continua** (_continue the action_): nuovi Block attempts, ecc. Le fasi **After combat** e **After block resolution** rientrano in **After resolution**.

## Il combattimento

Un round di combattimento (**round of combat**) si svolge in **sette step**. Al termine del round il combattimento può proseguire con un nuovo round (**press**) oppure terminare.

<figure class="schema-figure">
  <a href="/guide/regole/combat.webp" target="_blank" rel="noopener noreferrer" aria-label="Apri lo schema del combattimento a dimensione piena">
    <img src="/guide/regole/combat.webp" alt="Schema della sequenza di un round di combattimento in V:TES: before range, determine range, before strikes, strikes, damage resolution, press, end of round; con loop dei colpi addizionali e del press, il ramo «combat ends» che salta a fine combattimento e Psyche! che fa ripartire un combat che starebbe per finire." width="960" height="810" loading="lazy" decoding="async" />
  </a>
  <figcaption>Sequenza di un round di combattimento</figcaption>
</figure>

I sette step:

1. **Before range** — finestra per giocare carte prima che la distanza (_range_) sia scelta.
2. **Determine range** — distanza **Close** (default) oppure **Long**; le manovre (_maneuver_) la cambiano.
3. **Before strikes** — carte giocabili dopo la distanza, prima di scegliere i colpi (_strike_).
4. **Strikes** — il _minion_ attivo annuncia per primo; i colpi risolvono insieme (salvo effetti di _first strike_, ecc.).
5. **Damage resolution** — prima si previene il danno, poi si gestisce il restante (bruciando contatori di sangue o vita).
6. **Press** — i combattenti decidono se continuare il combattimento o separarsi.
7. **End of round** — si giocano carte ed effetti di fine round.

Eventuali **additional strikes** (colpi addizionali, concessi da carte come <em>Additional Strike</em>) ripetono gli step 4–5 — _strike_ e _damage resolution_ — uno alla volta, **prima del Press**. Un _minion_ non può usare più di una carta/effetto per ottenere _additional strikes_ per round.

Si apre un **nuovo round** se resta un «**press to continue**» non annullato: **basta il press di un combattente** (l'avversario può annullarlo con il proprio press). Il combattimento **termina immediatamente** se un combattente viene _burned_ o mandato in _torpor_, in qualsiasi momento della sequenza.

Due interazioni spezzano la sequenza (nello schema, riferimenti **1** e **2**):

- **1 — strike con «combat ends»**: il combattimento **termina alla risoluzione di quello strike**; si salta il resto della risoluzione e il **Press**, ma lo step **End of round** viene comunque eseguito.
- **2 — _Psyche!_ ed effetti simili** (entrano in gioco all'_end of combat_): al contrario, fanno **ripartire un combat che starebbe per finire**, forzando un nuovo round.

## Riferimenti

- [VEKN Rulebook](https://www.vekn.net/rulebook) — regolamento di gioco ufficiale.
- [New Player Guide ufficiale VEKN](/guide/demo/vtes-new-player-guide-en.pdf) _(A3, in inglese)_ — riepilogo illustrato di zone, fasi del turno, combat, clan e discipline.
- [Condurre una demo VTES](/guide/demo-eventi/) — per usare questi schemi durante una dimostrazione.
