---
name: dealer-positioning
description: Method for reading dealer gamma positioning from the GEX Chart's data — where gamma is concentrated by expiry and by strike, the movement structure that follows from the days to each expiry, where dealers hedge and in which direction, and whether the Coinbase order book shows it. Built on gamma_exposure_by_expiry and gamma_by_strike_at_expiry; covers the chart's sign convention, walls, the flip, expiry roll-off, the tape check, IV against realised, basis, and the reply format. Use for questions about dealer positioning, gamma walls, the flip, pinning, which expiry governs a level, what happens into and after an expiry, where price accelerates or stalls, whether an order-book wall is dealer hedging, or a level map for a futures trade (also when asked in Spanish — posicionamiento de dealers, muros de gamma, vencimientos, dónde cubren).
---

# Dealer positioning

The person wants a structure, not a list: **when** each part of the move is governed by which
expiry, **where** dealer hedging absorbs a move and where it accelerates one, **how much** hedging
sits there, and **whether the order book agrees**. The levels come from Deribit options; the trade
is usually the Binance perpetual.

**Never compute GEX, or any other exposure.** Every figure comes from an endpoint, through its
tool. Every number in the reply is one a tool returned; when two of them are compared, say how
they compare — do not turn the comparison into a new number. If an endpoint does not give a
figure, it is "not available". The one piece of arithmetic that is yours is time: days to an
expiry, from its epoch and now.

## The two endpoints the analysis stands on

- **`gamma_exposure_by_expiry`** — `/deribit/options/charts/gex/gamma-exposure-by-expiry`.
  Put, Call and Net Gamma per expiry, over every live expiry. It says **where gamma is
  concentrated in time**: which expiry carries the weight, and how much leaves at each settlement.
- **`gamma_by_strike_at_expiry`** — `/deribit/options/charts/gex/gamma-by-strike-at-expiration-date`.
  Put, Call and Net Gamma per strike for one expiry. It says **where that expiry's gamma sits in
  price**: its walls.

Together they are a grid of expiry × strike, and the analysis is read off that grid. Everything
else — the profile, the tape, volatility, the book — qualifies what these two show. Call the second
one for every expiry that matters, not only the nearest.

## What the chart computes

Read this before interpreting anything: it is what the endpoints' numbers mean.

- **GEX is in USD per 1% move.** The chart signs it **positive for calls and negative for puts**.
  That is an assumption — dealers long the calls, short the puts — not something read from the
  flow. Section 5 checks it against the tape.
- **Positive GEX** — dealers long gamma: they sell rallies and buy dips, so the move is absorbed.
  **Negative GEX** — dealers short gamma: they buy rallies and sell dips, so the move accelerates.
- The two endpoints above, and `total_gamma_by_strike`, read Deribit's live book with Deribit's
  own underlying price. `gamma_exposure_profile` reads the latest stored snapshots with Binance
  spot BTCUSDT, over a grid of ±7% (expiry within 3 days), ±20% (within 16) or ±40%. Small
  differences between the profile and the bars are expected; say so if the person spots one.
- Every figure is as of now: gamma at today's spot and today's time to expiry. No endpoint projects
  it forward, and nothing on the chart computes charm or vanna — how a wall grows or fades into its
  expiry is interpretation, and has to be marked as such.
- Contracts with no mark IV or no open interest are left out of every GEX figure, silently.
- `total_gamma_by_strike` returns Call and Put Gamma over all expiries, with no net series. Report
  them as returned; Net Gamma per strike comes from `gamma_by_strike_at_expiry`.
- The `delta_*` tools are OI × delta × S with calls positive and puts negative. They are not
  signed by who holds the position, so do not read them as dealer delta.
- `as_of` on a result is when the dashboard answered, not the age of the options data.

## 1. Frame the question

Settle these from the question and the `<channel>` tag, and say in the reply which you used:

- **Underlying** — BTC unless the tag or the workspace says ETH.
- **Horizon** — the date the person names; by default, through the expiry where gamma is most
  concentrated. Deribit expiries settle at 08:00 UTC.
- **Expiries** — the categories of `gamma_exposure_by_expiry`, as millisecond epochs. Name each by
  its Deribit code (25SEP26) read off an `instrument_name` with the same `expiry_ms` in the tape
  rows, rather than converting the epoch yourself.
- **Spot** — the `spot` field of `gamma_exposure_profile`. Never from memory.

## 2. Gather

Five minutes is the whole budget. Send independent calls together, in three rounds.

Round 1, needs nothing:

| Call | Arguments | Gives |
|---|---|---|
| `gamma_exposure_by_expiry` | currency | every live expiry, and its Put / Call / Net Gamma |
| `total_gamma_by_strike` | currency | strikes several expiries stack on |
| `perpetual_metrics` | symbol BTCUSDT, start_date / end_date as ISO-8601, last 7 days | perp `lastPrice`, `fundingRate`, and `queried_at_ms` — use it as "now" |
| `get_workspace` | workspace_id from the tag | only when the question is about what they have on screen |

Round 2, needs the expiries and now. Pick the expiries from round 1: the nearest, the one where
Net Gamma is most concentrated, and any in between whose Net Gamma is comparable to it.

| Call | Arguments | Gives |
|---|---|---|
| `gamma_by_strike_at_expiry` | one call per expiry picked, all in parallel | the walls of each expiry |
| `gamma_exposure_profile` | the concentrated expiry, and the nearest if it carries real weight | spot, `zero_gamma_level`, Total / Call / Put GEX over the grid |
| `options_tape_aggression_by_contract` | from_ms now − 86400000, to_ms now, **bucket_ms 86400000**, strike_min / strike_max about ±10% of spot | per contract: instrument_name, expiry_ms, net_contracts, buy, sell, gross, open_interest |
| `iv_vs_realized_volatility` | start_ms now − 172800000, end_ms now, bucket_ms 3600000, target_days = days to the concentrated expiry (at least 1), realized_window_days 2 | IV, RV, Spread series |

Always pass `bucket_ms` to the tape tools: the dashboard refuses the call without it, although
the tool lists it as optional. One bucket covering the whole window gives one row per contract.

Round 3, needs the walls: `orderbook_wall_detail` for the two to four walls that matter most
(section 6), and `strike_distribution` for a strike when you need to know which expiries hold it.

## 3. Build the structure by days to expiry

This is the core of the answer. Order the expiries by days to expiry, then:

1. **Where the weight is.** From `gamma_exposure_by_expiry`, find where Net Gamma concentrates —
   often one monthly or quarterly expiry carries far more than the rest. Name it, with its figure
   next to the others as returned.
2. **Phases.** Cut the horizon at each settlement that matters: now to the first, the first to the
   next, and so on through the concentrated expiry, and one phase after it. For each phase:
   - the expiries still alive, and the walls of each from `gamma_by_strike_at_expiry` — largest
     positive Net Gamma strikes (absorb) and largest negative (accelerate);
   - which expiry dominates near spot — the nearest one usually does while it lives, unless the
     concentrated one outweighs it;
   - what leaves at the settlement that closes the phase: that expiry's walls, and its Net Gamma
     from `gamma_exposure_by_expiry`.
3. **Into the concentrated expiry.** As its days run out, its strikes near spot gain gamma and its
   far strikes lose it: the pull toward its largest positive strikes near spot tightens. Say where
   that pull is and between which walls price is held. This is interpretation of today's figures —
   mark it.
4. **After it settles.** Its gamma leaves at once. Read what the next expiry's walls are and
   whether the regime around spot changes — a range held by positive gamma can give way to
   negative gamma, where moves extend. Say it as the data shows it, not as expected.
5. **Flip.** `zero_gamma_level` of the concentrated expiry (and of the nearest, if you called it).
   Read the Total GEX series on each side and report which side absorbs and which accelerates as
   the numbers come out. If it is null, the profile does not cross zero inside its grid: the whole
   range is one regime — say which, and how wide the grid was.

## 4. Qualify it

- **Stacked strikes.** `total_gamma_by_strike`: a strike where several expiries add up holds
  across phases, not only until one settlement.
- **Volatility.** Last points of IV and RV. RV above IV: price is moving more than the options pay
  for, and a pin is weaker than the open interest suggests. IV above RV: the market is paying for
  movement that is not happening. RV is from Coinbase BTC-USD spot.
- **Basis and funding.** Profile spot (Binance spot) next to perp `lastPrice`, and the funding
  rate, as returned. Strikes are Deribit prices: when the two prices sit visibly apart, say so and
  that the levels are not translated to the perp.

## 5. Check the sign against the tape

The chart assumes dealers are long every call and short every put. The tape says who actually
crossed the spread. From `options_tape_aggression_by_contract` (net_contracts = taker buys minus
taker sells):

- **Call, takers net buying** — dealers sold it, so they are short that gamma: the chart's positive
  sign is wrong there, and the strike more likely accelerates.
- **Put, takers net selling** — dealers bought it, so they are long that gamma: the chart's negative
  sign is wrong there, and the strike more likely absorbs.
- **Marginal flow.** When net_contracts is under about a twentieth of the contract's
  open_interest, the position is inherited: its sign is undetermined, not flipped. Report the two
  figures as returned.
- **Blocks** are left out of buy and sell: gross − buy − sell is block volume with no known side.
  If it is a large part of gross, the sign at that contract is undetermined.
- The tape lags by up to five minutes.

Report each wall whose sign the tape contradicts, with its expiry and the flow behind it. Do not
recompute GEX with a new sign: say the chart's figure and what the tape suggests instead.

## 6. Contrast with the Coinbase book

Whether a resting wall on Coinbase is consistent with dealers balancing delta at a gamma level.
For each wall that matters in the current phase — and for any book wall the person asks about,
going the other way — call `orderbook_wall_detail` with exchange coinbase, symbol BTC-USD, market
spot, and low / high the strike ±0.2%. If it returns nothing, nothing rests there: no
corroboration. Then four tests:

1. **Side.** Positive GEX above spot should show an ask wall (side 0); below spot, a bid wall
   (side 1). Negative GEX strikes are not dealer liquidity at all — a wall there is someone else's,
   and a break through it is where hedging chases the move.
2. **Size.** The Net Gamma the endpoint gives for the strike is roughly the USD dealers trade for
   each 1% move through it. Put `current_n` (USD resting) next to it. Coinbase is one venue and
   dealers hedge mostly on perpetuals and futures, so a smaller wall does not contradict; the same
   order of magnitude is a size match.
3. **Persistence.** `duration_ms` of an hour or more, with `current_q` near or above `initial_q`, is
   a standing order. Minutes old, or shrinking, is liquidity that can be pulled.
4. **Absorption.** `traded_q` above zero with the wall still standing means it is being refilled —
   someone keeps defending the level.

Grade each wall: **high** when side, size and persistence all hold (and absorption, if price has
tested it); **medium** when side holds and one of size or persistence; **low** when only side
holds; **none** when the side is wrong or nothing rests there. This is a grade of consistency, not
a probability — no tool measures the chance that a wall is a dealer hedge, so never state one.

## 7. Before replying

- Freshness: if the answer leans on the flip, take the ATM `instrument_name` from the tape rows and
  call `option_metrics_snapshots` for the last hour. If its latest `captured_at` is more than 30
  minutes old, say so.
- List every strike marked marginal or undetermined.
- If the person gave levels of their own, compare and explain each disagreement plainly.
- A tool that failed: its part is "not available", and the rest of the answer stands.

## 8. Reply

One reply, plain text: no tables, no bold, no headings. Lead with the answer.

1. Two lines: where gamma is concentrated (which expiry, how many days out), the regime at spot,
   the flip, and the nearest wall above and below.
2. The structure, one block per phase, in time order. Each block opens with its window — until
   which expiry, how many days — then its levels from highest price to lowest, one per line:
   price — expiry that holds it — absorbs / accelerates / undetermined — Net Gamma USD per 1% —
   OI — taker net 24h — Coinbase wall (side, size, age) or none — confidence
   and closes with what leaves at its settlement.
3. Path from spot, up and down, within the current phase: which level triggers which hedging
   reaction, in order.
4. Where the reading fails: the levels past which the gamma profile stops supporting it.
5. Data: the sign convention and what the tape said about it, the sources and their times, and
   whatever was not available.

Keep what the tools returned apart from what you read into it. No sizing, entries, stops or risk
management — levels, regimes and hedging mechanics only.

If time runs short, reply with lines 1 and 2 without the book column, name the gaps, and say the
Coinbase contrast can be asked next.
