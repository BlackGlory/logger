type IUnfollow = () => void

export interface ISlice {
  from?: string
  to?: string
}

export interface ITail {
  tail: number
}

export interface IHead {
  head: number
}

export type IRange =
| ISlice
| (ISlice & IHead)
| (ISlice & ITail)

export interface ILog {
  id: string
  payload: string
}

export interface IAPI {
  isAdmin(password: string): boolean

  Logger: {
    write(namespace: string, value: string): void
    follow(namespace: string, listener: (log: ILog) => void): IUnfollow
    query(namespace: string, range: IRange): Iterable<ILog>
    del(namespace: string, range: IRange): void

    getAllNamespaces(): Iterable<string>
  }

  PurgePolicy: {
    purge(namespace: string): void

    getAllNamespaces(): string[]
    get(namespace: string): {
      timeToLive: number | null
      limit: number | null
    }

    setTimeToLive(namespace: string, timeToLive: number): void
    unsetTimeToLive(namespace: string): void

    setLimit(namespace: string, limit: number): void
    unsetLimit(namespace: string): void
  }
}
