import { PurgePolicyDAO, LoggerDAO } from '@dao'
import { LOGGER_LOGS_LIMIT, LOGGER_LOGS_TIME_TO_LIVE } from '@env'

export function getAllNamespaces(): Promise<string[]> {
  return PurgePolicyDAO.getAllNamespacesWithPurgePolicies()
}

export async function get(namespace: string): Promise<{
  timeToLive: number | null
  limit: number | null
}> {
  const result = await PurgePolicyDAO.getPurgePolicies(namespace)
  return {
    timeToLive: result.timeToLive
  , limit: result.numberLimit
  }
}

export function setTimeToLive(namespace: string, timeToLive: number): Promise<void> {
  return PurgePolicyDAO.setTimeToLive(namespace, timeToLive)
}

export function unsetTimeToLive(namespace: string): Promise<void> {
  return PurgePolicyDAO.unsetTimeToLive(namespace)
}

export function setLimit(namespace: string, limit: number): Promise<void> {
  return PurgePolicyDAO.setNumberLimit(namespace, limit)
}

export function unsetLimit(namespace: string): Promise<void> {
  return PurgePolicyDAO.unsetNumberLimit(namespace)
}

export async function purge(namespace: string): Promise<void> {
  const policies = await PurgePolicyDAO.getPurgePolicies(namespace)
  const limit = policies.numberLimit ?? LOGGER_LOGS_LIMIT()
  const timeToLive = policies.timeToLive ?? LOGGER_LOGS_TIME_TO_LIVE()
  if (limit > 0) {
    await LoggerDAO.purgeByLimit(namespace, limit)
  }
  if (timeToLive > 0) {
    const timestamp = getTimestamp() - timeToLive
    await LoggerDAO.purgeByTimestamp(namespace, timestamp)
  }
}

export function getTimestamp() {
  return Date.now()
}
