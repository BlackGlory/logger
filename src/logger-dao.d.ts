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
  writeLog(id: string, payload: string): Promise<void>
  queryLogs(id: string, range: IRange): AsyncIterable<{
    id: string
    payload: string
  }>
  deleteLogs(id: string, range: IRange): Promise<void>

  purgeByTimestamp(id: string, timestamp: number): Promise<void>
  purgeByLimit(id: string, limit: number): Promise<void>

  getAllIdsWithPurgePolicies(): Promise<string[]>
  getPurgePolicies(id: string): Promise<{
    timeToLive: number | null
    numberLimit: number | null
  }>
  setTimeToLive(id: string, timeToLive: number): Promise<void>
  unsetTimeToLive(id: string): Promise<void>
  setNumberLimit(id: string, numberLimit: number): Promise<void>
  unsetNumberLimit(id: string): Promise<void>
}
