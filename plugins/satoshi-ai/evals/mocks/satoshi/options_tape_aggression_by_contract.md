---
expect:
  currency: [BTC, ETH]
  from_ms: number
  to_ms: number
---

source: /deribit/options/charts/tape/aggression-by-contract?currency={{input.currency}}&from_ms={{input.from_ms}}&to_ms={{input.to_ms}}
as_of: 2026-09-10T00:26:40.000Z

{"currency":"{{input.currency}}","from_ms":{{input.from_ms}},"to_ms":{{input.to_ms}},"cells":[{"bucket_ms":1788998400000,"instrument_name":"BTC-15SEP26-78000-C","strike":78000,"expiry_ms":1789459200000,"option_type":"CALL","net_contracts":120.4,"buy_contracts":180.1,"sell_contracts":59.7,"gross_contracts":239.8,"print_count":201,"open_interest":950},{"bucket_ms":1788998400000,"instrument_name":"BTC-25SEP26-78000-C","strike":78000,"expiry_ms":1790323200000,"option_type":"CALL","net_contracts":-33.1,"buy_contracts":20,"sell_contracts":53.1,"gross_contracts":73.1,"print_count":66,"open_interest":1400},{"bucket_ms":1788998400000,"instrument_name":"BTC-26SEP26-80000-P","strike":80000,"expiry_ms":1790409600000,"option_type":"PUT","net_contracts":44.9,"buy_contracts":60,"sell_contracts":15.1,"gross_contracts":75.1,"print_count":58,"open_interest":610}]}
