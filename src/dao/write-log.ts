import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { hasLogger } from './has-logger.js'
import { LogId, LoggerNotFound } from '@src/contract.js'

export const writeLog = withLazyStatic((
  loggerId: string
, payload: string
, timestamp: number
): LogId => {
  return lazyStatic(() => getDatabase().transaction((
    loggerId: string
  , payload: string
  , timestamp: number
  ): LogId => {
    const insertStatement = lazyStatic(() => getDatabase().prepare(`
      INSERT INTO log (logger_id, timestamp, number, payload)
      VALUES ($loggerId, $timestamp, $number, $payload)
    `), [getDatabase()])

    const lastLogStatement = lazyStatic(() => getDatabase().prepare(`
      SELECT timestamp
           , number
        FROM log
       WHERE logger_id = $loggerId
       ORDER BY timestamp DESC
              , number DESC
       LIMIT 1
    `), [getDatabase()])

    if (!hasLogger(loggerId)) throw new LoggerNotFound()

    const lastLog = lastLogStatement.get({ loggerId }) as {
        timestamp: number
        number: number
      } | undefined

    const number = lastLog?.timestamp === timestamp
                 ? lastLog.number + 1
                 : 0

    insertStatement.run({
      loggerId
    , timestamp
    , number
    , payload
    })

    return `${timestamp}-${number}`
  }), [getDatabase()])(loggerId, payload, timestamp)
})
