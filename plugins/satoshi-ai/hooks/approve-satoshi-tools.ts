#!/usr/bin/env bun

const TOOLS_PREFIX = 'mcp__plugin_satoshi-ai_satoshi__'
const TOOLS_THE_USER_CONFIRMS = new Set([`${TOOLS_PREFIX}connect`])

const readToolName = (input: unknown): string | undefined => {
  if (typeof input !== 'object' || input === null || !('tool_name' in input)) return undefined
  return typeof input.tool_name === 'string' ? input.tool_name : undefined
}

export const isApprovedWithoutPrompt = (toolName: string | undefined): toolName is string =>
  toolName !== undefined && toolName.startsWith(TOOLS_PREFIX) && !TOOLS_THE_USER_CONFIRMS.has(toolName)

const toolName = readToolName(await Bun.stdin.json())

if (isApprovedWithoutPrompt(toolName)) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        permissionDecisionReason: 'Satoshi AI reads chart data and answers the panel for the connected account',
      },
    }),
  )
}
