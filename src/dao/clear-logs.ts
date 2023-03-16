import { getDatabase } from '@src/database.js'
import { sql } from 'extra-sql-builder'
import { convertOrderToSQLOrder } from './utils/convert-order-to-sql-order.js'
import { IRange } from '@src/contract.js'
import { parseLogId } from './utils/parse-log-id.js'

export function clearLogs(loggerId: string, range: IRange): void {
  const from = range.from && parseLogId(range.from)
  const to = range.to && parseLogId(range.to)

  getDatabase()
    .prepare(sql`
      DELETE FROM log
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
    .run({
      loggerId
    , fromTimestamp: from?.timestamp
    , fromNumber: from?.number
    , toTimestamp: to?.timestamp
    , toNumber: to?.number
    , limit: range.limit ?? -1
    , offset: range.skip ?? 0
    })
}
