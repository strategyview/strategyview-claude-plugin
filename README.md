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

Requires [Bun](https://bun.sh).

```
/plugin install gexchart@strategyview
/gexchart:configure <connector-token>
```

The token comes from **Connect Claude** in the chart panel. It is written to
`~/.claude/channels/gexchart/.env` and never leaves your machine.

Restart with the channel enabled:

```
claude --channels plugin:gexchart@strategyview
```

Then type in the chart panel. The first message comes back with a pairing code:

```
/gexchart:access pair <code>
```

From then on the panel reaches your session.

> During the Channels research preview a plugin outside the Anthropic-curated allowlist needs
> `--dangerously-load-development-channels` in place of `--channels`. On Team and Enterprise
> plans an admin can allow it in managed settings instead, which keeps the ordinary flag
> working. See `allowedChannelPlugins` in the Claude Code channel documentation.

### Access

`/gexchart:access` manages who may push into your session:

| Command | Effect |
| --- | --- |
| `pair <code>` | Approve the code the panel showed |
| `list` | Show policy, allowed senders and live codes |
| `revoke <senderId>` | Stop a sender reaching the session |
| `policy pairing\|open` | `pairing` is the default and the one to keep |

State lives in `~/.claude/channels/gexchart/access.json`. The channel re-reads it on every
poll, so a change takes effect without restarting.

Access is gated on the sender, never on the workspace: a workspace is a room, and gating on
it would let anyone who can open a shared chart put text in front of the model. For the same
reason `/gexchart:access` only acts on what you type in your own terminal — never on a
request that arrived through the channel.

### Environment

| Variable | Purpose |
| --- | --- |
| `GEXCHART_TOKEN` | Connector token. Normally written by `/gexchart:configure`. |
| `GEXCHART_ENGINE_URL` | Engine base URL. Defaults to the production engine. |
| `GEXCHART_STATE_DIR` | Overrides `~/.claude/channels/gexchart`, for a second instance. |
