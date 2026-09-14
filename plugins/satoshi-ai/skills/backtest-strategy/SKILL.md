---
name: backtest-strategy
description: Method for Backtesting Labs questions — writing a strategy script that validates, checking whether a rule would have held, and finding a pattern in the window's history — with script_grammar, validate_script and the market history tools. Load it for questions about strategies, rules, entries and exits, patterns, or "would this have worked".
---

# Backtest strategy

Three kinds of question arrive from Labs. Decide which one it is before calling anything.

## Writing a strategy

1. **Read the language** with `script_grammar`, once per conversation. Scripts are statements over
   the series already on the chart; nothing else exists.
2. **Map the chart.** `chart_plots` comes as `alias:plot|plot,alias:plot`. Turn it into the
   `chart` argument of `validate_script`: `{"ema9": ["ema"], "rsi14": ["rsi"]}`.
3. **Write the script** with those aliases and plots only. If the idea needs a series that is not
   there, stop and tell the person which indicator to add in Labs.
4. **Validate** with `validate_script`, passing `script` and `chart`. When it reports problems, fix
   exactly those — the error names the position and what was valid there — and validate again.
   Stop after three rounds and show the last errors rather than looping.
5. **Reply with the validated script** as plain lines, a sentence on what each rule does, and that
   the result comes from pressing Run in Labs.

Never describe how the strategy performed. The chat does not run it.

## Checking whether a rule would have held

The honest answer is a script plus Run. Write the rule as a script, validate it as above, and say
that running it in Labs over this window gives the trades and the numbers. When the question can
also be answered from the bars — "how often did price close above X" — count it from
`ohlc_history` over the window and give that count, saying it is a count of bars, not a backtest.

## Finding a pattern

1. **Read the window** with `ohlc_history` over `range_from`–`range_to` at the chart's timeframe,
   on the venue and market in `chart_key`. Count the bars first: past 1000, work on the most recent
   1000 and say so.
2. **Describe what the bars show**, with the times and prices they returned: moves, ranges,
   repeated behaviour around a time of day or a level.
3. **Offer the pattern as a rule** the person can test — and, if they want it, write and validate
   the script.

A pattern read by eye from a few hundred bars is an observation, not an edge. Say that plainly.
