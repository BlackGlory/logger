import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { LoggerNotFound, LogId } from '@src/contract.js'
import { parseLogId } from './utils/parse-log-id.js'
import { hasLogger } from './has-logger.js'

/**
 * @throws {LoggerNotFound}
 */
export const getLogs = withLazyStatic((
  loggerId: string
, logIds: LogId[]
): Array<string | null> => {
  return lazyStatic(() => getDatabase().transaction((
    loggerId: string
  , logIds: LogId[]
  ): Array<string | null> => {
    const getLogStatement = lazyStatic(() => getDatabase().prepare(`
      SELECT value
        FROM log
       WHERE logger_id = $loggerId
         AND timestamp = $timestamp
         AND number = $number;
    `), [getDatabase()])

    if (!hasLogger(loggerId)) throw new LoggerNotFound()

    return logIds.map(logId => {
      const { timestamp, number } = parseLogId(logId)

      const row = getLogStatement.get({
        loggerId
      , timestamp
      , number
      }) as { value: string } | undefined

      return row?.value ?? null
    })
  }), [getDatabase()])(loggerId, logIds)
})
