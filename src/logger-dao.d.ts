interface ISlice {
  from?: string
  to?: string
}

interface ITail {
  tail: number
}

interface IHead {
  head: number
}

type IRange =
| ISlice
| (ISlice & IHead)
| (ISlice & ITail)

interface ILoggerDAO {
  writeLog(namespace: string, payload: string): Promise<string>
  queryLogs(namespace: string, range: IRange): AsyncIterable<ILog>
  deleteLogs(namespace: string, range: IRange): Promise<void>

  getAllNamespaces(): AsyncIterable<string>

  purgeByTimestamp(namespace: string, timestamp: number): Promise<void>
  purgeByLimit(namespace: string, limit: number): Promise<void>
}
