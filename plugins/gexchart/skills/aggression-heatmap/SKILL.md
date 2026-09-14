---
name: aggression-heatmap
description: Method for reading the options aggression widget on the GEX chart — the heatmap of taker aggression per strike and the options tape beside it — with options_aggression_view, which reads them exactly as the chart does. Load it for questions about the options aggression heatmap, the options tape, taker flow per strike or contract, or "what do you see" on that widget.
---

# Options aggression heatmap

The widget draws two things from the Deribit options tape. The person asks about what is on their
screen, so answer from what the widget loaded — not from a window or a strike range of your own.

## Which tool

- **The question is about the widget as displayed** — "what do you see in the heatmap", "where is
  the aggression", "what is the tape saying": call `options_aggression_view` once, with
  `chart_key` and `timeframe` from the question's attributes and `max_dte` from `get_workspace` →
  `widgets` → `optionsAggression` → `maxDte` (omit it when the widget has none). The tool picks the
  windows and the band the way the chart does. Do not choose them yourself.
- **The person names a range** — expiries, strikes, a window, "all strikes": give them that range
  with `options_tape_aggression_by_strike` or `_by_contract`, inside the query budgets. Never refuse
  because it is wider than the widget; raise the bucket instead of splitting the call.

## What the view contains

| Part | What it is |
|---|---|
| `heatmap.strikes` | Per strike and side, taker flow summed over the last 300 bars of the chart timeframe, every strike, all expiries within `max_dte`. This is the heatmap's latest column. |
| `tape.contracts` | Per contract, net flow (`cvd`) over the last 30 days, only strikes inside `band`, largest first. The tape table before live prints. |
| `band` | spot ± spot × realised vol × √(7/365): the strikes the tape covers, and the spot and volatility it was sized with. |

The two parts cover different windows — 300 bars against 30 days — so their totals differ by
design. Never add one to the other.

## Reading it

- **Sign is the taker.** Positive `netContracts` / `cvd`: takers bought. The dealer took the other
  side, so heavy call buying at a strike leaves dealers short those calls.
- **Calls and puts apart.** A strike can show call buying and put selling at once; report both.
- **Where the size is.** Name the strikes with the largest absolute net flow, and whether they sit
  inside the band — near spot, where hedging reacts first — or outside it.
- **Data, then reading.** Say the numbers the view returned, then what they suggest about dealer
  hedging, and keep the two apart.

## Limits to say out loud

- Prints that streamed in after the chart loaded are not in the view; the screen may show a few
  more.
- Spot and realised volatility are read at the moment of the call, so the band can differ from the
  one on screen by a few strikes.
- `band: null` means there is no tape, exactly as on the chart — say why from `tape.unavailable`
  and answer from the heatmap.
- An empty `heatmap.strikes` is no captured flow in that window, not a quiet market.
