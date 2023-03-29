import { LogId } from '@src/contract.js'
import { getLogs as _getLogs } from '@dao/get-logs.js'
import { isntNull, JSONValue } from '@blackglory/prelude'

/**
 * @throws {LoggerNotFound}
 */
export function getLogs(
  loggerId: string
, logIds: LogId[]
): Array<JSONValue | null> {
  const logs = _getLogs(loggerId, logIds)

  return logs.map(payload => {
    if (isntNull(payload)) {
      return JSON.parse(payload) as JSONValue
    } else {
      return null
    }
  })
}
