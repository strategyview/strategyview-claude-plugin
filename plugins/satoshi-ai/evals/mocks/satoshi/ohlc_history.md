---
expect:
  exchange: [binance, bybit, coinbase, gate, okx]
  symbol: string
---

source: /binance/dashboard/ohlc/history?symbol={{input.symbol}}&market=perpetual&timeframe=1h
as_of: 2026-09-14T12:00:00.000Z

{"type":"ohlc_history","exchange":"binance","market":"perpetual","symbol":"BTCUSDT","timeframe":"1h","timeframe_seconds":3600,"count":6,"bars":[{"t":1789322400000,"o":77120,"h":77480,"l":76990,"c":77410,"v":1820},{"t":1789326000000,"o":77410,"h":77900,"l":77350,"c":77860,"v":2410},{"t":1789329600000,"o":77860,"h":78120,"l":77610,"c":77690,"v":2990},{"t":1789333200000,"o":77690,"h":77740,"l":77010,"c":77080,"v":3150},{"t":1789336800000,"o":77080,"h":77320,"l":76880,"c":77250,"v":2040},{"t":1789340400000,"o":77250,"h":77660,"l":77200,"c":77590,"v":1760}]}
