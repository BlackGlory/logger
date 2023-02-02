import { ILog } from '@api/contract.js'
export { ILog } from '@api/contract.js'

export type IUnsubscribe = () => void

export interface IPubSubDAO {
  publish(namespace: string, value: ILog): void
  subscribe(namespace: string, listener: (value: ILog) => void): IUnsubscribe
}
