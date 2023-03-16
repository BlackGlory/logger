import { ILoggerConfiguration } from '@src/contract.js'
import { setLoggerConfiguration } from '@dao/set-logger-configuration.js'
import { eventHub, Event } from '@src/event-hub.js'

export function setLogger(loggerId: string, config: ILoggerConfiguration): void {
  setLoggerConfiguration(loggerId, config)

  eventHub.emit(loggerId, Event.LoggerSet)
}
