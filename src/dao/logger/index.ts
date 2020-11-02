import { writeLog } from './write-log'
import { queryLogs } from './query-logs'
import { deleteLogs } from './delete-logs'
import { eliminateByLimit, eliminateByTimestamp } from './eliminate'
import { getEliminationPolicies, setNumberLimit, setTimeToLive, unsetNumberLimit, unsetTimeToLive } from './elimination-policy'

export const LoggerDAO: ILoggerDAO = {
  writeLog: asyncify(writeLog)
, queryLogs: asyncify(queryLogs)
, deleteLogs: asyncify(deleteLogs)
, eliminateByTimestamp: asyncify(eliminateByTimestamp)
, eliminateByLimit: asyncify(eliminateByLimit)
, getEliminationPolicies: asyncify(getEliminationPolicies)
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
