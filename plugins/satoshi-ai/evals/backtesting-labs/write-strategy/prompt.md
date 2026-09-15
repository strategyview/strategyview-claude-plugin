---
description: Asked for a strategy in Labs, the copilot reads the rule language, writes against the plots on the chart and validates the draft with them before handing it over.
tags: [backtesting-labs]
max_turns: 20
allowed_tools: [Skill, ToolSearch]
---

Estoy en Backtesting Labs (surface: backtesting_labs, chart_key: binance-perpetual-btc, timeframe: 1h, range_from: 1788739200, range_to: 1789344000, chart_plots: ema9:ema,ema21:ema,rsi14:rsi).

Escríbeme una estrategia: entrar long cuando la EMA 9 cruza por encima de la EMA 21 y el RSI está bajo 70, y salir cuando la EMA 9 cruza por debajo de la EMA 21.
