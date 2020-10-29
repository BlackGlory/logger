type IUnfollow = () => void

type ILoggerFactory = <T>() => Promise<ILogger<T>>

interface SliceParameters {
  from?: string
  to?: string
}

interface ITailSliceParameters extends SliceParameters {
  tail: number
}

interface IHeadSliceParameters extends SliceParameters {
  head: number
}

type IQueryParameters =
| SliceParameters
| ITailSliceParameters
| IHeadSliceParameters

interface ILogger<T> {
  log(key: string, value: T): Promise<void>
  follow(key: string, listener: (value: T) => void): IUnfollow
  query(key: string, parameters: IQueryParameters): Promise<{ id: string; payload: string }>
  delete(key: string, parameters: IQueryParameters): Promise<void>
}
