import { sql } from 'extra-sql-builder'
import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { parseLogId } from './utils/parse-log-id.js'
import { convertOrderToSQLOrder } from './utils/convert-order-to-sql-order.js'
import { LogId, IRange, LoggerNotFound } from '@src/contract.js'
import { hasLogger } from './has-logger.js'

/**
 * @throw {LoggerNotFound}
 */
export const queryLogs = withLazyStatic((loggerId: string, range: IRange): Array<{
  id: LogId
  value: string
}> => {
  return lazyStatic(() => getDatabase().transaction((
    loggerId: string
  , range: IRange
  ): Array<{
    id: LogId
    value: string
  }> => {
    if (!hasLogger(loggerId)) throw new LoggerNotFound()

    const from = range.from && parseLogId(range.from)
    const to = range.to && parseLogId(range.to)

    const rows = getDatabase()
      .prepare(sql`
        SELECT timestamp || '-' || number AS id
            , value
          FROM log
        WHERE logger_id = $loggerId

        ${from && `
          AND (
                timestamp > $fromTimestamp
                OR
                (
                  timestamp = $fromTimestamp
                  AND
                  number >= $fromNumber
                )
              )`}

        ${to && `
          AND (
                timestamp < $toTimestamp
                OR
                (
                  timestamp = $toTimestamp
                  AND
                  number <= $toNumber
                )
              )`}

        ORDER BY timestamp ${convertOrderToSQLOrder(range.order)}
                , number    ${convertOrderToSQLOrder(range.order)}
        LIMIT $limit
        OFFSET $offset;
      `)
      .all({
        loggerId
      , fromTimestamp: from?.timestamp
      , fromNumber: from?.number
      , toTimestamp: to?.timestamp
      , toNumber: to?.number
      , limit: range.limit ?? -1
      , offset: range.skip ?? 0
      }) as Array<{
        id: LogId
        value: string
      }>

    return rows
  }), [getDatabase()])(loggerId, range)
})
