import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { getLoggerConfiguration } from './get-logger-configuration.js'

export const purgeLogs = withLazyStatic((loggerId: string, timestamp: number): void => {
  lazyStatic(() => getDatabase().transaction((
    loggerId: string
  , timestamp: number
  ): void => {
    const purgeByTimestampStatement = lazyStatic(() => getDatabase().prepare(`
      DELETE FROM log
       WHERE logger_id = $loggerId
         AND timestamp <= $timestamp;
    `), [getDatabase()])

    const purgeByLimitStatement = lazyStatic(() => getDatabase().prepare(`
      DELETE FROM log
       WHERE logger_id = $loggerId
       ORDER BY timestamp DESC
              , number    DESC
       LIMIT -1
      OFFSET $limit;
    `), [getDatabase()])

    const config = getLoggerConfiguration(loggerId)

    if (config) {
      if (config.timeToLive) {
        purgeByTimestampStatement.run({
          loggerId
        , timestamp: timestamp - config.timeToLive
        })
      }

      if (config.limit) {
        purgeByLimitStatement.run({
          loggerId
        , limit: config.limit
        })
      }
    }
  }), [getDatabase()])(loggerId, timestamp)
})
