import { IRange, ILog } from '@src/contract.js'
import { queryLogs as _queryLogs } from '@dao/query-logs.js'
import { JSONValue } from 'justypes'

export function queryLogs(loggerId: string, range: IRange): ILog[] | null {
  const logs = _queryLogs(loggerId, range)

  if (logs) {
    return logs.map(x => ({
      id: x.id
    , content: JSON.parse(x.payload) as JSONValue
    }))
  } else {
    return null
  }
}
