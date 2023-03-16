import { LogId } from '@src/contract.js'
import { removeLogs as _removeLogs } from '@dao/remove-logs.js'
import { eventHub, Event } from '@src/event-hub.js'

export function removeLogs(loggerId: string, logIds: LogId[]): void {
  _removeLogs(loggerId, logIds)

  eventHub.emit(loggerId, Event.LogRemoved)
}
