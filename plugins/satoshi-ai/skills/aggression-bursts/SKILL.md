---
name: aggression-bursts
description: Method for finding hidden taker aggression on Binance — large prints, sweeps across levels, runs of orders on one side — with agg_trade_bursts, without pulling the tape. Load it for questions about big market orders, whales, sweeps, "who hit the book", or aggression over a time window.
---

# Aggression bursts

`agg_trade_bursts` groups the stored Binance aggTrade tape into bursts — consecutive prints on
the same side, no further apart than `window` — and returns only those whose size reaches
`min_quantity`, largest first. The grouping runs in the database. That is the point: the answer
is a handful of bursts, not hundreds of thousands of prints.

## What it can and cannot answer

- **BTCUSDT and ETHUSDT, spot or perpetual.** Nothing else is stored.
- **Only what was captured.** There is no history from before capture and no fallback to the
  exchange. An empty answer means no burst crossed the threshold in the stored tape — say that,
  not that the market was quiet.
- **The taker side only.** It shows who crossed the spread and how hard. It cannot say how many
  makers absorbed a print at one price; do not claim it.

## Choosing the arguments

**Span.** At most 6 hours per call; omit `start` for the last hour. Take the window from the
question — "the dump at 14:00" is an hour around 14:00, not a day. Walk a longer period in 6 hour
steps only when the question is explicitly about that period, and remember the panel gives up
after five minutes.

**`min_quantity`, in base units** — 300 is 300 BTC on BTCUSDT.
- If the question names a size, use it.
- If not, start at a size that should be rare for that pair and window. If nothing comes back,
  lower it once, by half, and say in the answer which threshold produced the result.
- Never step it down in a loop until something appears: a threshold chosen by what the data
  returned makes any result look significant.

**`window`, in ms.**
- `0` first. It groups what shares a millisecond, which is one order sweeping several levels.
- A few hundred ms catches the same hand splitting an order into several. Say you widened it.
- Up to 60 000. Beyond a few seconds a burst is several decisions, not one — describe it that
  way.

## Reading a burst

- `print_count` 1: one print at one price.
- `print_count` > 1 with `start_ms` equal to `end_ms`: one order that swept several levels.
- `print_count` > 1 spread over time: several orders in a row on one side.
- `price_high` − `price_low`: how far the burst moved through the book. A large size with a
  narrow range met liquidity; a small size with a wide range found a thin book.
- `fill_count` / `print_count`: individual fills per print. High means the size met many small
  resting orders.
- `vwap` against the range: where the size actually got done inside the move.

## Putting it in context

One call each, same window, only when the question needs it:

- `ohlc_history` — where the burst sits against price: at a level, into a breakout, after the
  move had already happened.
- `liquidations_history` (perpetual) — a burst that lines up with liquidations is forced flow,
  not a decision. Separate the two before reading intent into it.

## Do not

- Use `market_trades_history` to look for size. It pulls the raw tape, is truncated at 20 000
  trades, and is exactly the load this tool exists to avoid.
- Read intent from one burst. Report what happened; if you interpret, mark it as interpretation.
- Turn a burst into a trade idea. No entries, no stops, no sizing.
