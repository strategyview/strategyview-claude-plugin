---
expect:
  chart_key: /^[a-z]+-[a-z]+-[a-z]+$/
  timeframe: string
---

source: /deribit/options/charts/tape/aggression-by-strike, /deribit/options/charts/tape/aggression-by-contract, /deribit/options/charts/volatility/iv-vs-realized, /binance/dashboard/ohlc/history
as_of: 2026-09-10T00:26:40.000Z

{"chart":{"exchange":"binance","market":"spot","asset":"BTC","timeframe":"{{input.timeframe}}","max_dte":0},"computed_at_ms":1789000000000,"band":{"spot":77000,"realized_volatility":0.4,"horizon_days":7,"band_pct":0.05539,"strike_min":72734.66,"strike_max":81265.34},"heatmap":{"from_ms":1787922000000,"to_ms":1789002000000,"bucket_ms":3600000,"strike_step":500,"strikes":[{"strike":76000,"optionType":"PUT","netContracts":-182.4,"buyContracts":40.1,"sellContracts":222.5,"grossContracts":262.6,"printCount":311},{"strike":77000,"optionType":"CALL","netContracts":95.2,"buyContracts":130.7,"sellContracts":35.5,"grossContracts":166.2,"printCount":204},{"strike":78000,"optionType":"CALL","netContracts":240.8,"buyContracts":301.4,"sellContracts":60.6,"grossContracts":362,"printCount":415},{"strike":80000,"optionType":"CALL","netContracts":-61.3,"buyContracts":12.2,"sellContracts":73.5,"grossContracts":85.7,"printCount":97}]},"tape":{"from_ms":1786492800000,"to_ms":1789084800000,"bucket_ms":86400000,"contracts":[{"instrumentName":"BTC-11SEP26-78000-C","strike":78000,"expiryMs":1789113600000,"optionType":"CALL","dte":0.53,"cvd":210.5,"grossContracts":410.2,"printCount":388,"lastBucketMs":1788998400000},{"instrumentName":"BTC-11SEP26-76000-P","strike":76000,"expiryMs":1789113600000,"optionType":"PUT","dte":0.53,"cvd":-150.2,"grossContracts":240.9,"printCount":270,"lastBucketMs":1788998400000}]},"not_included":"prints streamed live after the chart loaded"}
