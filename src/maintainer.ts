import { eventHub, Event } from '@src/event-hub.js'
import { setSchedule } from 'extra-timers'
import { SyncDestructor } from 'extra-defer'
import { purgeLogs } from '@dao/purge-logs.js'
import { getAllLoggerIds } from '@dao/get-all-logger-ids.js'
import { getFirstLogTimestamp } from '@dao/get-first-log-timestamp.js'
import { getLoggerConfiguration } from '@dao/get-logger-configuration.js'
import { isNumber } from '@blackglory/prelude'

const loggerIdToCancelSchedule: Map<string, () => void> = new Map()

export function startMaintainer(): () => void {
  const destructor = new SyncDestructor()

  destructor.defer(eventHub.onGlobal(Event.LoggerSet, loggerId => {
    purgeLogs(loggerId, Date.now())

    updateSchedule(loggerId)
  }))

  destructor.defer(eventHub.onGlobal(Event.LoggerRemoved, loggerId => {
    const cancelSchedule = loggerIdToCancelSchedule.get(loggerId)
    cancelSchedule?.()
    loggerIdToCancelSchedule.delete(loggerId)
  }))

  destructor.defer(eventHub.onGlobal(Event.LogWritten, loggerId => {
    purgeLogs(loggerId, Date.now())

    updateSchedule(loggerId)
  }))

  destructor.defer(eventHub.onGlobal(Event.LogRemoved, loggerId => {
    updateSchedule(loggerId)
  }))

  const loggerIds = getAllLoggerIds()
  const timestamp = Date.now()
  for (const loggerId of loggerIds) {
    purgeLogs(loggerId, timestamp)

    updateSchedule(loggerId)
  }

  return () => {
    destructor.execute()

    loggerIdToCancelSchedule.forEach(cancel => cancel())
    loggerIdToCancelSchedule.clear()
  }
}

function updateSchedule(loggerId: string): void {
  const cancelSchedule = loggerIdToCancelSchedule.get(loggerId)
  cancelSchedule?.()
  loggerIdToCancelSchedule.delete(loggerId)

  const config = getLoggerConfiguration(loggerId)
  if (!config) return

  const { timeToLive } = config
  if (
    isNumber(timeToLive) &&
    timeToLive > 0 &&
    Number.isFinite(timeToLive)
  ) {
    const timestamp = getFirstLogTimestamp(loggerId)
    if (isNumber(timestamp)) {
      const cancelSchedule = setSchedule(timestamp + timeToLive, () => {
        purgeLogs(loggerId, Date.now())
        updateSchedule(loggerId)
      })
      loggerIdToCancelSchedule.set(loggerId, cancelSchedule)
    }
  }
}
