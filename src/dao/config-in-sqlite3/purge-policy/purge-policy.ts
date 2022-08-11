import { getDatabase } from '../database'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespacesWithPurgePolicies = withLazyStatic(function (): string[] {
  const result = lazyStatic(() => getDatabase().prepare(`
    SELECT namespace
      FROM logger_purge_policy;
  `), [getDatabase()]).all()

  return result.map(x => x['namespace'])
})

export const getPurgePolicies = withLazyStatic(function (namespace: string): {
  timeToLive: number | null
  numberLimit: number | null
} {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT time_to_live
         , number_limit
      FROM logger_purge_policy
     WHERE namespace = $namespace;
  `), [getDatabase()]).get({ namespace })

  if (row) {
    return {
      timeToLive: row['time_to_live']
    , numberLimit: row['number_limit']
    }
  } else {
    return { timeToLive: null, numberLimit: null }
  }
})

export const setTimeToLive = withLazyStatic(function (
  namespace: string
, timeToLive: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO logger_purge_policy (namespace, time_to_live)
    VALUES ($namespace, $timeToLive)
        ON CONFLICT(namespace)
        DO UPDATE SET time_to_live = $timeToLive;
  `), [getDatabase()]).run({ namespace, timeToLive })
})

export const unsetTimeToLive = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE logger_purge_policy
         SET time_to_live = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

export const setNumberLimit = withLazyStatic(function (
  namespace: string
, numberLimit: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO logger_purge_policy (namespace, number_limit)
    VALUES ($namespace, $numberLimit)
        ON CONFLICT(namespace)
        DO UPDATE SET number_limit = $numberLimit;
  `), [getDatabase()]).run({ namespace, numberLimit })
})

export const unsetNumberLimit = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().transaction((namespace: string) => {
    lazyStatic(() => getDatabase().prepare(`
      UPDATE logger_purge_policy
         SET number_limit = NULL
       WHERE namespace = $namespace;
    `), [getDatabase()]).run({ namespace })

    deleteNoPoliciesRow(namespace)
  }), [getDatabase()])(namespace)
})

const deleteNoPoliciesRow = withLazyStatic(function (namespace: string): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM logger_purge_policy
     WHERE namespace = $namespace
       AND time_to_live IS NULL
       AND number_limit IS NULL
  `), [getDatabase()]).run({ namespace })
})
