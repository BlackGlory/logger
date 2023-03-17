import { Observable } from 'rxjs'
import { CustomError } from '@blackglory/errors'
import { JSONValue, JSONObject } from 'justypes'

export type LogId = `${number}-${number}`

export interface IRange {
  order: Order
  from?: LogId
  to?: LogId
  skip?: number
  limit?: number
}

export enum Order {
  Asc = 'asc'
, Desc = 'desc'
}

export interface ILoggerConfiguration extends JSONObject {
  timeToLive: number | null
  limit: number | null
}

export interface ILog {
  id: LogId
  content: JSONValue
}

export interface IAPI {
  getAllLoggerIds(): string[]

  setLogger(loggerId: string, config: ILoggerConfiguration): void
  getLogger(loggerId: string): ILoggerConfiguration | null
  removeLogger(loggerId: string): void

  /**
   * @throws {LoggerNotFound}
   */
  log(loggerId: string, content: JSONValue): LogId

  /**
   * @throws {LoggerNotFound}
   */
  follow(loggerId: string): Observable<ILog>

  /**
   * @throws {LoggerNotFound}
   */
  getLogs(loggerId: string, logIds: LogId[]): Array<ILog | null>

  removeLogs(loggerId: string, logIds: LogId[]): void

  /**
   * @throws {LoggerNotFound}
   */
  queryLogs(loggerId: string, range: IRange): ILog[]

  clearLogs(loggerId: string, range: IRange): void
}

export class LoggerNotFound extends CustomError {}
