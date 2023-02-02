import { getDatabase } from '../database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const purgeByTimestamp = withLazyStatic(function (
  namespace: string
, timestamp: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM logger_log
     WHERE namespace = $namespace
       AND timestamp < $timestamp;
  `), [getDatabase()]).run({ namespace, timestamp })
})

export const purgeByLimit = withLazyStatic(function (
  namespace: string
, limit: number
): void {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM logger_log
     WHERE namespace = $namespace
     ORDER BY timestamp DESC
            , number    DESC
     LIMIT -1
    OFFSET $limit;
  `), [getDatabase()]).run({ namespace, limit })
})
