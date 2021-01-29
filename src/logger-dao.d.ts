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
  writeLog(id: string, payload: string): Promise<ILog>
  queryLogs(id: string, range: IRange): AsyncIterable<ILog>
  deleteLogs(id: string, range: IRange): Promise<void>

  getAllLoggerIds(): AsyncIterable<string>

  purgeByTimestamp(id: string, timestamp: number): Promise<void>
  purgeByLimit(id: string, limit: number): Promise<void>
}
