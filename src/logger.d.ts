type IUnfollow = () => void

type ILoggerFactory = <T>() => Promise<ILogger<T>>

type IParameters = {
  from?: string
  to?: string
} & ({ tail: number } | { head: number })

interface ILogger<T> {
  log(key: string, value: T): Promise<void>
  follow(key: string, listener: (value: T) => void): IUnfollow
  query(key: string, parameters: IParameters): Promise<{ id: string; payload: string }>
  delete(key: string, parameters: IParameters): Promise<void>
}
