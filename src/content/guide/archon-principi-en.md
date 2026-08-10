---
title: 'Archon Online for Princes'
description: 'Create an event, manage check-in, rounds, finals and reports on the official VEKN platform.'
categoria: organizzare
audience: [principe]
ordine: 10
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-giocatori-en, archon-judge-en, archon-leghe-en]
locale: en
---

[Archon Online](https://archon.vekn.net) is the official VEKN platform for managing **Vampire: The Eternal Struggle** tournaments. This guide covers the _organizer_ side: creating the event, running the tournament cycle, the finals, closing and reporting. For the _player_ side see [Archon Online for players](/en/guides/archon-giocatori/); for sanctions and table work see [Archon Online for Judges](/en/guides/archon-judge/); for tournament series see [Archon Online: Leagues](/en/guides/archon-leghe/).

> [!IMPORTANT]
> **Archon has been rewritten from scratch.** If you used the previous version, almost everything you knew about the UI has changed: there is no separate _Tournament Manager_ page, the interface is **translated into Italian** (and other languages), and — most importantly — **events are now created on Archon**, not on `vekn.net`. See [What changed](#what-changed).

## What changed

| Before                                                   | Now                                                                                 |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Event created on `vekn.net`, then managed from Archon    | Event created **on Archon**, published to the VEKN calendar automatically           |
| URL `/tournament/<uid>/display.html`                     | URL `/tournaments/<uid>` (imported tournaments got new uids)                        |
| A separate _Tournament Manager_ page                     | A **console** on the tournament page itself, visible only if you are an organizer   |
| _Info / Registration / Round_ tabs                       | **Action bar** + _Set up / Players / Rounds / Finals_ tabs + a **Tools** drawer     |
| English-only interface                                   | Interface in **EN/FR/ES/PT/IT**, set from your profile                              |
| `CAUTION` / `WARNING` / `GAME_LOSS` / `DISQUALIFICATION` | Caution / Warning / **Standings Adjustment** / Disqualification (no more game loss) |
| Results pushed to VEKN by hand                           | Automatic push on finish, retried in the background                                 |

Archon now also ships **official in-app documentation**, under **Help** in the menu: [Organizer Guide](https://archon.vekn.net/help/organizer-guide), [Player Guide](https://archon.vekn.net/help/player-guide), [Tournament Rules](https://archon.vekn.net/help/tournament-rules) and [Code of Ethics](https://archon.vekn.net/help/code-of-ethics). This guide does not replace it: it summarises it and adds the Italian-scene practice on top.

## 1. Before you start

- **Who can create tournaments**: only **Princes**, **National Coordinators (NC)** and **Inner Circle (IC)**. If you are not a Prince yet, contact your NC. Reference: [How to run a V:TES tournament](https://www.vekn.net/how-to-run-a-v-tes-tournament).
- **Account**: passkey, Discord or email/password — all equivalent. You can link several to the same profile from **Profile → Linked Accounts**.
- **Install the app**: Archon is a PWA. Install it on your phone (iOS: _Share → Add to Home Screen_; Android: _⋮ → Install app_) — you need it for [offline mode](#10-offline-mode).

> [!NOTE]
> **Two words that look alike.** A player is **Registered** once they sign up for the tournament, and **Checked in** once they show up. In the Italian UI these read _Iscritto_ and _Registrato_, which trips people up at the door.

## 2. Creating the event

Go to **Tournaments** and press **+ New Tournament**. The form has the same sections you will find later under **Tools → Settings**:

- **Basics** — Name, **Format** (Standard, V5, Limited), **Rank** (Basic, National Championship, Continental Championship), an optional **League**, date/time and timezone.
- **Venue** — country, venue name and URL, address, map link; or tick **Online Tournament**. Table rooms for multi-room venues are at the bottom of this section.
- **Rounds & timer** — **Number of rounds** (2, 3 or 4 for events that go on the VEKN calendar), an optional **Registration cap**, round and finals timers (online only).
- **Visibility** — **Standings Visibility** (Private / Cutoff Top 5 / Top 10 / Public) and **Decklists Visibility** (Winner only / Finalists / All).
- **Description** — optional, Markdown.

> [!WARNING]
> **Some fields lock immediately.** The VEKN calendar entry is written once and cannot be corrected from here, so **format**, **rank**, **start time**, **proxies**, **round count** and **open rounds** lock the moment the event reaches the calendar — which, in practice, is when you create it. Get them right **in the creation form**.

Useful constraints: **National and Continental Championships** allow neither multideck nor proxies, and **V5 events cannot be championships** (the VEKN calendar has no such type).

### VEKN calendar

Your event is published to the VEKN calendar **automatically** on creation — nothing to do. If it never shows up, **Tools → Set up → Add to the VEKN calendar** publishes it on demand (that row only appears while the event is missing).

> [!IMPORTANT]
> **Do not create the event in two places.** Create it on `vekn.net` and it syncs into Archon; create it on Archon and it lands on the calendar. Doing both produces duplicates that are painful to untangle. Pick one — for Italian events, create it **on Archon** — and tell your NC if you spot a duplicate.

The [VEKN rules](https://www.vekn.net/tournament-rules) still apply: request the sanction and announce the event at least **28 days** in advance, stating date, time and place; keep a copy of the report for at least **1 year**.

### Banner

**Tools → Set up → Add banner** uploads the cover image (**1200 × 630** recommended). It shows at the top of the tournament page and is the preview card whenever the link is shared on WhatsApp, Discord or social feeds. Keep the important artwork inside the safe area shown in the cropper: mobile previews crop to a square.

## 3. Finding your way around the console

When you open one of your tournaments as an organizer, the page becomes a **console**. There is no separate screen: it is the same URL players see, with the controls added.

- Under the title, a row of buttons: **Share**, **Go offline**, **Tools**.
- The **action bar** tells you where the event stands and offers **the one action of the moment**: _Open Registration_, _Start Check-in_, _Start Round 2_, _Finish Round_, _Start Finals_, _Finish Finals_. Rarer actions for the same moment sit next to it or one tap into **More**. As you scroll to the tables, that action follows you as a pinned bottom bar.
- The **tabs** are the workspace: **Players** always, **Set up** before the event, **Rounds** as soon as a round exists, **Finals** when the finals are within reach.
- **Tools** is the drawer for everything that is _not_ the current action, grouped into **Set up**, **At the door**, **Wrap up** — the order an event happens in. The group matching the current state is already open.

Tournament states, shown by the badge next to the title: **Planned** → **Registration** → **Check-in** → **Playing** → **Finished**. Between rounds the tournament goes back to **Check-in**.

## 4. Registration

Press **Open Registration**: players can now sign themselves up from the tournament page.

- **Sign-ups collected elsewhere** — **Tools → Set up → Import registrations (CSV)** loads a whole list in one go.
- **Registration cap** — a _soft_ limit: registrations past it are never blocked, you just get a warning. It is there to help you size the venue.
- **Walk-in events** — you can skip advance registration entirely: checking in a player who never registered signs them up and checks them in at once.
- **Payments** — on the **Players** tab each player shows **Pending** or **Paid**; tapping the badge toggles it. **Mark all paid** is under **More**. It is informational only and blocks nothing.

> [!TIP]
> Every player should have their **VEKN ID linked** before the tournament finishes, otherwise results cannot be reported to VEKN. Players who have one can claim it from their profile; players who never had one need to be **sponsored** by an official (you, if you are a Prince) from the **Community → Members** page.

## 5. Check-in

**Start Check-in** opens the phase that establishes who is actually present. It is the step that prevents the most common failure: starting a round with someone missing.

Methods:

- **QR code** (in-person events only) — before the first round the action bar offers **Show check-in QR code**; at any other time it is under **Tools → At the door**. Players scan it and check themselves in.
- **Manual** — from the **Players** tab. Until the first round starts, player cards are already expanded with check-in, payment and deck within reach: that is _door mode_.
- **Check In All** — checks in every remaining registered player at once.
- **Check out** — moves a single player back from checked-in to registered.
- **Reset Check-In** — moves _everyone_ back between rounds. Online events get it as its own button (silent disconnections are common); in-person events find it under **More**.
- **Reopen Registration** — if you opened check-in too early, go back to sign-ups.

Worth knowing:

- **Check-in never closes.** You can check someone in while a round is already **Playing**; checking in a player who never registered registers them on the spot.
- **Whoever is not checked in is dropped automatically** when the round starts (set to **Completed**). The action bar names them _beforehand_, and it is reversible: if they turn up late, check them in again.
- Checking someone in **does not seat them**: they are _present but unseated_, and the action bar flags it. You can seat them right away with **Seat a player** (**Rounds** tab) at a table with room, or hold them for the next round — your call.
- **An active disqualification or suspension blocks check-in**, even when you do it.
- If **Decklist Required** is on, a player without a deck gets a warning badge — but is **not** blocked.

**Between rounds** check-in state persists. For back-to-back rounds in one day you usually leave it alone; for lunch breaks, multi-day events and online tournaments, **Reset Check-In** and take the roll call again.

## 6. Rounds and seating

**Start Round** seats players with the VEKN seating algorithm, which optimises 9 rules (R1–R9) in strict priority order: R1 (repeated predator-prey) and R2 (opponent in every round) are hard constraints, the rest cover fairness of VPs, seats and relative positions. Archon rates the seating **Perfect**, **OK** or **Invalid**, with a breakdown of which rules had to be compromised.

Requirements: at least **4 checked-in players**, and the configured round count not yet exhausted.

> [!NOTE]
> **Staggered seating.** For player counts that do not divide into tables of 4–5 (6, 7, 11), Archon adds extra rounds and rotates who sits out, prioritising players with the fewest games. It is automatic.

From the **Rounds** tab:

- **Alter seating** — tap a player, then another seat to swap them, or an empty seat to move them there. The **Table** button adds an empty table.
- **Seat a player** — under each table, lists everyone present but unseated.
- **Remove player from table** / **Remove empty table**.
- **Print the seating** — a sheet to pin up in the room. Essential above 30 players and in venues with no signal.

> [!WARNING]
> Moving a player to a **different table clears their score**; moving them within the **same table** keeps it. The editor rejects changes that would recreate a predator-prey pair already played (R1 violation).

### Scoring

The normal flow is **player self-reporting**: at the end of the game each player enters their own VPs from their device and you watch for problems. At small events you may enter them all yourself.

- VPs go in 0.5 increments and are **validated by simulating the oust order**: impossible distributions are rejected. A table's total must equal the number of players at it.
- A player earns a **Game Win** with **at least 2.0 VP** and **strictly the highest** score at the table. A tie at the top gives nobody the GW.
- **Tournament Points** are positional: 60/48/36/24/12 at a 5-player table, 60/48/24/12 at a 4-player table (the missing 36 is the "table bye"). Ties average their positions.
- Standings order: **GW > VP > TP**.
- **Override** closes a table on a judge's decision (someone leaves mid-game, time runs out on an unresolved situation): it requires a **mandatory comment** and locks players out of scoring. **Remove override** undoes it.

**Finish Round** becomes the primary action once every table is finished or overridden. Standings only update **at the end of a round**.

**Cancel Round** invalidates a round that went wrong. A non-last round is kept but excluded from standings (a **Cancelled** badge) and can be restored with **Restore Round**; **the last round is discarded for good**.

## 7. Finals

Before finals can start you must resolve any **ties in the top 5**: the toss controls appear on the **Players** tab as soon as a tie actually blocks the finals. Use **Random toss** (Archon draws) or **Edit toss** (enter the result of a physical roll by hand, in line with the rulebook's "fair random method").

**Start Finals** requires: the tournament in the **Check-in** state with the current round finished, at least **2 preliminary rounds** completed, at least **5 eligible players**, and no unresolved tie. Finalists are the top 5 by GW > VP > TP > toss; a disqualified player is skipped and the 6th moves up.

Once the finalists are picked, run the **VEKN seating procedure** ([Tournament Rules 3.1.3](https://archon.vekn.net/help/tournament-rules)): each finalist gets a name card, the judge reveals three random crypt cards for each of them, and — starting from the **lowest seed** — each in turn places their card at either end of the row or in a gap between two placed cards. Read the row **left to right** for the seating order and enter it in Archon; the judge then randomly determines who plays first.

- **Alter seating** on the **Finals** tab swaps two finalists (it must stay the same 5).
- **Cancel Finals** returns to the **Check-in** state if a finalist never shows up, so you can re-pick.
- **There is no 2.0 VP threshold in the finals**: the GW always goes to the highest VP, and a tie is resolved in favour of the better seed.

**Finish Finals** determines the winner, locks the results, computes ratings, applies decklist visibility, submits the winner's deck to the TWDA and reports to VEKN.

> [!NOTE]
> **You can also finish without finals** — league legs, or an event that simply ended after the preliminaries: **Tools → Wrap up → Finish Tournament**. Players still get base rating points; only the winner/runner-up bonus requires finals.

## 8. Wrap-up, reporting and sharing

- **VEKN push**: automatic on finish. While a sync is pending you will see a "results not yet reported to vekn.net" badge — that is normal, it retries in the background. To force it: **Tools → Wrap up → Report results to VEKN**.
- **Wrong results?** **Tools → Wrap up → Reopen Tournament** puts the event back into the **Check-in** state: fix and finish again, ratings recompute. Disqualifications stay.
- **Share** (the row under the title) hands the link to your phone's share sheet, with a social card generated from your banner.
- **Tools → Wrap up** adds, once standings exist: **Copy results** (standings as Markdown plus the winner's deck, ready to paste into Discord) and **Download a copy of the event** (full JSON for your archive). The **Players** tab also has **Print the standings**.
- **Promo cards** — if you handed promos out, record them in **Tools → Wrap up → Promo cards handed out**: it keeps the officials' promo stock honest. Not required to finish.

### Italian practice

On top of what Archon does, for Italian events:

- post the **report on the VEKN forum**, in [Event Reports and TWD](https://www.vekn.net/forum/event-reports-and-twd), including the `archon.vekn.net/tournaments/<uid>` link;
- share the Archon page link on the community channel (Discord/WhatsApp) — public standings are readable by anyone;
- if you issued significant sanctions, let your **National Coordinator** know.

## 9. Tools for larger events

- **Co-organizers** — **Tools → Organizers** (or the **Set up** tab before the event). Equal access, no hierarchy, removable at any time; IC members have it on every tournament by default. This is how you empower **judges**: Archon has no separate per-tournament judge role.
- **Announcements** — from check-in onwards, just above the console: up to 280 characters, shown as a banner on everyone's page. "Round 2 in 10 minutes", "lunch until 2pm".
- **Timer** — Start / Pause / Reset, synced in real time. Archon presents it as an online-event tool, but it appears in any tournament you set a **round time** for, with **per-table extensions** (+1/+2/+5/+10 minutes, up to 30) for tables legitimately stopped by a judge call.
- **Table rooms** — room names for table ranges; assignments show next to table numbers in the seating.
- **Raffle** — **Tools → Wrap up → Raffle**, available from the first round on. Filter the pool (all, non-finalists, game winners, no VP…), choose how many winners and whether to **exclude previous winners**. Draws appear on everyone's page.
- **Proxy players** — someone filling a seat without competing (typically an official standing in for an absentee on a random deck): toggle **Proxy** on their card. Their VPs count for their opponents, but they are excluded from standings, ratings and finals. This is **different** from the **Allow Proxies** setting, which is about proxy _cards_ in decklists.
- **Import legacy Excel** — **Tools → Set up**, to migrate data from the old Archon `.xlsx` spreadsheets (not the same file as Archon's JSON export).

## 10. Offline mode

Built for venues with no reliable connection — the shop basement, the room with no signal.

1. Open the tournament page **while still online**, so all the data lands on the device.
2. Press **Go offline** in the row under the title (it lives there, not in Tools, because you will reach for it exactly when the line is already dropping). It is restricted to organizers who are VEKN officials — Prince, NC, IC — because offline mode can create new members on the spot.
3. The tournament is **locked to your device**: only that device can change it.

You can prepare at home: load the tournament, go offline, close the app; on site reopen it and it runs entirely off local data. Run it normally; with intermittent connectivity Archon saves a server backup every 30 seconds (a safety net, not a sync: others see the read-only backup state). **Go back online** reconciles everything — the server wins any conflict.

If the original device is unavailable (flat battery, left at home), another organizer who is a VEKN official can use **Take over** to claim the lock: unsynced changes on that device may be lost.

> [!TIP]
> While offline, players **see nothing current**: tables, scores and standings on their phones may be stale. Say so out loud at the start and pin up the printed seating.

## 11. Open Rounds, self-organized rounds, Discord

**Open Rounds** is a non-VEKN _house format_ for casual or multi-week events: each player plays up to **Max rounds per player** drawn from a common pool, and whoever hits the limit moves to **Completed** (still eligible for the finals). Finals are optional.

> [!WARNING]
> Open-rounds events are **not reported to VEKN and do not count toward rankings**. Use the standard format for sanctioned events.

On top of Open Rounds you can enable **Self-organized rounds** (**Tools → Settings → Rounds & timer**): registered players form their own 4–5 pod and Archon seats it, with no organizer present. Every self-organized table is marked **Organized by …**, and you still finish the rounds and can cancel or override them.

For **online events**, mark the tournament **Online** and put your Discord invite in the venue link: so players reach the server in one tap. The timer, players' **Call Judge** alerts and announcements do not depend on that flag: they work in person too. There is also a **Discord bot**: an organizer runs `/setup <tournament-url>` and the bot creates the tournament category with `#announcement`, `#lobby` and `#judges`, a voice channel per table and a scheduled event on the server. Players use `/register`, `/checkin`, `/report <vp>` and `/judge`; organizers `/announce`, `/sync` and `/teardown`. App and bot are two windows on the **same** tournament. The bot is **optional**: an online tournament runs entirely from the app.

## 12. Reporting problems

Archon is under active development. For bugs and suggestions use **Send feedback** on the **Help** page, Feedback section: it opens a GitHub issue. Link your GitHub account from your profile to follow the discussion and be mentioned in it.

If something looks wrong but you are not sure it is a bug, ask on the Italian community channel or your National Coordinator first: often it turns out to be a new feature rather than a defect.

## References

- [Organizer Guide](https://archon.vekn.net/help/organizer-guide) — the official in-app documentation.
- [Tournament Rules](https://archon.vekn.net/help/tournament-rules) and [Judges Guide](https://archon.vekn.net/help/judges-guide) — the normative reference inside Archon.
- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules) — official rules.
- [Archon Online for Judges](/en/guides/archon-judge/) and [Archon Online: Leagues](/en/guides/archon-leghe/).
