import { LoggerDAO } from '@dao/logger'
import { PubSubDAO } from '@dao/pubsub'
import { purge } from './purge-policy'

export async function write(id: string, payload: string): Promise<ILog> {
  const result = await LoggerDAO.writeLog(id, payload)
  PubSubDAO.publish(id, result)
  purge(id).catch()
  return result
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

export function remove(id: string, range: IRange): Promise<void> {
  return LoggerDAO.deleteLogs(id, range)
}