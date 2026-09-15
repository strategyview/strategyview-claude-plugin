---
expect:
  currency: [BTC, ETH]
  from_ms: number
  to_ms: number
---

source: /deribit/options/charts/tape/aggression-by-strike?currency={{input.currency}}&from_ms={{input.from_ms}}&to_ms={{input.to_ms}}
as_of: 2026-09-10T00:26:40.000Z

{"currency":"{{input.currency}}","from_ms":{{input.from_ms}},"to_ms":{{input.to_ms}},"strike_step":500,"cells":[{"bucket_ms":1788998400000,"strike":78000,"expiry_ms":1789459200000,"option_type":"CALL","net_contracts":120.4,"buy_contracts":180.1,"sell_contracts":59.7,"gross_contracts":239.8,"print_count":201},{"bucket_ms":1788998400000,"strike":80000,"expiry_ms":1790409600000,"option_type":"PUT","net_contracts":44.9,"buy_contracts":60,"sell_contracts":15.1,"gross_contracts":75.1,"print_count":58}]}
