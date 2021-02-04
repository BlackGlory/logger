type IUnsubscribe = () => void

interface IPubSubDAO {
  publish(key: string, value: ILog): void
  subscribe(key: string, listener: (value: ILog) => void): IUnsubscribe
}
