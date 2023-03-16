import { ILog, LoggerNotFound } from '@src/contract.js'
import { Event, eventHub } from '@src/event-hub.js'
import { Observable } from 'rxjs'
import { hasLogger } from '@dao/has-logger.js'
import { SyncDestructor } from 'extra-defer'

/**
 * @throws {LoggerNotFound}
 */
export function follow(loggerId: string): Observable<ILog> {
  if (!hasLogger(loggerId)) throw new LoggerNotFound()

  return new Observable<ILog>(observer => {
    const destructor = new SyncDestructor()

    destructor.defer(eventHub.onLogger(loggerId, Event.LogWritten, log => {
      observer.next(log)
    }))

    destructor.defer(eventHub.onceLogger(loggerId, Event.LoggerRemoved, () => {
      observer.complete()
    }))

    return () => destructor.execute()
  })
}
