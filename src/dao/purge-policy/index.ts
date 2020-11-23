import { getAllIdsWithPurgePolicies, getPurgePolicies, setNumberLimit, setTimeToLive, unsetNumberLimit, unsetTimeToLive } from './purge-policy'

export const PurgePolicyDAO: IPurgePolicyDAO = {
  getAllIdsWithPurgePolicies: asyncify(getAllIdsWithPurgePolicies)
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
