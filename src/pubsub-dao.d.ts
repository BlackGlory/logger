type IUnsubscribe = () => void

interface IPubSubDAO {
  publish(namespace: string, value: ILog): void
  subscribe(namespace: string, listener: (value: ILog) => void): IUnsubscribe
}
