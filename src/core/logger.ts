import { LoggerDAO } from '@dao/data-in-sqlite3/logger'
import { PubSubDAO } from '@dao/data-in-memory/pubsub'
import { purge } from './purge-policy'

export async function write(namespace: string, payload: string): Promise<void> {
  const id = await LoggerDAO.writeLog(namespace, payload)
  PubSubDAO.publish(namespace, { id, payload })
  await purge(namespace).catch()
}

export function follow(namespace: string, cb: (value: ILog) => void): () => void {
  return PubSubDAO.subscribe(namespace, cb)
}

export function query(namespace: string, range: IRange): AsyncIterable<{
  id: string
  payload: string
}> {
  return LoggerDAO.queryLogs(namespace, range)
}

export function del(namespace: string, range: IRange): Promise<void> {
  return LoggerDAO.deleteLogs(namespace, range)
}

export function getAllNamespaces(): AsyncIterable<string> {
  return LoggerDAO.getAllNamespaces()
}
