import { eventHub, Event } from '@src/event-hub.js'
import { setSchedule } from 'extra-timers'
import { SyncDestructor } from 'extra-defer'
import { purgeLogs } from '@dao/purge-logs.js'
import { getAllLoggerIds } from '@dao/get-all-logger-ids.js'
import { getFirstLogTimestamp } from '@dao/get-first-log-timestamp.js'
import { getLoggerConfiguration } from '@dao/get-logger-configuration.js'
import { isNumber } from '@blackglory/prelude'

const loggerIdToCancelSchedule: Map<string, () => void> = new Map()
const loggerIdToTimeToLive: Map<string, number> = new Map()

export function startMaintainer(): () => void {
  const destructor = new SyncDestructor()

  destructor.defer(eventHub.onGlobal(Event.LoggerSet, loggerId => {
    purgeLogs(loggerId, Date.now())

    updateTimeToLive(loggerId)
    updateSchedule(loggerId)
  }))

  destructor.defer(eventHub.onGlobal(Event.LoggerRemoved, loggerId => {
    const cancelSchedule = loggerIdToCancelSchedule.get(loggerId)
    cancelSchedule?.()

    loggerIdToTimeToLive.delete(loggerId)
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
    updateTimeToLive(loggerId)
    updateSchedule(loggerId)
  }

  return () => {
    destructor.execute()

    loggerIdToCancelSchedule.forEach(cancel => cancel())
    loggerIdToCancelSchedule.clear()
    loggerIdToTimeToLive.clear()
  }
}

function updateTimeToLive(loggerId: string): void {
  const config = getLoggerConfiguration(loggerId)
  if (config?.timeToLive) {
    loggerIdToTimeToLive.set(loggerId, config.timeToLive)
  } else {
    loggerIdToTimeToLive.delete(loggerId)
  }
}

/**
 * 出于性能考虑, 该函数依赖于loggerIdToTimeToLive, 而不是查询数据库.
 * 在调用此函数前, 请确保loggerIdToTimeToLive里的记录为最新.
 */
function updateSchedule(loggerId: string): void {
  const cancelSchedule = loggerIdToCancelSchedule.get(loggerId)
  cancelSchedule?.()

  const timeToLive = loggerIdToTimeToLive.get(loggerId)
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
