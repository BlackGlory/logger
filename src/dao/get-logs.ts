import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { LogId } from '@src/contract.js'
import { parseLogId } from './utils/parse-log-id.js'
import { hasLogger } from './has-logger.js'

export const getLogs = withLazyStatic((
  loggerId: string
, logIds: LogId[]
): Array<string | null> | null => {
  return lazyStatic(() => getDatabase().transaction((
    loggerId: string
  , logIds: LogId[]
  ): Array<string | null> | null => {
    const getLogStatement = lazyStatic(() => getDatabase().prepare(`
      SELECT payload
        FROM log
       WHERE logger_id = $loggerId
         AND timestamp = $timestamp
         AND number = $number;
    `), [getDatabase()])

    if (!hasLogger(loggerId)) return null

    return logIds.map(logId => {
      const { timestamp, number } = parseLogId(logId)

      const row = getLogStatement.get({
        loggerId
      , timestamp
      , number
      }) as { payload: string } | undefined

      return row?.payload ?? null
    })
  }), [getDatabase()])(loggerId, logIds)
})
