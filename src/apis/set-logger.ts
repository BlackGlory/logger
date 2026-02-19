import { ILoggerConfig } from '@src/contract.js'
import { setLoggerConfiguration } from '@dao/set-logger-configuration.js'
import { eventHub, Event } from '@src/event-hub.js'
import { assert } from '@blackglory/errors'
import { isNull } from '@blackglory/prelude'

export function setLogger(loggerId: string, config: ILoggerConfig): void {
  assert(
    isNull(config.timeToLive) ||
    (
      Number.isInteger(config.timeToLive) &&
      config.timeToLive >= 0
    )
  , 'The config.timeToLive must be a non-negative integer or null.'
  )
  assert(
    isNull(config.limit) ||
    (
      Number.isInteger(config.limit) &&
      config.limit >= 0
    )
  , 'The config.limit must be a non-negative integer or null.'
  )

  setLoggerConfiguration(loggerId, config)

  eventHub.emit(loggerId, Event.LoggerSet)
}
