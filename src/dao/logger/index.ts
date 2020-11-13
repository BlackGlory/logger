import { writeLog } from './write-log'
import { queryLogs } from './query-logs'
import { deleteLogs } from './delete-logs'
import { purgeByLimit, purgeByTimestamp } from './purge'
import { getAllIdsWithPurgePolicies, getPurgePolicies, setNumberLimit, setTimeToLive, unsetNumberLimit, unsetTimeToLive } from './purge-policy'

export const LoggerDAO: ILoggerDAO = {
  writeLog: asyncify(writeLog)
, queryLogs: asyncifyIterable(queryLogs)
, deleteLogs: asyncify(deleteLogs)

, purgeByTimestamp: asyncify(purgeByTimestamp)
, purgeByLimit: asyncify(purgeByLimit)

, getAllIdsWithPurgePolicies: asyncify(getAllIdsWithPurgePolicies)
, getPurgePolicies: asyncify(getPurgePolicies)
, setTimeToLive: asyncify(setTimeToLive)
, unsetTimeToLive: asyncify(unsetTimeToLive)
, setNumberLimit: asyncify(setNumberLimit)
, unsetNumberLimit: asyncify(unsetNumberLimit)
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}

function asyncifyIterable<T extends any[], U>(fn: (...args: T) => Iterable<U>): (...args: T) => AsyncIterable<U> {
  return async function* (this: unknown, ...args: T): AsyncIterable<U> {
    yield* Reflect.apply(fn, this, args)
  }
}
