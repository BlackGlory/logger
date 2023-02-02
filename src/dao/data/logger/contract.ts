import { ILog, IRange } from '@api/contract.js'
export { ILog, IRange, ISlice, IHead, ITail } from '@api/contract.js'

export interface ILoggerDAO {
  writeLog(namespace: string, payload: string): string
  queryLogs(namespace: string, range: IRange): Iterable<ILog>
  deleteLogs(namespace: string, range: IRange): void

  getAllNamespaces(): Iterable<string>

  purgeByTimestamp(namespace: string, timestamp: number): void
  purgeByLimit(namespace: string, limit: number): void
}
