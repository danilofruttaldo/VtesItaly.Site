---
title: 'Archon Online: Leagues'
description: 'Create and manage a league on Archon: tournament series, RTP/GP/Score rankings, nested leagues (Meta-League).'
categoria: organizzare
audience: [principe]
ordine: 30
versione: '0.1'
aggiornato: 2026-05-18
correlate: [archon-principi-en, archon-giocatori-en, archon-judge-en]
locale: en
---

[Archon Online](https://archon.vekn.net) supports **leagues** since v0.51: a league is a **series of tournaments** bundled together that produces a single cumulative ranking. It is the default tool for European _online leagues_ (monthly or weekly sessions on Lackey/Discord) but it also works for local in-person seasons.

This guide covers the _organizer_ side. For the standalone tournament cycle see [Archon Online for Princes](/en/guides/archon-principi/); for the player perspective see [Archon Online for players](/en/guides/archon-giocatori/).

> [!NOTE]
> The league feature is recent (v0.51, November 2025) and evolving: some operational UI details change between releases. When this guide and the live UI disagree, **trust the UI** — open an issue on the [Archon repo](https://github.com/vtes-biased/archon) or flag it to your National Coordinator so we update the guide.

## 1. What a league is on Archon

A league is a **container of tournaments** with an aggregated ranking computed by Archon. The **Leagues** page describes it as _"Leagues are groups of tournaments"_. Key traits:

- **Three ranking algorithms** to choose from at creation: `RTP`, `GP`, `Score` (see [Scoring](#4-league-scoring)).
- **Two league types** (the _Type_ field): `League` (the league directly aggregates tournaments — the normal case) and `Meta-League` (the league aggregates other leagues — see [Meta-League](#5-meta-league-nested-leagues)).
- **Finals excluded** from the cumulative ranking (changelog v0.51, _"pure score ranking (finals excluded)"_): the league ranking rewards round-play performance, not the final outcome.

It is not a new game format: the individual tournaments inside the league remain standard VEKN tournaments (Constructed, V5, Limited, Draft) with their own states, decklists and finals. The league is a layer **above** the tournaments, not a replacement.

## 2. Creating a league

> [!IMPORTANT]
> As for tournaments (see [Recommended procedure](/en/guides/archon-principi/#2-creating-an-event)), until the _archon → vekn.net_ sync stabilizes **announce the league on the VEKN calendar** and manage it operationally on Archon. The VEKN **28-day advance notice** rule still applies.

From the **Leagues** page on Archon (visible to users with the organizer role) you get the <span class="archon-pill archon-pill--primary">Create League</span> button. The form asks for:

- **League name** — name of the league (e.g. _Italian Online League — Spring 2026_).
- **Format** — format of the league's tournaments: `Standard`, `V5`, `Limited`, `Draft`.
- **Ranking** — ranking algorithm: `RTP`, `GP`, `Score` (see [Scoring](#4-league-scoring)).
- **Type** — `League` (aggregates tournaments directly: this is the normal case) or `Meta-League` (aggregates other leagues: see [Meta-League](#5-meta-league-nested-leagues)).
- **Online** — toggle: makes the league filterable with the **Include Online** toggle on Archon.
- **Country** — reference country; for international leagues there is the _Worldwide 🌍_ option.
- **Parent League (Optional)** — if set, nests the league inside an existing Meta-League.
- **Start** / **Finish** / **Timezone** — start/end dates and timezone.
- **Description** — in [markdown](https://www.markdownguide.org/): use it for a short ruleset, calendar, tie-breaks, prizes.
- **Add Judge** — adds judges/organizers for the league.

To confirm use <span class="archon-pill archon-pill--primary">Submit</span>; <span class="archon-pill archon-pill--grey">Cancel</span> aborts.

> [!TIP]
> **Start date required, Finish optional.** The UI validates "A start date is required"; the Finish field is "Optional finish date/time". For leagues with a fixed calendar it is still good practice to fill Finish, so players know until when results count.

Once created the league is in "empty" state (zero contenders, zero tournaments). The next step is linking tournaments (or sub-leagues).

## 3. Adding tournaments to a league

Tournaments are not added from the league page itself. The in-app message is explicit:

> _"To add a tournament, set the league in the tournament info page."_

Procedure (league already created):

1. Create the tournament as usual (see [Creating an event](/en/guides/archon-principi/#2-creating-an-event) in the Princes guide if it is your first time).
2. Open the new tournament and click <span class="archon-pill archon-pill--yellow">Tournament Manager</span> → **Info** tab.
3. Set the **league** field to the league you created and save.

To add an **already-existing** tournament to a league, apply steps 2 and 3 on that tournament.

Best practices:

- Create **the league first**, then the tournaments: assigning the league at tournament creation time avoids the edit round-trip.
- Keep **Format and Ranking consistent** across the league's tournaments: changing format midway generates rankings that are hard to explain to players.
- For online leagues, enable the **Online tournament** flag on the individual events too, not only on the league.

> [!WARNING]
> **Events uploaded after the fact (historical archon Excel).** If you import historical results via archon Excel file, verify that the file correctly references the league: a tournament uploaded without the league link will not enter the cumulative. Coordinate with your National Coordinator before the bulk upload.

## 4. League scoring

Archon offers **three ranking algorithms** for the league standings, chosen at creation time via the **Ranking** field:

| Algorithm                          | When to use it                                                                                                                                                              |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Score` — _pure score_ cumulative  | Sums GW/VP/TP from the rounds of the linked tournaments. **Finals excluded**. It is the historical default (changelog v0.51).                                               |
| `RTP` — _Rating Tournament Points_ | Ranking weighted by VEKN tournament rating. Use it for long leagues where different weights (championship vs friendlies) make sense. Verify with your National Coordinator. |
| `GP` — _Grand Prix_ style          | Points awarded by position (1st/2nd/3rd), Grand Prix style. Use it for leagues where the per-stage placement matters more than the raw cumulative.                          |

> [!NOTE]
> The three options are exposed as the `Ranking` field, but the _exact computation_ lives in `archon/scoring.py`: choosing between RTP, GP and Score means choosing _how_ Archon will turn tournament results into the league ranking. Before closing a new league with `RTP` or `GP`, do a manual check on 2-3 players to make sure the chosen formula produces what you expect.

### Tie-breaks and drop rules

Archon shows the ranking as-is (Rank, VEKN #, Name, City, Country, Result): if your league applies **drops** (best 4 of 6, etc.) or **custom tie-breaks**, manage the final ranking separately (e.g. spreadsheet or [vtes-hook.com](https://www.vtes-hook.com)) and publish the "official" league standings as an attachment to the closing post. Document the drop rule in the _Description_ at creation time, so players know what to expect.

## 5. Meta-League (nested leagues)

A `Meta-League` is a league that contains **other leagues** instead of tournaments directly. Most leagues (a single season, a linear calendar) use the simple `League` type and **don't** need a Meta-League. Use it only for cases like:

- **Multi-circuit seasons**: a _season_ (Meta-League) aggregates several _circuits_ (Leagues), split by geography or format.
- **Qualifiers → league final**: an "annual" Meta-League collects several qualifier waves, each a League.

As with tournaments, **the link is set from the child league**, not from the Meta-League. The in-app message:

> _"To add a league, set the parent in the league page."_

Procedure:

1. Create the Meta-League first (Type = `Meta-League`).
2. Open the child league with the <span class="archon-pill archon-pill--primary">Edit</span> button and set **Parent League** to the Meta-League you just created, then <span class="archon-pill archon-pill--primary">Submit</span>.

On the Meta-League page you get the **Child Leagues** section with the columns `Name`, `Start Date`, `Format`, `Ranking`, `Location`.

> [!TIP]
> Keep the hierarchy **flat** when you can: two levels (Meta-League → League → tournaments) are usually enough. Three or more levels make the standings hard to explain to players and multiply breakage points when a tournament is reassigned.

## 6. Operating during the league

The league "lives" while its tournaments are being played. When you open a league from the list, its public page shows:

- **`Online` badge** (if the league is online), **contenders** counter (distinct players who joined at least one tournament).
- **Organizers** (judges and organizers of the league).
- **Child Leagues** — for a Meta-League.
- **Tournaments** — list of tournaments with `Name`, `Date`, `Format` and status (`Planned`, `Registration`, `In Progress`, `Finished`).
- **Rankings** — cumulative standings (`Rank`, `VEKN #`, `Name`, `City`, `Country`, `Result`).

Things to remember:

- **Each league tournament has its own cycle** (PLANNED → REGISTRATION → WAITING → PLAYING → FINALS → FINISHED): the league does not override the child states.
- **Decklists and sanctions are per-tournament**, not per-league: a `WARNING` applied in stage 1 stays on the player's VEKN profile but is not "inherited" as an active state in later stages.
- **Stage drop ≠ league drop**: a player dropping tournament 3 can still register for tournament 4. If you want a "permanently out of the league" mechanism, document it in your league's ruleset and track it manually: Archon does not (yet) have a separate _league drop_ flag.
- **Multideck**: the standard for European online leagues. Allows different decklists per round and per-round corrections without touching the others. See [Multideck for players](/en/guides/archon-giocatori/#multideck-tournaments).
- **On-demand pairing**: in online sessions Archon generates tables on the fly. For high-participation leagues, when possible, use the _optimal pre-computed seating_ from the VEKN historical Excel sheet instead of automatic pairing.

### Edit or delete a league

On the league page, organizers see the <span class="archon-pill archon-pill--primary">Edit</span> and <span class="archon-pill archon-pill--red">Delete</span> buttons.

> [!WARNING]
> The Delete confirmation reads: _"This will permanently and officially delete this league. Tournaments will be kept."_ Linked tournaments **are not deleted** when you delete the league: they stay as standalone tournaments without the league reference anymore. If you also want to delete the tournaments, do it manually from each tournament's page.

## 7. Standings and cross-check

The **Rankings** section on the league page is affected by the same recurring bugs as online standings (see [Known bugs for Princes](/en/guides/archon-principi/#7-known-bugs-and-workarounds)). Before publishing the final league ranking:

- **Cross-check with [vtes-hook.com](https://www.vtes-hook.com)**: recompute totals from the individual tournaments and verify they match what Archon shows.
- **Check that all league tournaments are in `Finished` state**: a stage stuck in `In Progress` or `Registration` can skew totals.
- **If you apply drops or custom tie-breaks**, also publish the "raw" Archon ranking so players can verify their per-session scores.

## 8. Known bugs

> [!WARNING]
> Summary of bugs documented on the [Archon repo](https://github.com/vtes-biased/archon) and in the [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md) between November 2025 and May 2026. Check the up-to-date CHANGELOG before assuming a bug is still open.

**League view on empty tournament.** Historically the league view errored out when a linked tournament was still empty (zero registrants). Fixed in v0.64 (_"Fix league view on niche case (empty tournament)"_). If you still see the issue, file a report.

**Online standings bugs (historical).** Recurring online-standings bugs also reflect on the league ranking: use [vtes-hook.com](https://www.vtes-hook.com) as a fallback before publishing the final standings.

**archon → vekn.net sync.** The same bug patterns as for tournaments (wrong country/venue/proxies fields post-import) can resurface on league containers: prefer announcing the league on `vekn.net` and managing it on Archon (see [Known bugs — Princes](/en/guides/archon-principi/#7-known-bugs-and-workarounds)).

## 9. References

- [Archon Online for Princes](/en/guides/archon-principi/) — single tournament creation, cycle, finals, reports.
- [Archon Online for Judges](/en/guides/archon-judge/) — decklists, sanctions, overrides.
- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules) — official tournament rules.
- Archon repository: [github.com/vtes-biased/archon](https://github.com/vtes-biased/archon) and [CHANGELOG](https://github.com/vtes-biased/archon/blob/main/CHANGELOG.md).
- [vtes-hook.com](https://www.vtes-hook.com) — fallback for standings verification.
