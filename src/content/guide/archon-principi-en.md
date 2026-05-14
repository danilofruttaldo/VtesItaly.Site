---
title: 'Archon Online for Princes'
description: 'Create an event, manage check-in, rounds, finals and reports on the official VEKN platform.'
categoria: organizzare
audience: [principe]
ordine: 10
versione: '0.4'
aggiornato: 2026-05-14
correlate: [archon-giocatori-en, archon-judge-en]
locale: en
---

[Archon Online](https://archon.vekn.net) is the official VEKN platform for managing **Vampire: The Eternal Struggle** tournaments. This guide covers the _organizer_ side: event creation, tournament cycle, finals, reports. For the _player_ side see [Archon Online for players](/en/guides/archon-giocatori/); for the judge role see [Archon Online for Judges](/en/guides/archon-judge/).

To create sanctioned _Constructed_ tournaments you must be a **VEKN Prince**. Non-Princes can only create _Demo_, _Launch Party_ and _Unsanctioned_ events. To become a Prince, contact your National Coordinator. Reference: [How to run a V:TES tournament](https://www.vekn.net/how-to-run-a-v-tes-tournament).

> [!IMPORTANT]
> **Archon is the future, but we're not all the way there yet.** The _BCP Organized Play Coordinator_ has said the old `vekn.net` calendar/event system will be gradually retired and Archon should be used as much as possible. But until the _archon → vekn.net_ sync is stable, events must be **created on `vekn.net`** and then managed on Archon. See [Known bugs](#7-known-bugs-and-workarounds) for documented cases.

## 1. Tournament states

On Archon every tournament moves through these states:

| State            | What happens                                               |
| ---------------- | ---------------------------------------------------------- |
| **PLANNED**      | Initial state. Only judges can register players.           |
| **REGISTRATION** | Self-service registration open to players.                 |
| **WAITING**      | Check-in open. Registered players can still self-register. |
| **PLAYING**      | Round in progress.                                         |
| **FINALS**       | Final in progress.                                         |
| **FINISHED**     | Tournament closed, winner computed automatically.          |

Useful state changes to remember:

- `WAITING → REGISTRATION` via **Cancel Check-in** (to allow decklist edits).
- `PLAYING → REGISTRATION` after **Finish Round** (to handle drops and last-minute signups before the next round).

## 2. Creating an event

### Recommended procedure: via the VEKN calendar

VEKN recommends creating events on [vekn.net → Create an Event](https://www.vekn.net/create-event). Once created, they appear on Archon after the **daily** sync. Then check on Archon that the data matches (you can edit it from the _Tournament Manager_ anyway).

> [!NOTE]
> The vekn.net → Archon sync is daily, not immediate. Create the event well in advance of registration opening.

### Alternative procedure: archon.vekn.net (Create Tournament)

From the **Tournaments** page the **Create Tournament** button opens a full form (name, format, rank, proxies, multideck, decklist required, online, venue, dates, time zone, markdown description, judges and organizers). In theory the event created here syncs back to `vekn.net`.

> [!WARNING]
> In practice the _archon → vekn.net_ sync still has documented bugs on country, venue, proxies flag and rounds. Until further VEKN notice: **always create on `vekn.net`** and manage from Archon.

### Registering new VEKN players directly from Archon

Princes and National Coordinators can create new VEKN accounts directly from Archon, without going through the VEKN admin. Useful for last-minute registrations.

> [!NOTE]
> The new player record may fail to sync correctly with the VEKN registry (known cases: wrong country). If you'll need to use it for future historical archon Excel uploads, double-check with your NC.

## 3. Tournament Manager

When you open an event you organize, a <span class="archon-pill archon-pill--yellow">Tournament Manager</span> button appears (players only see the registration view). From here you manage the entire tournament cycle.

### Info tab

Lets you edit event data (venue, description, times, etc.) at any time.

### Registration tab — Check-in

Shows the list of registered players (including drops). At start time, open the check-in and enter the players actually present.

Three actions for each player:

- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: accesses sanctions and decklist. With check-in open you **cannot** update the decklist even though the command appears active.
- <span class="archon-btn archon-btn--check-in archon-btn--green" aria-hidden="true"></span> **check-in**: includes the player in the round.
- <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **drop**: drops the player from the tournament.

> [!NOTE]
> Distinct from Drop: the <span class="archon-btn archon-btn--check-out archon-btn--yellow" aria-hidden="true"></span> **Check out** action (judge-only) marks a **temporary absence** for one or more rounds (a player stepping away without dropping). Allows re-check-in next round. The <span class="archon-btn archon-btn--drop archon-btn--red" aria-hidden="true"></span> **Drop** button is permanent withdrawal; for temporary check-out coordinate with a judge.

Global commands:

- <span class="archon-pill archon-pill--primary">Check everyone in</span>: checks in all registered players at once.
- <span class="archon-pill archon-pill--grey">Cancel Check-in</span>: closes the check-in (back to `REGISTRATION`). Required to allow decklist edits; reopen the check-in afterwards.
- <span class="archon-pill archon-pill--primary">Register / New Member</span>: last-minute player registration (requires a VEKN ID, or creates a new one).
- <span class="archon-pill archon-pill--green">Start Round</span>: starts the round, generates tables and seatings.

### Round tab — round management

During the round, players see their own table on their devices. The organizer sees the full table list.

- <span class="archon-btn archon-btn--pencil archon-btn--purple" aria-hidden="true"></span> **pencil**: enter the player's score (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5 VP).
- <span class="archon-btn archon-btn--info archon-btn--blue" aria-hidden="true"></span> **info**: sanctions, view decklist.
- <span class="archon-btn archon-btn--seating archon-btn--yellow" aria-hidden="true"></span> **Alter Seating**: change round seatings. Poorly tested feature: use only in exceptional cases.
- <span class="archon-pill archon-pill--green">Finish Round</span>: closes the round. All tables must be _Finished_; to validate an irregular score before closing, see [Override on irregular table score](#override-on-irregular-table-score) below.

#### Override on irregular table score

The <span class="archon-pill archon-pill--yellow">Override</span> button (judges only) validates a non-standard score. Typical case: a player disqualified mid-round and VP not summing to 5 by regulation. It applies to a single table, taking round, table and a mandatory reason. Who issued it is tracked. To revoke it, use the <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> trash icon on the row.

In medium/large tournaments the override is issued by the **judge**. In small tournaments where you are both Prince and judge, you apply it yourself — see the [Judge guide](/en/guides/archon-judge/#5-what-you-can-do-as-a-judge-and-what-you-cant).

After _Finish Round_ you go back to `REGISTRATION`: drop anyone leaving, reopen check-in and repeat the cycle until rounds are over.

> [!TIP]
> **Automatic no-show drop**: since v0.51 players registered but absent at check-in are dropped automatically. No need to drop them one by one.

### Offline mode

Archon supports an **offline mode** to run a tournament from a venue with no reliable connectivity: events are stored locally and synced when connectivity comes back. Offline mode **can be deactivated by any judge** once back online — you don't need to be the Prince who created the event.

## 4. Sanctions

From the **i (info)** card — accessible from _Registration_ and _Round_ — you reach the player sanctions module. Archon defines **four levels**, cumulative by severity and tracking:

| Level              | Effect                                                                             | Recording                                                   |
| ------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `CAUTION`          | Informational only, a verbal warning to the player.                                | **Not recorded** in the VEKN database (informal notice).    |
| `WARNING`          | Formal warning.                                                                    | Recorded on the public VEKN profile, visible to anyone.     |
| `GAME_LOSS`        | Forced loss for the player at the current table. Always paired with a `WARNING`.   | Recorded on the public VEKN profile (the `WARNING` is too). |
| `DISQUALIFICATION` | Removes the player from the tournament (possibly "without prize" in severe cases). | Recorded on the public VEKN profile.                        |

Sanctions can be categorized (`category` field):

- `DECK_PROBLEM` — decklist issue.
- `PROCEDURAL_ERRORS` — procedural errors.
- `CARD_DRAWING` — card drawing problems.
- `MARKED_CARDS` — marked cards.
- `SLOW_PLAY` — slow play.
- `UNSPORTSMANLIKE_CONDUCT` — unsporting behaviour.
- `CHEATING` — fraudulent behaviour.

A judge can remove a previously applied sanction by clicking the <span class="archon-btn archon-btn--trash archon-btn--red" aria-hidden="true"></span> trash icon next to it — useful for mistakes or for sanctions applied pending clarifications that turn out fine.

> [!IMPORTANT]
> **`DISQUALIFICATION` ≠ Drop.** To remove a player from the tournament for disciplinary reasons, use the `DISQUALIFICATION` sanction, **not** the _Drop_ button. Drop is a neutral player or logistic action; disqualification stays on the VEKN history and carries weight at future events.

The usual workflow: the **Judge** verifies and proposes the sanction, the **Prince** records it (in small tournaments the Prince may also be the judge). For the judge role detail see [Archon Online for Judges](/en/guides/archon-judge/).

## 5. Finals

After the last round, the final happens in two explicit steps:

1. **Seed Finals** — the system computes finalist seeding based on results. Verify that all finalists are present; drop anyone missing before seeding.
2. **Seat Finals** — finalists pick their seat at the table in **seed order** (VEKN rule: top seed picks last). Archon collects the choices.

### Breaking ties between finalists

When two or more players have identical GW/VP/TP, their rows in the **Seed Finals** modal are highlighted yellow and the <span class="archon-pill archon-pill--yellow">Toss</span> button (coin icon) becomes enabled. The numeric **Toss** field next to each tied player is **not the die-roll result** but the **post-tiebreak ordinal**: 1 = best seed, 2 = next, and so on.

Two ways to assign it:

- <span class="archon-pill archon-pill--yellow">Toss</span> — Archon randomizes the values for the tied group itself. Quick if you don't have dice handy.
- **Manual**: do a physical roll (die, coin) between the players involved and enter `1` for the toss winner, `2` for the next, etc. This is the "official" at-table procedure, aligned with the [VEKN tournament rules](https://www.vekn.net/tournament-rules), section 3.1 ("any fair random method").

> [!IMPORTANT]
> The field accepts `0`–`5` but what matters is only the **relative ordering inside the tied group**: lowest value gets the best seed. You don't need to map the die result (`d6 = 4`) onto the field — just give `1` to whoever rolled best.

After the final, record the result and close the tournament: Archon computes the winner and final standings automatically and tries to sync with `vekn.net`.

Useful pages to share with players:

- Public tournament view: `archon.vekn.net/tournament/<uuid>/display.html`
- Organizer console (private): `archon.vekn.net/tournament/<uuid>/console.html`

## 6. VEKN timing and formats

From the [official VEKN rulebook](https://www.vekn.net/tournament-rules):

- **VEKN sanction**: request the sanction at least **28 days** before the event.
- **Announcement**: the event must be advertised at least **28 days** in advance, stating date, time and location.
- **Archival**: the organizer must keep a copy of the report for at least **1 year**.

### Who can sanction what

- **VEKN Prince**: all sanctioned formats (_Standard Constructed_, _Limited_, _National Championship_, _Continental Qualifier_, etc.).
- **Non-Prince**: only _Demo_, _Launch Party_ and _Unsanctioned_ events.

### Online tournaments

To register an online tournament just check the **Online tournament** box in the event creation form on `vekn.net`. The event becomes visible on Archon by enabling the **Include Online** toggle.

Archon specifics for online tournaments:

- **On-demand pairing**: Archon generates pairings and seatings on the fly — useful for multi-session leagues. When you can, use the _optimal pre-computed seating_ from the historical VEKN Excel sheet.
- **Multideck**: online formats are typically multideck (different deck per round); the _VEKN Online Constructed Ranking_ recognizes the format.
- **Standings reconciliation**: Archon standings on online leagues have had historical bugs — see [Known bugs](#7-known-bugs-and-workarounds) and cross-check with [vtes-hook.com](https://www.vtes-hook.com) before publishing the ranking.

Non-Archon operational aspects (Discord for registrations and voice, Lackey CCG for play) are outside the scope of this guide.

## 7. Known bugs and workarounds

> [!WARNING]
> The list below summarizes bugs documented on the VEKN forum (Prince List and Organizational Questions) and in the [vtes-biased/archon](https://github.com/vtes-biased/archon) repo between November 2025 and May 2026. The situation evolves rapidly: before assuming a bug is still open, check the [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md).

**Event import archon → vekn.net with wrong fields.** Documented cases: country (a Hungarian event ended up in Palma de Mallorca), inverted _proxies allowed_, venue, rounds, _limitedness_. _Workaround_: always create the event on `vekn.net`, not via _Create Tournament_ on Archon. If the bug already hit, in severe cases it's worth deleting and recreating the event on `vekn.net`.

**New player sync Archon → VEKN registry.** When you create a new player from Archon, they may land in the registry with the wrong country. _Workaround_: verify with your NC before relying on the record for historical archon Excel uploads.

**"Unable to finish tournament" → internal server error.** When you close the tournament, Archon tries to submit results to `vekn.net`. If a historical archon Excel is already uploaded on the VEKN side for that event, the submit fails and Archon can't close. _Workaround_: ask your National Coordinator to remove the already-uploaded archon file on `vekn.net`, then retry.

**Finalists can't see results after closure.** Once the tournament is `FINISHED`, finalists don't always see the final results from their view. _Workaround_: share the `display.html` link manually.

**"Registered" count includes drops.** Players who pre-register and then drop remain in the tournament's "registered" count. _Mitigation_: in pre-event communications, quote the real count (registered − drop).

**Decklists visible to a playing Prince.** In small tournaments the Prince may also play: in that case they see opponents' decklists. _Ethical mitigation_: have a non-playing judge (or a guest Prince) review the lists and note in the final report who checked them.

**Irregular pairing in small tournaments.** Cases reported of players who faced 6-7 different people across 2 rounds instead of the expected 8 (interpretation of the "no pair of players share a table through every single round" rule). _Mitigation_: when possible, review table seatings manually before _Start Round_.

**Buggy standings on online leagues (historical).** Recurring standing bugs on online tournaments. _Workaround_: cross-check with [vtes-hook.com](https://www.vtes-hook.com) as fallback.

## 8. Post-tournament report

Once the tournament is over and data has synced with `vekn.net`, create the forum post in the [Event Reports and TWD](https://www.vekn.net/forum/event-reports-and-twd) section and wait for approval from the National Coordinator (who has _tournament organizer_ powers over all tournaments in their country).

Good practice: include in the post both the `vekn.net` event link and the Archon page `archon.vekn.net/tournament/<uuid>/display.html`, and — if you applied notable sanctions — the list (without sensitive personal data).

> [!TIP]
> At tournament end the organizer can **download a clean text file** of the tournament (results, seatings, sanctions) from the Tournament Manager console. Useful as a local backup beyond the VEKN copy.

## 9. Bug reports and feedback

Archon Online is open-source software under active development. The official repository is [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon). To report bugs or UI suggestions, use the **Report Issue** button in the top-right corner of every page on `archon.vekn.net` (opens a GitHub issue; free GitHub account required).

Before reporting, check the bug isn't already known: some are being fixed and are flagged in the [Known bugs](#7-known-bugs-and-workarounds) section of this guide or in the [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md).
