import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { LogId } from '@src/contract.js'
import { parseLogId } from './utils/parse-log-id.js'

export const removeLogs = withLazyStatic((
  loggerId: string
, logIds: LogId[]
): void => {
  return lazyStatic(() => getDatabase().transaction((
    loggerId: string
  , logIds: LogId[]
  ): void => {
    const removeLogStatement = lazyStatic(() => getDatabase().prepare(`
      DELETE FROM log
       WHERE logger_id = $loggerId
         AND timestamp = $timestamp
         AND number = $number;
    `), [getDatabase()])

    logIds.forEach(logId => {
      const { timestamp, number } = parseLogId(logId)

      removeLogStatement.run({
        loggerId
      , timestamp
      , number
      })
    })
  }), [getDatabase()])(loggerId, logIds)
})
