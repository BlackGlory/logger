import { PurgePolicyDAO, LoggerDAO } from '@dao/index.js'
import { LOGGER_LOGS_LIMIT, LOGGER_LOGS_TIME_TO_LIVE } from '@env/index.js'

export function getAllNamespaces(): string[] {
  return PurgePolicyDAO.getAllNamespacesWithPurgePolicies()
}

export function get(namespace: string): {
  timeToLive: number | null
  limit: number | null
} {
  const result = PurgePolicyDAO.getPurgePolicies(namespace)
  return {
    timeToLive: result.timeToLive
  , limit: result.numberLimit
  }
}

export function setTimeToLive(namespace: string, timeToLive: number): void {
  PurgePolicyDAO.setTimeToLive(namespace, timeToLive)
}

export function unsetTimeToLive(namespace: string): void {
  PurgePolicyDAO.unsetTimeToLive(namespace)
}

export function setLimit(namespace: string, limit: number): void {
  PurgePolicyDAO.setNumberLimit(namespace, limit)
}

export function unsetLimit(namespace: string): void {
  PurgePolicyDAO.unsetNumberLimit(namespace)
}

export function purge(namespace: string): void {
  const policies = PurgePolicyDAO.getPurgePolicies(namespace)
  const limit = policies.numberLimit ?? LOGGER_LOGS_LIMIT()
  const timeToLive = policies.timeToLive ?? LOGGER_LOGS_TIME_TO_LIVE()
  if (limit > 0) {
    LoggerDAO.purgeByLimit(namespace, limit)
  }
  if (timeToLive > 0) {
    const timestamp = getTimestamp() - timeToLive
    LoggerDAO.purgeByTimestamp(namespace, timestamp)
  }
}

export function getTimestamp(): number {
  return Date.now()
}
