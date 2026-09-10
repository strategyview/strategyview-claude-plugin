# StrategyView Claude plugins

Claude Code channel plugins for StrategyView. Adding this repository as a marketplace makes
them installable:

```
/plugin marketplace add strategyview/strategyview-claude-plugin
```

## gexchart

Bridges the assistant panel in the GEX Chart into a running Claude Code session, so a
question typed next to the chart is answered by your own Claude — no API key involved.

The panel never talks to this process. It posts to the StrategyView engine over HTTPS, and
the plugin polls the engine for what is pending, the same way the official Discord channel
polls the Discord API. Nothing here listens on a port.

Answering questions is a separate concern: the market-data tools live in the StrategyView MCP
server, connected to the same session. This plugin only moves messages.

### Setup

Requires [Bun](https://bun.sh). If it is missing, `/gexchart:connect` notices, asks whether to
install it, and installs it only with your approval.

Once, to register the marketplace:

```
/plugin marketplace add strategyview/strategyview-claude-plugin
```

Then:

```
/plugin install gexchart@strategyview
claude --dangerously-load-development-channels plugin:gexchart@strategyview
/gexchart:connect WDJB-MJHT
```

The code comes from **Connect with Claude** in the chart. It works once and lives ten minutes.
The plugin exchanges it for a token, stores it in `~/.claude/channels/gexchart/.env`, and starts
listening straight away — no restart. The token never appears in the conversation.

> During the Channels research preview a plugin outside the Anthropic-curated allowlist needs
> `--dangerously-load-development-channels` in place of `--channels`. On Team and Enterprise
> plans an admin can allow it in managed settings instead, which keeps the ordinary flag
> working. See `allowedChannelPlugins` in the Claude Code channel documentation.

The chart's data tools come through the plugin too: once connected it opens StrategyView's MCP
endpoint with the token it holds and offers those tools to Claude. Nothing else to install, and
no `claude mcp add`.

There is no pairing step. The token says whose Claude this is, and StrategyView only hands the
plugin the questions that user asked. Disconnecting is done from the chart; the plugin notices
on its next poll and asks for a new code.

### Environment

| Variable | Purpose |
| --- | --- |
| `GEXCHART_URL` | Where StrategyView is. Defaults to `https://app.strategyview.trade`. |
| `GEXCHART_TOKEN` | Connector token. Written by `/gexchart:connect`; never set it by hand. |
| `GEXCHART_ENGINE_URL` | Only when the chat is served somewhere other than `GEXCHART_URL`. |
| `GEXCHART_STATE_DIR` | Overrides `~/.claude/channels/gexchart`, for a second instance. |
