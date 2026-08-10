---
title: 'Archon Online for Judges'
description: 'Sanctions, overrides, judge calls and decklist checks on the official VEKN platform.'
categoria: organizzare
audience: [judge]
ordine: 20
versione: '1.1'
aggiornato: 2026-08-10
correlate: [archon-italia-en, demo-eventi-en]
locale: en
---

This guide is for whoever judges on [Archon Online](https://archon.vekn.net): what you can do from the portal during a tournament, how sanctions work under the new model, and how to coordinate with the organizer. For the full event cycle the reference is the [Organizer Guide](https://archon.vekn.net/help/organizer-guide) inside Archon; for the cases that recur on the Italian scene see [Archon Online: notes for the Italian scene](/en/guides/archon-italia/).

> [!IMPORTANT]
> **The sanction model has changed.** The old `CAUTION` / `WARNING` / `GAME_LOSS` / `DISQUALIFICATION` scheme with generic categories is gone. Archon now implements the **VEKN Judges Guide** penalty table: four levels — including a new one, the **Standings Adjustment** — three infraction categories with precise subcategories, per-subcategory baseline penalties and escalation hints. **Game loss no longer exists.**

## 1. Becoming a judge on a tournament

Archon has **no separate per-tournament judge role**: judges are **co-organizers** of the event. The organizer adds you from **Tools → Organizers** (or the **Set up** tab before the event) and from then on you have the same powers on the console — equal access, no hierarchy. **IC** members have organizer access on every tournament.

Check **before** the event starts:

- that you are logged in with the right account (passkey, Discord or email — you can link them all to one profile);
- that your VEKN ID is linked to your profile;
- that you were added as an organizer: open the tournament and confirm the console appears (action bar + tabs), not just the player view.

### VEKN grades and what they change

Archon shows grades as badges: **Judge**, **Judgekin** (displayed as **Sheriff**) and **Rulemonger** on the judiciary side; **Prince**, **NC**, **IC** for governance; **Ethics** for the Ethics Committee. For what you can click on an event, **the grade does not matter**: what matters is being among the tournament's organizers. The grade carries formal responsibility (a Rulemonger, for instance, is appointed by the Rules Director) and gates a few actions outside the tournament — creating events, going offline, lifting other people's sanctions.

> [!NOTE]
> **Archon does not distinguish the head judge.** There is no flag separating the head judge from the others: that is something you agree between co-organizers before the event. At small tournaments the Prince and the judge are routinely the same person.

## 2. Sanctions

On the **Players** tab, the gavel icon next to a player opens **Issue Tournament Sanction**. Pick a **level**, a **category** and a **subcategory**. After issuing, a coloured dot appears next to the player: tap it to review or undo their sanctions for this event.

### The four tournament levels

| Level                         | Effect                                                      |
| ----------------------------- | ----------------------------------------------------------- |
| **Caution**                   | Verbal reminder, not formally tracked                       |
| **Warning**                   | Recorded, visible for 18 months                             |
| **Standings Adjustment** (SA) | A **−1 VP** penalty applied to a specific round             |
| **Disqualification** (DQ)     | Removed from the event; blocks future check-in until lifted |

**Suspension**, **probation** and **ban** are membership-level: the **Ethics Committee** issues them from the profile page, not you from a tournament. They are always visible and block check-in everywhere.

### Categories and subcategories

| Category                    | Subcategories                                                                                                                                                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Procedural Error**        | Game Rule Violation · Failure to Maintain Game State · Missed Mandatory Effect · Card Access Error                                                                                                                                                   |
| **Tournament Error**        | Illegal Decklist · Illegal Main Deck (Legal Decklist) · Illegal Main Deck (No Decklist) · Outside Assistance · Slow Play · Limited Procedure Violation · Public Info Miscommunication · Obscuring Game State · Marked Cards · Insufficient Shuffling |
| **Unsportsmanlike Conduct** | Minor · Major · Aggressive Behaviour · Stalling · Bribery and Wagering · Collusion · Cheating · Fraud · Theft of Tournament Material · Health and Safety Disruption · Rage Quitting · Failure to Play to Win                                         |

Every subcategory has a **baseline penalty**, which Archon shows you when you select it: it is the Judges Guide starting point, not a mandate.

### Escalation

If the player already has sanctions in the same subcategory, Archon shows an **escalation hint** ("N prior offences of this type — suggested level: …"), computed by walking the ladder up from the baseline. Choosing a level **below** the suggestion raises a **downgrade warning**: you can still proceed.

> [!IMPORTANT]
> **Always fill in the subcategory.** A sanction with a blank subcategory is invisible to escalation tracking: the next judge who meets that player will not see the precedent. Archon tells you so explicitly when prior sanctions exist in the category.

The app does **not** enforce the guidelines: the call is the head judge's. That said, judges should not deviate without the head judge's approval, and the head judge should be cautious about deviating. The full normative reference is the [Judges Guide](https://archon.vekn.net/help/judges-guide) inside Archon.

### Who sees what

- **Caution** — private to this tournament. It never appears on the player's profile or in other events (IC/Ethics aside).
- **Warning, SA, Disqualification** — visible on the player's profile and to organizers of their other tournaments for **18 months**: that is how repeat offences surface across events.
- **Suspensions and bans** — always visible.

Those rules are a **display filter**: records sync to every member's device, and IC and Ethics see every level everywhere. Write your reasons assuming someone else will read them in six months.

### How a Standings Adjustment actually works

When issuing an SA you pick **the round** it applies to (by default the player's current or most recent game, finals included). The −1 VP is deducted from their adjusted VPs for that round.

- If their raw VPs in that round are **below 1.0**, the difference (1.0 − raw VPs) carries over as a deduction from their total standings VPs.
- The SA **does not modify the stored scores**: it affects the GW and TP computation. A player who would have earned a GW may lose it after the adjustment.
- If the player has not played a round yet, an SA cannot be applied.

### Lifting and deleting

- **Lift** — removes the effect of a disqualification so the player can check in again. The record stays.
- **Delete** — removes the sanction entirely. As an organizer you can only delete sanctions issued **in your own event**, and only while it is not Finished. It exists to fix a mistake: delete and reissue, there is no in-place edit. IC and Ethics can delete any sanction.

> [!IMPORTANT]
> **Disqualification ≠ Drop.** To remove someone for disciplinary reasons use **Disqualification**, not the _Drop_ button. A drop is neutral (the player leaves, logistics); a disqualification stays in the VEKN history, blocks check-in and — in [leagues](/en/guides/archon-italia/#7-leagues) — extends to **every other tournament in the same series**. Confusing them devalues both.

If you disqualify a currently seated player: **remove them from the table first**, then close the table with an **Override**. Scores already recorded stay. If they were in the top 5, the 6th player moves up.

## 3. Intervening during a round

The **Rounds** tab shows every table and its state.

**Override** is the tool for closing a table on a judge's decision: a player leaving mid-game with no VPs awarded, time running out on an unresolved situation, a mid-round disqualification. It requires a **mandatory comment** explaining the decision and **locks players out of scoring** — from then on only organizers can touch that table. **Remove override** undoes it if the situation changes.

Worth remembering about scoring:

- player VPs are validated by simulating the **oust order**: impossible distributions are rejected. A _valid but wrong_ score passes — that one is yours to fix;
- as an organizer you can **force any value**; if the numbers do not add up the table goes **Invalid**;
- standings only recompute on **Finish Round**.

**Judge calls**: the **Call Judge** button on a player's device (or `/judge` on the Discord bot) raises an amber banner at the top of your screen with a sound, the table number and the player's name. It persists for 2 minutes or until you dismiss it; multiple calls stack. There is a 30-second per-player cooldown.

> [!TIP]
> At online events the call is the only way they can reach you: join the table's voice channel and **have the caller describe the situation**, because you cannot see the table state.

### Drops and absences

- **Drop** marks the player as **Completed**. Both they and you can trigger it.
- **Check out** moves a player from checked-in back to registered: that is the temporary absence, and they can check in again next round.
- **Remove Player** is for someone who has **not played** any round yet; if they have, use **Drop**, which keeps their scores and excludes them from future seatings.

## 4. Decklists

The visibility lifecycle changed, and it matters:

- **before the first round starts**, organizers **cannot see** deck contents; players can upload, edit and delete freely;
- **once a round starts** you can see and edit every deck, and single-deck players can no longer touch theirs (in multideck events they can still upload the next round's);
- **after the tournament finishes** players can upload and fix again — the winner needs this to complete a TWDA submission.

If the organizer enabled **Decklist Required**, a player without a deck gets a warning badge but is **not blocked from checking in**: it is a flag, not a gate. On the **Players** tab the deck filter shows you who has a missing or problematic list; from there you decide whether to issue a **Tournament Error** and at what level.

> [!NOTE]
> **Legality checking is automatic.** Archon validates the deck on upload and reports errors (illegal deck) and warnings (e.g. non-V5 cards in a V5 event). Your job is not to recount cards: it is to decide what to do when the flag appears.

## 5. Offline mode

If the organizer put the tournament into **offline mode**, the event is **locked to their device**: nobody else can change it, and players see frozen data. If you need to act, either work on their device or wait until they go back online.

**Take over** transfers the lock to another organizer who is a VEKN official (Prince, NC, IC) when the original device is unavailable — flat battery, phone left at home. Careful: unsynced changes on that device may be lost. Use it as a last resort, not a shortcut.

## 6. Coordinating with the organizer

- **Brief before check-in**: format, proxies allowed or not, decklist required, who is head judge, who enters scores.
- **Agree on who overrides**: an override is tracked with the comment of whoever issued it; better that one person does it, for consistency.
- **Announcements**: if the event needs them (table calls, timings), use them — they appear on everyone's page and at online events they are the only reliable channel.
- **End of tournament**: hand the organizer the list of sanctions with context, so they can inform the National Coordinator if it matters.

> [!TIP]
> For table calls, open the rule on your phone even if you know it by heart: the [VTES Comprehensive Rules](https://archon.vekn.net/help/rules) and [Tournament Rules](https://archon.vekn.net/help/tournament-rules) are inside Archon, offline included. Players take a ruling far better when they see you check the source.

## 7. Reporting problems

For app bugs and suggestions use **Send feedback** on Archon's **Help** page, Feedback section: it opens a GitHub issue. For rules questions, the right channel is still the community judges group or your National Coordinator.

## References

- [Judges Guide](https://archon.vekn.net/help/judges-guide) — the official penalty table and procedures, inside Archon.
- [Code of Ethics](https://archon.vekn.net/help/code-of-ethics) — the Ethics Committee's remit.
- [Tournament Rules](https://archon.vekn.net/help/tournament-rules) and [VEKN Tournament Rules](https://www.vekn.net/tournament-rules).
- [Organizer Guide](https://archon.vekn.net/help/organizer-guide) — console, rounds, finals, wrap-up.
- [Archon Online: notes for the Italian scene](/en/guides/archon-italia/) — translation traps and local practice.
