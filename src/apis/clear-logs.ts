import { IRange } from '@src/contract.js'
import { clearLogs as _clearLogs } from '@dao/clear-logs.js'
import { eventHub, Event } from '@src/event-hub.js'

export function clearLogs(loggerId: string, range: IRange): void {
  _clearLogs(loggerId, range)

  eventHub.emit(loggerId, Event.LogRemoved)
}
