---
title: 'Archon Online: Leagues'
description: 'Create and run a league on Archon: tournament series, RTP/GW-VP-TP/Grand Prix standings, meta-leagues.'
categoria: organizzare
audience: [principe]
ordine: 30
versione: '1.0'
aggiornato: 2026-08-10
correlate: [archon-principi-en, archon-giocatori-en, archon-judge-en]
locale: en
---

On [Archon Online](https://archon.vekn.net) a **league** is a **series of tournaments** with aggregated standings: a regional circuit, a season, a grand prix. It is the tool for online leagues and for local in-person cycles.

This guide covers the organizer side. For the single tournament see [Archon Online for Princes](/en/guides/archon-principi/); for the player's view, [Archon Online for players](/en/guides/archon-giocatori/).

> [!IMPORTANT]
> **Archon has been rewritten and this feature changed a lot.** Standings modes are now **RTP** (the default), **GW/VP/TP** and **Grand Prix**; tournaments can be linked **from the league page** as well as from the tournament; and creating a league is restricted to **NCs and ICs**. The old `/league/<uid>/display.html` URLs are gone: it is now `archon.vekn.net/leagues/<uid>`.

## 1. Who can create a league

Only **NC (National Coordinator)** and **IC (Inner Circle)** members. If you are a Prince and want a series, talk to your NC: they can create the league and add you as an organizer, or mark it **open to country Princes** (see below).

**League organizers** work like tournament co-organizers: equal access, no hierarchy, removable at any time — except the last one.

## 2. Creating the league

Go to **Leagues** and press **+ New League**:

- **Name** — shown on the league page.
- **Kind** — **League** (aggregates tournaments: the normal case) or **Meta-League** (aggregates other leagues).
- **Standings Mode** — RTP, GW/VP/TP or Grand Prix (see [Standings modes](#4-standings-modes)).
- **Format** — optional. If set, only tournaments of that format can be linked.
- **Country** — optional, for regional leagues; **Worldwide** is also available.
- **Start date** (required) and **Finish date** — leave the finish empty for an ongoing league.
- **Parent League** — optional, to attach it to a meta-league.
- **Open to country Princes** — when on, Princes of the league's country can link their own tournaments without being league organizers. This is the right option for a national circuit involving many cities.
- **Description** — Markdown. Use it for the short ruleset, the calendar, drop rules and prizes: it is where players will look for them.

## 3. Linking tournaments

Two paths, both valid:

1. **From the league page** — **Add event** lists your league-less tournaments matching the required format.
2. **From the tournament** — **Tools → Settings → Basics**, the **League** field. It is also in the tournament creation form, so it pays to create the **league first** and the tournaments after.

Who can link what: **league organizers** always; **IC** members on any league; **NCs** on leagues of their own country; **country Princes** only if the league is marked **open to country Princes**.

> [!TIP]
> If **Add event** says there is nothing linkable, it is almost always one of: the tournament already belongs to a league, its **format does not match** the league's, or you are not one of its organizers.

## 4. Standings modes

The mode is chosen at creation and shown on the league's public page, so players know what they are looking at.

| Mode                              | How it works                                                                                                                                                                   | What it rewards                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Rating Points (RTP)** — default | VEKN rating points earned at each event, summed across **all** league events, **finals included**. Unlike profile ratings, the season total has **no** best-8 or 18-month cap. | Participation, wins and event size. The balanced choice.                                               |
| **GW/VP/TP**                      | Game wins, victory points and tournament points from **preliminary rounds only**, added up. Event size and finals both ignored.                                                | Pure participation and play: great for promoting small local events, but winning a final adds nothing. |
| **Grand Prix (GP)**               | Fixed position points per tournament: **Winner 25**, other **finalists 15**, then 10, 9, 8… down the standings, to a floor of 3. Finals included, event size ignored.          | _Winning_ high-profile events. Good for a circuit of big tournaments, weak for small ones.             |

> [!NOTE]
> **RTP includes the finals.** This is the most common thing people get wrong when explaining it: the mode that excludes finals is **GW/VP/TP**, not RTP.

### Drops and custom tie-breaks

Archon shows the standings as they are: it supports neither drop rules ("best 4 of 6") nor custom tie-breaks. If your ruleset has them, compute the official standings separately and publish **both**: Archon's raw table, so everyone can check their own leg-by-leg scores, and the one with drops applied. And write the rule in the **Description** from day one.

## 5. Meta-leagues

A **Meta-League** aggregates other leagues instead of tournaments. The hierarchy is **two levels maximum**: meta-league → leagues → tournaments.

It exists for multi-circuit seasons (a season collecting several regional circuits) or qualification cycles. For most cases — one season, a linear calendar — the plain **League** kind is enough.

Children are attached by setting the **Parent League** on the child, or added from the meta-league page under **Child Leagues**.

> [!NOTE]
> A meta-league has **its own standings mode**, applied across all its children's events. A child league may use a different mode for its own table: they are two independent computations, not a sum of standings.

## 6. During the season

The league page shows the description, the linked tournaments with their states, the **combined standings** and — for a meta-league — its child leagues. There is also an **.ics feed** to subscribe to the legs' calendar.

Things to keep in mind:

- **Every leg is still a normal tournament**, with its own cycle, decklists and finals. The league is a layer on top, not a replacement.
- **Players enter by themselves**: they are counted as soon as they play a linked leg; there is no separate league sign-up.
- **Standings appear once tournaments finish.** A leg left open does not count toward the total: before publishing, check every leg is finished.
- **Dropping from a leg is not dropping from the league**: someone who withdraws at leg 3 can play leg 4.

### League-level disqualifications

A **disqualification** taken at one leg **blocks check-in at every other leg of the same league**, until a league organizer lifts it. It is the strongest series-level lever Archon offers: use it deliberately and account for it in your ruleset.

### Closing the season

**Finish league** ends the season at any time; the league goes to **Finished** and the top-ranked player is crowned **Champion**. Without a finish date the league stays ongoing indefinitely.

Deleting a league **does not delete its tournaments**: the tournaments stay, it is the container that goes away.

## 7. Good practice

- **Still announce each leg** with the 28 days' notice the [VEKN rules](https://www.vekn.net/tournament-rules) require: the league does not replace the sanction of the tournaments composing it.
- **Keep format and rank consistent** across legs: changing format mid-season produces standings that are hard to explain.
- **For online leagues**, mark the individual tournaments **Online** too, not just the league, and consider **multideck** (a different deck per round), which is the standard for online series.
- **Pick the mode by what you want to incentivise**: GW/VP/TP if you want people to show up at small legs, GP if you want the big legs to matter, RTP if you want the table to line up with the global VEKN ranking.
- **Document everything in the Description** before the first leg. Changing the rules mid-season is the fastest way to lose participants' trust.

## 8. Reporting problems

For bugs and suggestions use **Send feedback** on the **Help** page, Feedback section: it opens a GitHub issue.

## References

- [Organizer Guide](https://archon.vekn.net/help/organizer-guide) — the Leagues section of the official in-app documentation.
- [Archon Online for Princes](/en/guides/archon-principi/) — creating tournaments, the console, finals, wrap-up.
- [Archon Online for Judges](/en/guides/archon-judge/) — sanctions and disqualifications, which at league level affect the other legs.
- [VEKN Tournament Rules](https://www.vekn.net/tournament-rules).
