---
expect:
  chart_key: string
  timeframe: string
---

source: /deribit/options/charts/tape/aggression-by-strike, /deribit/options/charts/volatility/iv-vs-realized, /binance/dashboard/ohlc/history
as_of: 2026-09-10T00:26:40.000Z

{"chart":{"exchange":"binance","market":"spot","asset":"BTC","timeframe":"{{input.timeframe}}","max_dte":0},"computed_at_ms":1789000000000,"band":null,"heatmap":{"from_ms":1787922000000,"to_ms":1789002000000,"bucket_ms":3600000,"strike_step":500,"strikes":[{"strike":78000,"optionType":"CALL","netContracts":240.8,"buyContracts":301.4,"sellContracts":60.6,"grossContracts":362,"printCount":415}]},"tape":{"unavailable":"no band, so no tape — realised volatility unavailable: /deribit/options/charts/volatility/iv-vs-realized answered 503. The chart shows no tape either."},"not_included":"prints streamed live after the chart loaded"}
