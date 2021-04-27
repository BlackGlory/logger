import { PubSubDAO } from '@dao'

export function publish(namespace: string, payload: ILog): void {
  PubSubDAO.publish(namespace, payload)
}

export function subscribe(namespace: string, cb: (value: ILog) => void): () => void {
  return PubSubDAO.subscribe(namespace, (value: unknown) => cb(value as ILog))
}
