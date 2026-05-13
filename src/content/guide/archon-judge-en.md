---
title: 'Archon Online for Judges'
description: 'Verify decklists, apply sanctions and intervene during rounds from the official VEKN platform.'
categoria: organizzare
audience: [judge]
ordine: 20
versione: '0.3'
aggiornato: 2026-05-13
correlate: [archon-giocatori-en, archon-principi-en]
locale: en
---

[Archon Online](https://archon.vekn.net) is the official VEKN platform for managing **Vampire: The Eternal Struggle** tournaments. This guide is for **Judges**: what you can do from the portal during a tournament and how to coordinate with the organizer. For event creation and the full tournament cycle, see [Archon Online for Princes](/en/guides/archon-principi/).

> [!NOTE]
> The Judge and the Prince are **distinct operational roles** but with **largely overlapping** powers on the portal. In medium/large tournaments it's customary to keep them separate (Prince = organization/flow, Judge = decklist review, sanctions, table calls). In small tournaments the same person wears both hats, and Archon doesn't formally enforce the split. See [§5](#5-judge-capabilities-vs-prince-role) for the full map.

## 1. Becoming a judge on a tournament

To act as a judge on an Archon tournament you must be added by the organizer to the **Judges and Organizers** field at event creation (or later from the _Tournament Manager_ → _Info_ tab). Without this association the platform shows you the event as any other player.

Verify with the Prince **before the tournament starts**:

- that your Archon account (Discord or email) is the correct one;
- that your VEKN ID has been added as a judge on the event;
- log in to the event and check that the yellow **Tournament Manager** button is visible.

### VEKN roles in the system

Archon distinguishes several VEKN grades (`MemberRole` in the source code):

- **`JUDGE`** — standard judge.
- **`RULEMONGER`** — "super-judge", reference for rules interpretations.
- **`JUDGEKIN`** — judge in training (mentoring).
- **`PRINCE`** — organizer with VEKN sanction for Constructed.
- **`NC`** — National Coordinator.
- Others: `ADMIN`, `PTC` (Playtest Coordinator), `PLAYTESTER`, `ETHICS` (Ethics Committee).

On the portal, for tournament operational purposes (capabilities in the _Tournament Manager_), the practical effects of `JUDGE` / `RULEMONGER` / `JUDGEKIN` are aligned: the VEKN grade affects formal responsibilities and appointments, not what you can click.

## 2. Decklist verification

Decklists are verified from the **Tournament Manager → Registration tab**, before the first round starts.

For each player listed, the **i (info, blue)** button opens the card with _sanctions_ and _decklist_. The decklist is shown in text form: deck legality checks (format, card count, banlist) happen here.

If you find a non-compliant list:

- alert the Prince right away;
- ask the player to fix the list.

> [!WARNING]
> With the **check-in open** the player **cannot** edit the decklist even though the command appears active in their UI. To allow the edit, the Prince must use **Cancel Check-in**, let the player fix the list, then reopen the check-in. Always coordinate this step with the organizer.

## 3. Sanctions

From the same **i (info)** card — accessible both from the _Registration_ tab and the _Round_ tab — you reach the **sanctions** module for that player. Archon defines **three sanction levels**, distinct in both effect and persistence:

| Level              | Tournament effect                         | VEKN history persistence                               |
| ------------------ | ----------------------------------------- | ------------------------------------------------------ |
| `CAUTION`          | Informational only, no mechanical effect. | Not recorded on the profile.                           |
| `WARNING`          | Formal warning.                           | Recorded, visible to organizers in future tournaments. |
| `DISQUALIFICATION` | Removes the player from the tournament.   | Recorded on the VEKN profile.                          |

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
> **Audit trail.** Every sanction explicitly records the **judge who issued it** (`judge` field in the `Sanction` model) alongside the `comment`. Sanctions are not anonymous: in a future review you can see who applied what, and why. The same holds for `Unsanction` (who removed it) and for score `Override` (see §4).

### Removing a sanction

If you applied a sanction by mistake or the situation later cleared up, you can remove it via the **`Unsanction`** event on the player card. Coordinate with the Prince: best to do this before the tournament closes, so the "clean" version ends up in the final report.

> [!IMPORTANT]
> **`DISQUALIFICATION` ≠ Drop.** To remove a player from the tournament for disciplinary reasons, **use the `DISQUALIFICATION` sanction**, not the _Drop_ button. Drop is a neutral player action (voluntary withdrawal, logistics); a disqualification stays on the VEKN history and carries weight at future events. Mixing them up devalues both.

> [!TIP]
> `CAUTION` leaves no trace: use it for first informal warnings when you want the player notified without penalty. `WARNING` carries medium-term weight: apply it when the behaviour was already flagged verbally, or when you believe the player should have a record consultable by future organizers.

> [!TIP]
> In **online tournaments**, with no physical clock, `SLOW_PLAY` is the most recurring sanction; `UNSPORTSMANLIKE_CONDUCT` covers intentional disconnects and leaving the voice channel.

## 4. Intervening during a round

From the **Round tab** of the Tournament Manager you see the full list of tables. For each player at a table:

- **i (info)**: quick view of that player's decklist and sanction history — handy when you walk up to a table for a call.
- **Purple pencil** (results entry): in medium/large tournaments the Prince enters VP; in small ones, or when asked, you do it. Results you set as a judge **are authoritative**: players cannot overwrite them from their view (explicit comment in the `TableSeat` code).

> [!TIP]
> For at-table rulings, look up the rule in the official rulebook before answering, even if you know it by heart: players trust an answer more when they see you consult the source. The [VEKN Rulebook](https://www.vekn.net/rulebook) is accessible online from your phone.

### Override on irregular table score

Sometimes a table closes with a "non-standard" score that the system wouldn't accept in the normal flow: typical case a mid-round disqualification, or VP not summing to 5 for regulatory reasons. In those cases use the **`Override`** event (judge-only).

The override applies to a single table with three fields:

- `round` — round number.
- `table` — table number.
- `comment` — mandatory free-text reason (e.g., "DQ player P3 in round 2 for `CHEATING`, VP redistributed per regulation").

The action is logged against your name via `ScoreOverride.judge`. To revoke a previously issued override use **`Unoverride`** on the same table/round.

### CheckOut (temporary absence)

Distinct from Drop, the **`CheckOut`** event marks a player as **temporarily absent** for one or more rounds (e.g., stepping away for a round without dropping). Allows re-check-in next round; Drop is permanent. Use it when the Prince asks you to "skip" a player without dropping them.

## 5. Judge capabilities vs Prince role

The Archon README ([vtes-biased/archon](https://github.com/vtes-biased/archon)) explicitly lists Judge capabilities. On the portal you can:

- **Registration**: `OpenRegistration` / `CloseRegistration`, `Register` (including `New Member` with VEKN ID creation).
- **Check-in**: `OpenCheckin`, `CancelCheckin`, `CheckIn`, `CheckEveryoneIn`, `CheckOut`, `Drop`.
- **Round**: `Alter Seating` (pre-round pairing changes).
- **Scores**: `Override` / `Unoverride` on a single table (see §4).
- **Sanctions**: `Sanction` / `Unsanction` (see §3).
- **Finals**: `SeedFinals` (computes finalist seeding) + `SeatFinals` (records seat picks). These are technically judge-only events: in a tournament where the Prince is not also a judge, a judge must be present for the finals.

The following remain **exclusive to the Prince organizer** (not actionable as Judge):

- `RoundStart` / `RoundFinish` / `RoundCancel` — start, close and cancel of a round.
- `Finish` — closing the tournament and submitting results to `vekn.net`.
- Editing event metadata (venue, description, times, etc.) from the _Info_ tab.

> [!IMPORTANT]
> **Mixed role in small tournaments.** When the Prince is also the only judge (typical at local tournaments), the split above collapses: the same person holds both capability sets. In practice this broadens what you can do but **does not lighten the responsibilities**: even if you do everything alone, apply both roles' best practices (audit trail on sanctions, explicit comment on overrides, conceptual separation between Drop and Disqualification).

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
