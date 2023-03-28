import { ILoggerConfig } from '@src/contract.js'
import { setLoggerConfiguration } from '@dao/set-logger-configuration.js'
import { eventHub, Event } from '@src/event-hub.js'

export function setLogger(loggerId: string, config: ILoggerConfig): void {
  setLoggerConfiguration(loggerId, config)

  eventHub.emit(loggerId, Event.LoggerSet)
}
