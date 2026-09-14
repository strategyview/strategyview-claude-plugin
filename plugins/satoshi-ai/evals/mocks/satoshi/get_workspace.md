---
expect:
  workspace_id: string
---

source: /chart/workspaces/get-workspace-full?user_id=1&workspace_id={{input.workspace_id}}
as_of: 2026-09-10T00:26:40.000Z

{"id":"{{input.workspace_id}}","name":"testing env","layout":{"mode":"grid","columns":1},"charts":[{"id":31,"metadata":{"exchange":"binance","market":"spot","symbol":"BTC","timeframe":"1h"},"indicators":[{"name":"GEX visible range"}],"widgets":[{"widgetType":"optionsAggression","settings":{"enabled":true,"maxDte":0,"lookbackBars":300}}]}]}
