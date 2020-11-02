import { LoggerDAO } from '@dao/logger'
import { PubSubDAO } from '@dao/pubsub'

export async function write(id: string, payload: string): Promise<void> {
  await LoggerDAO.writeLog(id, payload)
  PubSubDAO.publish(id, payload)
}

export function follow(id: string, cb: (value: string) => void): () => void {
  return PubSubDAO.subscribe(id, cb)
}

export function query(id: string, range: IRange): Promise<Iterable<{
  id: string
  payload: string
}>> {
  return LoggerDAO.queryLogs(id, range)
}

export function remove(id: string, range: IRange): Promise<void> {
  return LoggerDAO.deleteLogs(id, range)
}
