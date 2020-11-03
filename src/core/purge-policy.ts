import { LoggerDAO } from '@dao'

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
