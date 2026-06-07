---
title: 'Rule summary diagrams'
description: 'Reference diagrams for the key phases of V:TES — the turn phases, the sequence of an action and that of a round of combat.'
categoria: regole-formati
audience: [giocatore, nuovi, judge]
ordine: 20
versione: '0.1'
aggiornato: 2026-06-07
correlate: [demo-eventi-en]
locale: en
---

A collection of **summary diagrams** for the key phases of **Vampire: The Eternal Struggle**, meant as a quick at-the-table reference. They don't replace the [official VEKN rulebook](https://www.vekn.net/rulebook): they summarise its sequence for players who are learning or who just want a quick overview. Card names stay in English, as on the cards themselves.

> [!NOTE]
> Diagrams are added over time. So far they cover the **turn phases**, the **action** and **combat**; the political phase (referendum) and others will follow. Got an idea for a useful diagram? Use the _Report an issue_ link at the bottom of the page.

## Turn phases

Each player's (**Methuselah's**) turn runs through **five fixed phases**, always in the same order.

<figure class="schema-figure schema-figure--en">
  <a href="/guide/regole/turno.webp" target="_blank" rel="noopener noreferrer" aria-label="Open the turn-phases diagram full size">
    <img src="/guide/regole/turno.webp" alt="Vertical diagram of the five turn phases in V:TES: Unlock, Master, Minion, Influence, Discard, plus an End of turn node and the handover to the next Methuselah's turn." width="800" height="560" loading="lazy" decoding="async" />
  </a>
  <figcaption>The turn phases</figcaption>
</figure>

The five phases (descriptions from the [official rulebook](https://www.vekn.net/rulebook/4-detailed-turn-sequence)):

1. **Unlock** — unlock all your cards; if you have the **Edge**, you may gain 1 _pool_.
2. **Master** — you receive 1 **master phase action** (default): use it to play a _master card_ (some cards change this number or give alternate uses).
3. **Minion** — your ready _minions_ take **actions** (taking an action **locks** the minion). **Opponents'** ready minions may attempt to **block**, and blocking puts them in **combat** with the acting minion.
4. **Influence** — you receive 4 **transfers** (default) to influence _uncontrolled_ vampires into play (1 transfer = move 1 _pool_ to an uncontrolled vampire; 4 transfers + 1 pool = move a vampire from your crypt to the uncontrolled region).
5. **Discard** — you receive 1 **discard phase action** (default): discard a card and **draw to replace it**; or put 1 **event** card into play (no more than one per phase).

After the **Discard** phase, the turn **ends** and passes to the next _Methuselah_.

> [!NOTE]
> **Timing between phases** (handy for veterans). Effects that last "**until end of turn**" expire at the **end of the turn**, i.e. **after** the Discard phase. Example: _Dreams of the Sphinx_ (+2 hand size until end of turn) is still active during the Discard replacement and only ends once the turn is over.

## The action

From the announcement of an action to after it resolves: block attempts, the two paths (**successful** or **blocked** action), the optional **queued combat**, and the return to the cycle to continue the action.

<figure class="schema-figure schema-figure--en">
  <a href="/guide/regole/azione.webp" target="_blank" rel="noopener noreferrer" aria-label="Open the action diagram full size">
    <img src="/guide/regole/azione.webp" alt="Diagram of the sequence of an action in V:TES: announcement, block attempts, resolution (successful or blocked action), queued combat and return to the action cycle." width="1320" height="730" loading="lazy" decoding="async" />
  </a>
  <figcaption>Sequence of an action</figcaption>
</figure>

In short:

- **As the action is announced** — the dedicated play window that opens when the action is announced (cards like _Seduction_).
- **Block attempts** — the **separate** window where blocks are declared.
- If the action is **successful** (unblocked), its **effects are applied**.
- If it is **blocked**, you move to the **block resolution** (block / combat).
- Either branch may include a **queued combat** — optional, and no more than one at a time. Cards like <em>Psyche!</em> or <em>Coordinated Attacks</em> queue another one (<strong>1</strong>); cards like <em>Hidden Lurker</em> or <em>Fast Reaction</em> jump straight to "after combat" (<strong>2</strong>).
- After resolution the action **continues** its cycle (new block attempts, and so on).

## Combat

A round of combat runs through **seven steps**. At the end of the round, combat may continue with a new round (**press**) or end.

<figure class="schema-figure schema-figure--en">
  <a href="/guide/regole/combat.webp" target="_blank" rel="noopener noreferrer" aria-label="Open the combat diagram full size">
    <img src="/guide/regole/combat.webp" alt="Diagram of the sequence of a round of combat in V:TES: before range, determine range, before strikes, strikes, damage resolution, press, end of round; with the additional-strikes and press loops, the «combat ends» branch that skips to end of combat, and Psyche! restarting a combat about to end." width="960" height="810" loading="lazy" decoding="async" />
  </a>
  <figcaption>Sequence of a round of combat</figcaption>
</figure>

The seven steps:

1. **Before range** — window for cards before range is chosen.
2. **Determine range** — **Close** (default) or **Long**; maneuvers change it.
3. **Before strikes** — cards playable after range, before choosing strikes.
4. **Strikes** — the acting minion announces first; strikes resolve together (barring _first strike_ effects, etc.).
5. **Damage resolution** — first prevent damage, then handle the rest (by burning blood or life counters).
6. **Press** — combatants decide whether to continue the combat or separate.
7. **End of round** — end-of-round cards and effects are played.

Any **additional strikes** (granted by cards such as _Additional Strike_) repeat steps 4–5 — strike and damage resolution — one at a time, **before the Press step**. A minion cannot use more than one card or effect to gain additional strikes per round.

A **new round** begins if there is an uncancelled "press to continue": **one minion's press is enough** (the opponent may cancel it with their own press). Combat **ends immediately** if a combatant is burned or sent to torpor, at any point in the sequence.

Two interactions break the sequence (references **1** and **2** in the diagram):

- **1 — a strike with “combat ends”**: combat **ends as that strike resolves**; the rest of strike resolution and the **Press** step are skipped, but the **End of round** step still occurs.
- **2 — _Psyche!_ and similar effects** (played at _end of combat_): conversely, they **keep a combat going that would otherwise end**, forcing a new round.

## References

- [VEKN Rulebook](https://www.vekn.net/rulebook) — the official rules.
- [Official VEKN New Player Guide](/guide/demo/vtes-new-player-guide-en.pdf) _(A3, English)_ — illustrated overview of zones, turn phases, combat, clans and disciplines.
- [Running a V:TES demo](/guide/demo-eventi-en/) — to use these diagrams during a demonstration.
