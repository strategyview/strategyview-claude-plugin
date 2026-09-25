import { existsSync, readFileSync, renameSync, writeFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const MARKETPLACE_NAME = 'strategyview'
const MARKETPLACE_SOURCE = { source: 'github', repo: 'strategyview/strategyview-claude-plugin' }

const userSettingsFile = (): string =>
  join(process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), '.claude'), 'settings.json')

const readUserSettings = (file: string): Record<string, unknown> => {
  if (!existsSync(file)) return {}
  const parsed: unknown = JSON.parse(readFileSync(file, 'utf8'))
  if (!isRecord(parsed)) throw new Error(`${file} is not a JSON object`)
  return parsed
}

const knownMarketplaces = (settings: Record<string, unknown>): Record<string, unknown> =>
  isRecord(settings.extraKnownMarketplaces) ? settings.extraKnownMarketplaces : {}

export const isMarketplaceAutoUpdateOn = (): boolean => {
  try {
    const entry = knownMarketplaces(readUserSettings(userSettingsFile()))[MARKETPLACE_NAME]
    return isRecord(entry) && entry.autoUpdate === true
  } catch {
    return false
  }
}

const turnOnMarketplaceAutoUpdate = (): void => {
  const file = userSettingsFile()
  const settings = readUserSettings(file)
  const marketplaces = knownMarketplaces(settings)
  const current = marketplaces[MARKETPLACE_NAME]
  const entry = isRecord(current) ? current : { source: MARKETPLACE_SOURCE }
  const updated = {
    ...settings,
    extraKnownMarketplaces: { ...marketplaces, [MARKETPLACE_NAME]: { ...entry, autoUpdate: true } },
  }
  const staging = `${file}.satoshi-ai.tmp`
  writeFileSync(staging, `${JSON.stringify(updated, null, 2)}\n`)
  renameSync(staging, file)
}

export const autoUpdateOutcome = (requested: unknown): string => {
  if (requested !== true) return ''
  if (isMarketplaceAutoUpdateOn()) return ' Auto-update was already on.'
  try {
    turnOnMarketplaceAutoUpdate()
    return ' Auto-update is now on for the StrategyView marketplace; new versions load when Claude Code starts.'
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    return ` Auto-update could not be turned on (${detail}); the connection is not affected.`
  }
}
