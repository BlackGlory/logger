import { IRange, ILog } from '@src/contract.js'
import { queryLogs as _queryLogs } from '@dao/query-logs.js'
import { JSONValue } from 'justypes'

/**
 * @throws {LoggerNotFound}
 */
export function queryLogs(loggerId: string, range: IRange): ILog[] {
  const logs = _queryLogs(loggerId, range)

  return logs.map(x => ({
    id: x.id
  , value: JSON.parse(x.value) as JSONValue
  }))
}
