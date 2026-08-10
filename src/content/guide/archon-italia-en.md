---
title: 'Archon Online: notes for the Italian scene'
description: "What the official guides don't say: translation traps, common cases at the registration desk, venues with no signal, leagues and reports."
categoria: piattaforme
audience: [giocatore, principe]
ordine: 10
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-judge-en, demo-eventi-en]
locale: en
---

[Archon Online](https://archon.vekn.net) is the official VEKN platform for **Vampire: The Eternal Struggle** tournaments. Since the 2026 rewrite it ships **complete official documentation, translated into Italian and other languages**, inside the app itself — there is no point in us copying it out.

This page collects the rest: what the official documentation does not say or says confusingly, and the cases that keep coming up at our events.

## 1. The official documentation

From Archon's **Help** menu:

| Document                                                          | What it covers                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Player Guide](https://archon.vekn.net/help/player-guide)         | Account, registration, decklists, check-in, scoring, ratings       |
| [Organizer Guide](https://archon.vekn.net/help/organizer-guide)   | Event creation, console, rounds, finals, leagues, offline, Discord |
| [Tournament Rules](https://archon.vekn.net/help/tournament-rules) | The VEKN tournament rules                                          |
| [VTES Comprehensive Rules](https://archon.vekn.net/help/rules)    | The game rules                                                     |
| [Code of Ethics](https://archon.vekn.net/help/code-of-ethics)     | The Ethics Committee's remit                                       |

They are readable **offline** once the app has been opened: handy on site when you need to check a rule at a table.

> [!TIP]
> Language is set from **Profile → Language**. The translations are complete and apply everywhere instantly.

> [!IMPORTANT]
> **The official Judges Guide exists only in English and Spanish.** That is the one remaining gap, and the reason we keep [Archon Online for Judges](/en/guides/archon-judge/): sanction levels, infraction categories, escalation and overrides.

## 2. Translation traps

The most frequent stumble, because the interface translation and the in-app guide **do not use the same words**.

- **Registered ≠ Checked in.** A player is **Registered** once they sign up for the tournament and **Checked in** once they show up. In Italian these read _Iscritto_ and _Registrato_, which sound nearly identical and get mixed up constantly.
- The same applies to tournament states: **Registration** means sign-ups are open, **Check-in** is the roll-call phase. Between rounds the tournament goes back to **Check-in**, not to sign-ups.
- **Sanctions have two sets of names.** The interface says **Caution** and **Warning**; the in-app Player Guide calls them "verbal warning" and "warning". They are the same two things. When in doubt: the one that stays on the profile for 18 months is the Warning.
- **Player states.** Whoever misses check-in, or drops, ends up **Completed**; a withdrawn player shows **Dropped**. The in-app guide calls them "Finished" and "Dropped", and "Finished" is not a label the app shows.

## 3. Where the app does more than the guide says

Three features are documented as online-only but are not:

- **Timer** — the guide and the setting both label it "online only", but the countdown appears in **any** tournament you set a **round time** for, per-table extensions included. It works fine in person.
- **Call Judge** — it does not depend on the tournament being marked Online: the button is there whenever the player's device has connectivity and the tournament is not in offline mode. In a large room it beats raising your hand.
- **Announcements** — available from check-in onwards, in person too. "Round 2 in 10 minutes" lands on everyone's phone.

## 4. Before the tournament (for Princes)

- **Create the event on Archon, not on `vekn.net`.** It reaches the VEKN calendar by itself. Creating it in both places produces a duplicate that is painful to untangle: if it happens, tell your National Coordinator straight away.
- **Mind the fields that lock immediately.** Format, rank, start time, proxies, round count and open rounds freeze the moment the event hits the calendar — which is when you create it. This is the expensive mistake: the only fix is deleting and recreating the event.
- **Only Princes, NCs and ICs can create tournaments.** Anyone can no longer spin up a Demo or unsanctioned event: if you are running a demo, have a Prince create it (see [Running a V:TES demo](/en/guides/demo-eventi/)).
- **Judges are co-organizers.** There is no per-tournament judge role: add them from **Tools → Organizers** and they get your powers.
- **The banner matters.** Upload one from **Tools → Set up** (1200 × 630): it is the link preview when you paste the event into WhatsApp or Discord, and without it the link reads as spam.
- The VEKN requirement to **announce the event at least 28 days ahead**, with date, time and place, still stands.

## 5. At the registration desk

The cases that come up at every event:

- **Player with no VEKN ID.** Find them under **Community → Members** and press **Sponsor**: it creates their number on the spot. You need to be a VEKN official, so do it yourself at the desk.
- **Walk-ins.** No need to register them first: checking in someone who never registered **signs them up and checks them in at once**.
- **Latecomers.** Check-in never closes: you can check someone in mid-round. They become _present but unseated_, and you decide whether to slot them into a table with room (**Seat a player**) or hold them for the next round.
- **Whoever misses check-in is dropped automatically** when the round starts — but it is reversible: if they turn up, check them in again.
- **Decklist Required blocks nobody.** A player without one gets a warning badge, nothing more: what to do about it is a judge's call.
- **Payment is just a reminder.** The Pending/Paid badge prevents nothing.

## 6. Venues with no signal

The shop basement with no coverage is the typical case here, and offline mode covers it well — provided you prepare:

1. **At home, on the network**: open the tournament page, press **Go offline**, close the app. On site, reopen it and everything runs from local data.
2. It is restricted to organizers who are **VEKN officials** (Prince, NC, IC), because offline mode can create new members on the spot.
3. The tournament stays **locked to your device**: nobody else can change it.

> [!WARNING]
> While you are offline, players **see nothing current** on their phones: tables, scores and standings stay frozen. Say so out loud at the start and **print the seating** (**Rounds → Print the seating**), or you will spend the day answering questions.

If the organizer's device dies, another organizer who is a VEKN official can **Take over** — but unsynced changes on that device are lost. It is a last resort, not a shortcut.

## 7. Leagues

A **league** groups a series of tournaments into single standings. What is worth knowing before opening one:

- **Only NCs and ICs can create them.** If you are a Prince, ask your National Coordinator: they can create it and add you as an organizer, or mark it **open to country Princes** — the right option for a national circuit spanning many cities, since everyone then links their own tournaments.
- **Pick the mode by what you want to incentivise:**
  - **Rating Points (RTP)**, the default, sums each leg's rating points **including finals**, with no best-8 or 18-month cap. It lines the table up with the global VEKN ranking.
  - **GW/VP/TP** sums preliminary rounds only: it rewards turning up and playing, great for keeping small legs alive, but winning a final adds nothing.
  - **Grand Prix** awards fixed position points (Winner 25, other finalists 15, then down the table): it rewards winning big events, weak on small ones.
- **Drop rules and custom tie-breaks do not exist.** If your ruleset says "best 4 of 6", compute the official standings separately and publish Archon's raw table as well, so everyone can check their leg-by-leg points. And write the rule in the description **before** the first leg.
- **A disqualification propagates.** A DQ at one leg blocks check-in at **every other leg of the same league** until an organizer lifts it. Account for it in your ruleset.

## 8. After the tournament

- **The VEKN push is automatic** on finish. The "results not yet reported to vekn.net" badge is normal: it retries in the background. If it sticks, **Tools → Wrap up → Report results to VEKN** forces it.
- **Wrong scores?** **Tools → Wrap up → Reopen Tournament**, fix, finish again. Ratings recompute. Disqualifications stay.
- **For the community channel**: **Tools → Wrap up → Copy results** puts the standings and the winner's deck on the clipboard as Markdown, ready to paste into Discord.
- **For the archive**: **Download a copy of the event** (JSON). The VEKN rules require keeping the report for at least a year.
- **Forum report**: post it in [Event Reports and TWD](https://www.vekn.net/forum/event-reports-and-twd) with the `archon.vekn.net/tournaments/<uid>` link.
- If you issued **significant sanctions**, let your National Coordinator know.

## 9. Reporting problems

For Archon bugs and suggestions: the **Help** page → Feedback section → **Send feedback**, which opens a GitHub issue. Link your GitHub account from your profile to follow the discussion.

If something looks wrong but you are not sure it is a bug, ask on the Italian community channels or your National Coordinator first: it is often a new feature.

For mistakes or gaps **on this page**, use the report link at the bottom.
