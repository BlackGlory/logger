import { JSONValue } from '@blackglory/prelude'
import { writeLog } from '@dao/write-log.js'
import { eventHub, Event } from '@src/event-hub.js'
import { LogId } from '@src/contract.js'

/**
 * @throws {LoggerNotFound}
 */
export function log(loggerId: string, value: JSONValue): LogId {
  const logId = writeLog(loggerId, JSON.stringify(value), Date.now())

  eventHub.emit(loggerId, Event.LogWritten, {
    id: logId
  , value
  })

  return logId
}
