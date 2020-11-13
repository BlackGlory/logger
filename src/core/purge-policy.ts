import { LoggerDAO } from '@dao'
import { LOGGER_LOGS_LIMIT, LOGGER_LOGS_TIME_TO_LIVE } from '@env'

export function getAllIds(): Promise<string[]> {
  return LoggerDAO.getAllIdsWithPurgePolicies()
}

export async function get(id: string): Promise<{
  timeToLive: number | null
  limit: number | null
}> {
  const result = await LoggerDAO.getPurgePolicies(id)
  return {
    timeToLive: result.timeToLive
  , limit: result.numberLimit
  }
}

export function setTimeToLive(id: string, timeToLive: number): Promise<void> {
  return LoggerDAO.setTimeToLive(id, timeToLive)
}

export function unsetTimeToLive(id: string): Promise<void> {
  return LoggerDAO.unsetTimeToLive(id)
}

export function setLimit(id: string, limit: number): Promise<void> {
  return LoggerDAO.setNumberLimit(id, limit)
}

export function unsetLimit(id: string): Promise<void> {
  return LoggerDAO.unsetNumberLimit(id)
}

export async function purge(id: string): Promise<void> {
  const policies = await LoggerDAO.getPurgePolicies(id)
  const limit = policies.numberLimit ?? LOGGER_LOGS_LIMIT()
  const timeToLive = policies.timeToLive ?? LOGGER_LOGS_TIME_TO_LIVE()
  if (limit > 0) await LoggerDAO.purgeByLimit(id, limit)
  if (timeToLive > 0) {
    const timestamp = getTimestamp() - timeToLive
    await LoggerDAO.purgeByTimestamp(id, timestamp)
  }
}

export function getTimestamp() {
  return Date.now()
}
