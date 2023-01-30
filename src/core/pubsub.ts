import { PubSubDAO } from '@dao/index.js'

export function publish(namespace: string, payload: ILog): void {
  PubSubDAO.publish(namespace, payload)
}

export function subscribe(namespace: string, cb: (value: ILog) => void): () => void {
  return PubSubDAO.subscribe(namespace, (value: unknown) => cb(value as ILog))
}
