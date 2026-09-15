# StrategyView Claude plugins

Claude Code channel plugins for StrategyView. Adding this repository as a marketplace makes
them installable:

```
/plugin marketplace add strategyview/strategyview-claude-plugin
```

## satoshi-ai

Bridges the assistant panel in the GEX Chart into a running Claude Code session, so a
question typed next to the chart is answered by your own Claude — no API key involved.

The panel never talks to this process. It posts to the StrategyView engine over HTTPS, and
the plugin polls the engine for what is pending, the same way the official Discord channel
polls the Discord API. Nothing here listens on a port.

Answering questions is a separate concern: the market-data tools live in the StrategyView MCP
server, connected to the same session. This plugin only moves messages.

### Setup

Requires [Bun](https://bun.sh). If it is missing, `/satoshi-ai:connect` notices, asks whether to
install it, and installs it only with your approval.

Once, to register the marketplace:

```
/plugin marketplace add strategyview/strategyview-claude-plugin
```

Then:

```
/plugin install satoshi-ai@strategyview
claude --agent satoshi-ai:satoshi --dangerously-load-development-channels plugin:satoshi-ai@strategyview
/satoshi-ai:connect WDJB-MJHT
```

`--agent satoshi-ai:satoshi` runs the session as Satoshi, the chart's assistant: no shell, no files.
The session takes questions that come from a browser, so it should not be able to act on the
machine it runs on, and Satoshi keeps to the chat instead of wandering off to fix things in the
terminal. Without the flag the channel still works, with every tool the session normally has.

**One copilot per conversation.** Every window you have open — on the GEX Chart or in Backtesting Labs — is served by this one session.
Satoshi does not answer: it hands each conversation — a chart window's thread, renewed when you
close the chat or get a new code — to its own `satoshi-ai:gexchart` subagent, and resumes that
copilot for the next question in the same conversation. Two windows never share a context, and
they are answered in parallel.

The code comes from **Connect with Claude** in the chart. It works once and lives ten minutes.
The plugin exchanges it for a token and starts listening straight away — no restart. The token
never appears in the conversation, and it is never written to disk: it lives in the session that
ran the command.

**One session answers the chart.** Claude Code starts the plugin in every session you open, and
a question from the chart goes to exactly one of them, so the connection belongs to the session
where you connected. Connecting another session replaces it — the previous one is told it is no
longer connected. Restarting Claude means a new code from the chart.

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

### What is inside

| Piece | What it is for |
| --- | --- |
| `agents/satoshi.md` | The harness and the front desk: receives the panels' questions and routes each conversation to its screen's copilot. No data tools, no shell. |
| `agents/gexchart.md` | The GEX Chart copilot: one per chart window, about what the chart shows now. |
| `agents/backtesting-labs.md` | The Backtesting Labs copilot: one per Labs window, about what already happened — patterns, rules, strategy scripts. |
| `skills/copilot-base` | The rules every copilot answers by, preloaded into each: the channel, security, the screen as it is now, writing for the panel. |
| `skills/connect` | `/satoshi-ai:connect` — connecting a session, installing Bun if needed. |
| `skills/aggression-bursts` | Hidden taker aggression on Binance — large prints, sweeps, runs on one side — with `agg_trade_bursts`, without pulling the tape. |
| `skills/backtest-strategy` | Writing a strategy script that validates, checking a rule, finding a pattern in the window, with `script_grammar`, `validate_script` and the history tools. |
| `skills/aggression-heatmap` | The options aggression widget — heatmap per strike and tape per contract — read as the chart reads it, with `options_aggression_view`. |
| `skills/dealer-positioning` | Dealer gamma positioning: where gamma sits by expiry and strike, the structure by days to expiry, the tape check, and the Coinbase book contrast. |

Guides for the kinds of question the chart answers go in `skills/`, one per kind. The copilots
load them when a question needs one; the agents themselves hold only the rules.

### Evals

`evals/` holds one directory per case. MCP tools are answered by the mocks in `evals/mocks/satoshi/`,
so no engine or connection is needed; `_tools.json` there carries the real tool descriptions and
schemas, regenerated from the engine whenever a mocked tool changes. Run them with ToolSearch
granted, since plugin MCP tools load deferred:

```
claude plugin eval plugins/satoshi-ai --allow-tools ToolSearch
``` Each skill
has its cases under a directory named after it.

### Production and other environments

`/satoshi-ai:connect <code>` connects to production. Any other environment is named in the command —
`/satoshi-ai:connect <code> http://localhost:5173` — and the chart puts its own address in the
command it shows whenever it is not production, so copying it is enough. Nothing is remembered
between connections: each one goes where its command says, and the answer names it.

### Environment

| Variable | Purpose |
| --- | --- |
| `SATOSHI_AI_URL` | The default target for this process when `/satoshi-ai:connect` names none. Production (`https://app.strategyview.trade`) otherwise. |
| `SATOSHI_AI_TOKEN` | A connector token for this process only, for driving the plugin by hand. Normally `/satoshi-ai:connect` holds it in memory. |
| `SATOSHI_AI_ENGINE_URL` | Only when the chat is served somewhere other than `SATOSHI_AI_URL`. |
