---
title: 'Archon Online for Judges'
description: 'Verify decklists, apply sanctions and intervene during rounds from the official VEKN platform.'
categoria: organizzare
audience: [judge]
ordine: 20
versione: '0.5'
aggiornato: 2026-05-14
correlate: [archon-giocatori-en, archon-principi-en]
locale: en
---

[Archon Online](https://archon.vekn.net) is the official VEKN platform for managing **Vampire: The Eternal Struggle** tournaments. This guide is for **Judges**: what you can do from the portal during a tournament and how to coordinate with the organizer. For event creation and the full tournament cycle, see [Archon Online for Princes](/en/guides/archon-principi/).

> [!NOTE]
> The Judge and the Prince are **distinct operational roles** but with **largely overlapping** powers on the portal. In medium/large tournaments it's customary to keep them separate (Prince = organization/flow, Judge = decklist review, sanctions, table calls). In small tournaments the same person wears both hats, and Archon doesn't formally enforce the split. See the [full capability map](#5-what-you-can-do-as-a-judge-and-what-you-cant).

## 1. Becoming a judge on a tournament

To act as a judge on an Archon tournament you must be added by the organizer to the **Judges and Organizers** field at event creation (or later from the _Tournament Manager_ → _Info_ tab). Without this association the platform shows you the event as any other player.

Verify with the Prince **before the tournament starts**:

- that your Archon account (Discord or email) is the correct one;
- that your VEKN ID has been added as a judge on the event;
- log in to the event and check that the <span class="archon-pill archon-pill--yellow">Tournament Manager</span> button is visible.

### VEKN roles in the system

Archon recognises several VEKN grades — `JUDGEKIN`, `JUDGE`, `RULEMONGER` for judges; `PRINCE` for organisers with a VEKN sanction for Constructed; plus `NC` (National Coordinator), `ADMIN`, `PTC` (Playtest Coordinator), `PLAYTESTER`, `ETHICS` (Ethics Committee). In the Tournament Manager **all judge grades share the same permissions**: the grade matters for formal responsibilities and appointments (e.g. `RULEMONGER`, appointed by the VEKN Rules Director, co-maintains the rulebook, the rulings database and the judges tests) — not for what you can click on the portal.

## 2. Decklist verification

Decklists are verified from the **Tournament Manager → Registration tab**, before the first round starts.

On each player you'll find the <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** button, which opens the card with _sanctions_ and _decklist_. The decklist is shown in text form: deck legality checks (format, card count, banlist) happen here.

If you find a non-compliant list:

- alert the Prince right away;
- ask the player to fix the list.

> [!WARNING]
> With the **check-in open** the player **cannot** edit the decklist even though the command appears active in their UI. To allow the edit, the Prince must use <span class="archon-pill archon-pill--grey">Cancel Check-in</span>, let the player fix the list, then reopen the check-in. Always coordinate this step with the organizer.

## 3. Sanctions

From the same <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** card — accessible both from the _Registration_ tab and the _Round_ tab — you reach the **sanctions** module for that player. Archon defines **four sanction levels**, cumulative by severity and tracking:

| Level              | Tournament effect                                                                  | Recording                                                   |
| ------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `CAUTION`          | Informational only, no mechanical effect — a verbal warning to the player.         | **Not recorded** in the VEKN database (informal notice).    |
| `WARNING`          | Formal warning.                                                                    | Recorded on the public VEKN profile, visible to anyone.     |
| `GAME_LOSS`        | Forced loss for the player at the current table. Always paired with a `WARNING`.   | Recorded on the public VEKN profile (the `WARNING` is too). |
| `DISQUALIFICATION` | Removes the player from the tournament (possibly "without prize" in severe cases). | Recorded on the public VEKN profile.                        |

You can attach a **category** to clarify the reason:

- `DECK_PROBLEM` — decklist issue.
- `PROCEDURAL_ERRORS` — procedural errors.
- `CARD_DRAWING` — card drawing problems.
- `MARKED_CARDS` — marked cards.
- `SLOW_PLAY` — slow play.
- `UNSPORTSMANLIKE_CONDUCT` — unsporting behaviour.
- `CHEATING` — fraudulent behaviour.

Always fill in **category** and a clear **reason**: whoever reads the sanction six months later must be able to make sense of it.

> [!NOTE]
> **Traceability.** Every sanction explicitly records the **judge who issued it** and the reason. Sanctions are not anonymous: in a future review you can see who applied what, and why. The same holds for sanction removal and for score overrides (see [Intervening during a round](#4-intervening-during-a-round)).

### Removing a sanction

If you applied a sanction by mistake or the situation later cleared up, you can remove it by clicking the <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> trash icon next to the sanction on the player card. Coordinate with the Prince: best to do this before the tournament closes, so the "clean" version ends up in the final report.

> [!IMPORTANT]
> **`DISQUALIFICATION` ≠ Drop.** To remove a player from the tournament for disciplinary reasons, **use the `DISQUALIFICATION` sanction**, not the <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop** button. Drop is a neutral player action (voluntary withdrawal, logistics); a disqualification stays on the VEKN history and carries weight at future events. Mixing them up devalues both.

> [!TIP]
> `CAUTION` is the lightest notice and **leaves no trace on the VEKN profile**: use it as a verbal warning for first issues you don't want to formalise. `WARNING` instead **is recorded**: apply it when the behaviour was already flagged verbally, or when the situation calls for a permanent disciplinary note. Weigh the reason you write into a `WARNING`: anyone consulting the player's profile in the future will read it.

> [!TIP]
> In **online tournaments**, with no physical clock, `SLOW_PLAY` is the most recurring sanction; `UNSPORTSMANLIKE_CONDUCT` covers intentional disconnects and leaving the voice channel.

## 4. Intervening during a round

From the **Round tab** of the Tournament Manager you see the full list of tables. For each player at a table:

- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: quick view of that player's decklist and sanction history — handy when you walk up to a table for a call.
- <span class="archon-btn archon-btn--pencil archon-btn--purple" aria-hidden="true"></span> **pencil** (results entry): in medium/large tournaments the Prince enters VP; in small ones, or when asked, you do it. Results you set as a judge **are final**: players can't overwrite them from their view.

> [!TIP]
> For at-table rulings, look up the rule in the official rulebook before answering, even if you know it by heart: players trust an answer more when they see you consult the source. The [VEKN Rulebook](https://www.vekn.net/rulebook) is accessible online from your phone.

### Override on irregular table score

Sometimes a table closes with a "non-standard" score that the system wouldn't accept in the normal flow: typically a mid-round disqualification, or VP not summing to 5 by regulation. In those cases use the <span class="archon-pill archon-pill--yellow">Override</span> button (judges only).

The override applies to a single table and asks for three things:

- **Round** — round number.
- **Table** — table number.
- **Reason** — mandatory free-text (e.g., "DQ player P3 in round 2 for `CHEATING`, VP redistributed per regulation").

The action is logged against your name. To revoke an override, remove it from its row with the <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> trash icon.

### CheckOut (temporary absence)

Distinct from Drop, the <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **Check out** action marks a player as **temporarily absent** for one or more rounds (e.g., stepping away for a round without dropping). Allows re-check-in next round; Drop is permanent. Use it when the Prince asks you to "skip" a player without dropping them.

## 5. What you can do as a Judge (and what you can't)

In the _Tournament Manager_ the Judge owns everything related to **players, sanctions and table-level corrections**. The Prince organizer keeps control of the **tournament lifecycle** (round start/finish, event close, event data).

As a **Judge**, from the _Registration_ tab, the _Round_ tab and the player cards you can:

- **Register players**: open/close registration, sign up an existing player or create a new one (with on-the-fly VEKN ID generation).
- **Manage check-in**: open/cancel check-in, check in a single player or everyone at once, check out (temporary absence) or drop (leaving the tournament).
- **Adjust pre-round seating** with `Alter Seating` when the Prince asks you to fix a pairing before the round starts.
- **Apply and remove sanctions** from the player's <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info** card (see [Sanctions](#3-sanctions)).
- **Correct anomalous scores** with `Override` / `Unoverride` on a single table (see [Override on irregular table score](#override-on-irregular-table-score)).
- **Run the finals**: compute the seeding (`SeedFinals`) and assign seats (`SeatFinals`). These are **judge-only actions**: if the Prince is not also a judge, a judge must be present for the finals.

These stay **Prince-only** (ask them if you need one):

- start, finish or cancel a round (`RoundStart` / `RoundFinish` / `RoundCancel`);
- close the tournament and submit results to `vekn.net` (`Finish`);
- edit event data (venue, description, times) from the _Info_ tab.

For the exhaustive action list (useful for doubts or to filter logs), see the [Archon README](https://github.com/vtes-biased/archon).

> [!IMPORTANT]
> **Mixed role in small tournaments.** When the Prince is also the only judge (typical at local tournaments), the split above collapses: the same person holds both sets of powers. In practice you can do more, but **you don't have fewer responsibilities**: even doing everything alone, apply both roles' best practices — traceability on sanctions, explicit reason on overrides, clean separation between Drop and disqualification.

## 6. Offline mode

Archon supports an **offline mode** for tournaments in venues without reliable connectivity: events are stored locally and synced when connectivity comes back. Offline mode **can be deactivated by any judge** once back online — you don't need to be the Prince who created the event, having the Judge role on the tournament is enough.

## 7. Coordinating with the organizer

Good practices before and during the tournament:

- **Initial briefing** (5 minutes before check-in): format, any announced deviations, applicable banlist, _proxies_ allowed or not.
- **Quick communication channel** (chat, Telegram, voice) with the Prince to coordinate opening/closing of check-in when a decklist must be corrected.
- **End-of-tournament notes**: hand the Prince a list of applied sanctions with context, so they can include the relevant ones in the report post.

## References

- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules) — official tournament regulations.
- [VEKN Rulebook](https://www.vekn.net/rulebook) — game rulebook.
- Official Archon Online repository: [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon).
- For Archon UI bugs or suggestions, use the **Report Issue** button in the top-right corner of every page on `archon.vekn.net` (GitHub account required).
