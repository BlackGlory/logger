import { LoggerDAO } from '@dao/logger'
import { PubSubDAO } from '@dao/pubsub'
import { LOGGER_LOGS_LIMIT, LOGGER_LOGS_TIME_TO_LIVE } from '@env'

export async function write(id: string, payload: string): Promise<void> {
  await LoggerDAO.writeLog(id, payload)
  PubSubDAO.publish(id, payload)
}

export function follow(id: string, cb: (value: string) => void): () => void {
  return PubSubDAO.subscribe(id, cb)
}

export function query(id: string, range: IRange): AsyncIterable<{
  id: string
  payload: string
}> {
  return LoggerDAO.queryLogs(id, range)
}

export function remove(id: string, range: IRange): Promise<void> {
  return LoggerDAO.deleteLogs(id, range)
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
