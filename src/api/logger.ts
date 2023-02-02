import { LoggerDAO } from '@dao/data/logger/index.js'
import { PubSubDAO } from '@dao/data/pubsub/index.js'
import { ILog, IRange } from './contract.js'
import { purge } from './purge-policy.js'

export function write(namespace: string, payload: string): void {
  const id = LoggerDAO.writeLog(namespace, payload)
  PubSubDAO.publish(namespace, { id, payload })
  purge(namespace)
}

export function follow(namespace: string, cb: (value: ILog) => void): () => void {
  return PubSubDAO.subscribe(namespace, cb)
}

export function query(namespace: string, range: IRange): Iterable<{
  id: string
  payload: string
}> {
  return LoggerDAO.queryLogs(namespace, range)
}

export function del(namespace: string, range: IRange): void {
  LoggerDAO.deleteLogs(namespace, range)
}

export function getAllNamespaces(): Iterable<string> {
  return LoggerDAO.getAllNamespaces()
}
