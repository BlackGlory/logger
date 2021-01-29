import { LoggerDAO } from '@dao/data-in-sqlite3/logger'
import { PubSubDAO } from '@dao/data-in-memory/pubsub'
import { purge } from './purge-policy'

export async function write(id: string, payload: string): Promise<void> {
  const result = await LoggerDAO.writeLog(id, payload)
  PubSubDAO.publish(id, result)
  await purge(id).catch()
}

export function follow(id: string, cb: (value: ILog) => void): () => void {
  return PubSubDAO.subscribe(id, value => cb(value as ILog))
}

export function query(id: string, range: IRange): AsyncIterable<{
  id: string
  payload: string
}> {
  return LoggerDAO.queryLogs(id, range)
}

export function del(id: string, range: IRange): Promise<void> {
  return LoggerDAO.deleteLogs(id, range)
}

export function getAllLoggerIds(): AsyncIterable<string> {
  return LoggerDAO.getAllLoggerIds()
}
