import { PubSubDAO } from '@dao'

export function publish(id: string, payload: ILog): void {
  PubSubDAO.publish(id, payload)
}

export function subscribe(id: string, cb: (value: ILog) => void): () => void {
  return PubSubDAO.subscribe(id, (value: unknown) => cb(value as ILog))
}
