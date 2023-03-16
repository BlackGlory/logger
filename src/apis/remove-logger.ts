import { removeLoggerConfiguration } from '@dao/remove-logger-configuration.js'
import { eventHub, Event } from '@src/event-hub.js'

export function removeLogger(loggerId: string): void {
  removeLoggerConfiguration(loggerId)

  eventHub.emit(loggerId, Event.LoggerRemoved)
}
