import { writeLog } from './write-log.js'
import { queryLogs } from './query-logs.js'
import { deleteLogs } from './delete-logs.js'
import { purgeByLimit, purgeByTimestamp } from './purge.js'
import { getAllNamespaces } from './get-all-namespaces.js'

export const LoggerDAO: ILoggerDAO = {
  writeLog: asyncify(writeLog)
, queryLogs: asyncifyIterable(queryLogs)
, deleteLogs: asyncify(deleteLogs)

, getAllNamespaces: asyncifyIterable(getAllNamespaces)

, purgeByTimestamp: asyncify(purgeByTimestamp)
, purgeByLimit: asyncify(purgeByLimit)

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
