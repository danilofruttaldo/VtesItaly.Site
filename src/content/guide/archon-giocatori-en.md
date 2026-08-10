---
title: 'Archon Online for players'
description: 'Create your account, register for a tournament, upload your decklist, check in and read the standings.'
categoria: piattaforme
audience: [giocatore]
ordine: 10
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-principi-en, archon-judge-en, archon-leghe-en]
locale: en
---

[Archon Online](https://archon.vekn.net) is the official VEKN web platform for **Vampire: The Eternal Struggle** tournaments: registration, decklists, check-in, scores, standings and ratings. This guide covers the _player_ side. For the organizing side see [Archon Online for Princes](/en/guides/archon-principi/).

> [!IMPORTANT]
> **Archon has been rewritten from scratch.** The interface is new, it is **translated into several languages** (including Italian) and it installs as an app on your phone. If you already had an account, it still works — things have just moved. The old `.../tournament/<uid>/display.html` URLs are gone: it is now `archon.vekn.net/tournaments/<uid>`.

## 1. Creating your account

Go to [archon.vekn.net](https://archon.vekn.net) → **Login**. There are two tabs at the top: **Login** and **Sign Up**.

Pick **Sign Up**, tick the consent box (every method stays disabled until you do) and choose one of:

- **Passkey** — fastest and most secure, recommended. Uses your device's fingerprint, face or PIN. No password to remember.
- **Discord** — one tap, and the VEKN Discord bot will recognise you at online events.
- **Email** — you get a magic link, click it and set a password.

You are not locked into one: from **Profile → Linked Accounts** you can add more at any time. That is also how you **merge** two separate logins into one profile.

### Linking your VEKN ID

To play official tournaments you need a **VEKN ID** linked to your account.

- **You already have one** → **Profile → Claim VEKN ID**, enter the number. Your tournament history reattaches to the new account.
- **You never had one** → you need to be **sponsored** by a VEKN official: your National Coordinator, a local Prince, or the organizer at the registration desk. They find you on the **Community → Members** page and press **Sponsor**. A new number is created for you.

If you claimed the wrong number, the unlink icon next to your VEKN ID in your profile detaches it without losing your history.

## 2. Setting up the app

From the **Profile** page:

- **Language** — English, French, Spanish, Portuguese and Italian. Applies everywhere immediately.
- **Theme** — Auto, Light or Dark.
- **Push notifications** — enable them to be alerted about round starts and judge calls even when the app is closed.
- **Avatar** — your profile picture, visible in standings.
- **Resync** — if anything looks stale, re-download your data from the server.

> [!TIP]
> **Install the app.** Archon is a Progressive Web App: on iPhone _Share → Add to Home Screen_, on Android _⋮ → Install app_, on desktop the install icon in the address bar. It opens faster on site and keeps working if the connection drops.

## 3. Finding tournaments

The **Tournaments** page has two views: **Your Agenda** (tournaments you are registered for or organizing) and **All Tournaments**. Search by name and narrow by country, format, upcoming or finished, and use **Include Online** to show or hide online events.

Below the filters is the **calendar feed**: from **Your Agenda** press **Generate link** once, then either **Open in calendar app** or **Copy link** — tournament dates land in your phone's calendar and keep themselves up to date.

## 4. Registering

When the organizer opens registration, a **Register** button appears on the tournament page. Press it: your status becomes **Registered**.

- To withdraw before check-in opens: **Unregister**. After that, only the organizer can remove you.
- If the event has a **registration cap** and is already full you can still register: you just get a warning that the venue may be full. Check with the organizer before travelling.

> [!WARNING]
> **Registering is not checking in.** They are two separate steps. Before the first round the organizer opens a check-in phase: if you skip it, you are marked as dropped for that round. See [Checking in](#6-checking-in).

## 5. Uploading your decklist

On the tournament page, scroll to **Your Deck**. Three methods:

- **From URL** — paste a link from [VDB](https://vdb.im), [VTESDecks](https://vtesdecks.com) or [Amaranth](https://amaranth.vtes.co.nz).
- **Paste Deck** — paste the decklist text directly.
- **Scan QR** — point your camera at a VDB deck QR code.

The deck name is optional. **Attribution** is a choice between **Your deck**, **Anonymous** and **Other**: it decides how the list is published in the archives.

The deck is **validated immediately**: you see errors (illegal deck) and warnings (e.g. non-V5 cards in a V5 event) straight away.

**When you can change it:**

| Moment                                | What you can do                                                   |
| ------------------------------------- | ----------------------------------------------------------------- |
| Before the tournament starts          | Replace or delete freely                                          |
| During the tournament (single deck)   | Locked: the deck closes when a round starts                       |
| During the tournament (**multideck**) | Each round has its own slot; you can upload the next round's deck |
| After the tournament                  | If you never submitted one, you still can (useful for the TWDA)   |

> [!TIP]
> If the organizer enabled **Decklist Required**, you see a warning badge until you upload. Do it **before check-in** to avoid a potential warning from the judges.

## 6. Checking in

Before each round the organizer opens **check-in**: it establishes who is actually there.

- **In person**: point your camera at the organizer's **QR code** and you are checked in instantly. Alternatively the organizer checks you in from their player list.
- **Online**: there is **no QR code**. Use the **Join** button on the tournament page to reach the server (usually Discord). If the event uses the Discord bot, check in there with `/checkin`; otherwise the organizer does it for you.

**How to tell whether you need to act**: look at your status on the tournament page.

- You see **Scan QR to Check In** (or **Register and check in**, which does both) → you need to do something.
- Your status says **Checked in** → you are fine.
- Your status says **Completed** or **Dropped** and a new round has not started yet → look for the check-in button: the organizer may have reopened it.

Some organizers check everyone in **once** and keep them checked in between rounds; others **reopen check-in every round**. When in doubt: if there is a button, press it; if there isn't, you are already in.

> [!IMPORTANT]
> **If you do not check in before the round starts, you do not play**: you are marked as dropped. It is not final — if you arrive late the organizer can check you in at any time, even mid-round. Whether you join a table with a free seat or wait for the next round is their call: ask, and do not sit down until they tell you to.

An active **disqualification** or **suspension** blocks check-in, and the organizer cannot make exceptions.

## 7. During a round

Once the round starts, your **table card** appears near the top of the page: your table number and everyone seated, in seating order — your predator above you, your prey below. Your seat is highlighted. It all fits in one scroll; there are no tabs to hunt through.

**Reporting results**: at the end of the game, any player at the table can enter the VPs. There are 0–4 buttons on each player's row, plus **+½** for a half point. Once the scores add up, the table is marked finished.

- If the organizer or judge placed an **override** on your table, player scoring is locked: only they can change the results.
- **Call Judge** alerts the organizers that your table needs help. It is a real-time notification and does not interrupt your game. It works while your device is online and the event is not in offline mode; there is a 30-second cooldown between calls.

### Self-organizing a round

Some casual open-rounds events let players start their own rounds. If the organizer enabled it, once registered you see **Self-organize a round**: gather 3 or 4 other registered players, pick them from the list (you are included automatically), press **Start round** and the app seats your pod of 4–5. Play and report scores normally; the organizer finishes the round.

## 8. Standings, scoring and finals

The standings sit below your table. How much you see depends on the organizer's setting: **Private** (hidden during the event), **Cutoff** (shows only the score needed to reach the top 5), **Top 10**, or **Public**. Once the tournament finishes the full standings are always visible, and your row is highlighted above the table.

How the numbers work:

- **GW** (game win) — 1 if you have the highest VP at your table **and** at least 2.0 VP. If two players tie at the top, neither gets it.
- **VP** (victory points) — your raw victory points.
- **TP** (tournament points) — positional: 60 for first at the table, down to 12 for last. Ties average their positions.

**Finals**: the top 5 qualify by GW, then VP, then TP; ties are broken by a toss. Seating is decided with the VEKN card-draw procedure. In the finals there is **no 2.0 VP threshold**: the GW always goes to the highest VP, and a tie is won by the better seed.

**Decklists after the tournament**: they become public according to the organizer's setting — winner only, finalists, or all. Your own deck is always visible to you.

## 9. Ratings and rankings

After a finished tournament your **rating points (RtP)** are computed and shown on the **[Rankings](https://archon.vekn.net/rankings)** page. Ratings are tracked separately per category — Constructed, Constructed Online, Limited, Limited Online — and your total is based on your **best 8 tournaments over the last 18 months**.

Per tournament: 5 base RtP, +4 per VP, +8 per GW, plus a finalist bonus scaled to event size and placement. The **Hall of Fame** lists players with 5 or more tournament wins.

## 10. Sanctions

If you receive a sanction during a tournament, it appears as a badge next to your name. The levels:

| Level                    | What it means                                                     |
| ------------------------ | ----------------------------------------------------------------- |
| **Caution**              | Verbal reminder, not formally tracked                             |
| **Warning**              | Recorded on your profile, visible for 18 months                   |
| **Standings Adjustment** | A −1 VP penalty applied to a specific round                       |
| **Disqualification**     | Removed from the event; blocks future check-in until it is lifted |

**Suspensions and bans** are not issued by tournament organizers: they are the **VEKN Ethics Committee's** remit. The full infraction detail is in the [Judges Guide](https://archon.vekn.net/help/judges-guide) inside Archon.

## 11. Leagues

A **league** groups a series of tournaments into a single standings: a regional circuit, a season, a grand prix. Find them on the **Leagues** page; open one to see its description, the tournaments that count for it, and the combined standings.

You do not need to do anything to take part: you are counted automatically as soon as you play a linked tournament. How the standings are computed (rating points, raw GW/VP/TP, or position points) is the league organizer's choice and is shown on the page.

> [!NOTE]
> A **disqualification** in one league tournament blocks check-in at **every other tournament in the same league**, until an organizer lifts it.

## 12. Offline mode

If the organizer switches the tournament to **offline mode** (venues with no reliable connection), a notice appears on your page: the event is being run on their device.

While that lasts, **what you see in the app may be stale or incomplete**: table assignments, scores and standings are not current. Follow the organizer's spoken instructions and the printed sheets in the room. As soon as they go back online everything syncs by itself.

## 13. Reporting problems

For bugs and suggestions use **Send feedback** on the **Help** page, Feedback section: it opens a GitHub issue. Link your GitHub account from your profile to follow the discussion.

## References

- [Player Guide](https://archon.vekn.net/help/player-guide) — the official in-app documentation, more detailed than this page.
- [VTES Comprehensive Rules](https://archon.vekn.net/help/rules) and [Tournament Rules](https://archon.vekn.net/help/tournament-rules) — readable from your phone, inside Archon.
- [Archon Online for Princes](/en/guides/archon-principi/) — if you end up organizing.
