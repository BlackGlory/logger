import { getDatabase } from '../database.js'
import { getTimestamp } from './utils/get-timestamp.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const writeLog = withLazyStatic(function (
  namespace: string
, payload: string
): string {
  return lazyStatic(() => getDatabase().transaction((namespace: string, payload: string) => {
    const timestamp = getTimestamp()

    const row: { number: number } = lazyStatic(() => getDatabase().prepare(`
      SELECT count AS number
        FROM logger_counter
       WHERE namespace = $namespace
         AND timestamp = $timestamp
    `), [getDatabase()]).get({ namespace, timestamp })

    const countUp = lazyStatic(() => getDatabase().prepare(`
      UPDATE logger_counter
          SET count = count + 1
        WHERE namespace = $namespace
          AND timestamp = $timestamp;
    `), [getDatabase()])

    const initCounter = lazyStatic(() => getDatabase().prepare(`
      INSERT INTO logger_counter (namespace, timestamp, count)
      VALUES ($namespace, $timestamp, 1)
          ON CONFLICT(namespace)
          DO UPDATE SET timestamp = $timestamp
                      , count = 1
    `), [getDatabase()])

    let number: number
    if (row) {
      number = row['number']
      countUp.run({ namespace, timestamp })
    } else {
      number = 0
      initCounter.run({ namespace, timestamp })
    }

    lazyStatic(() => getDatabase().prepare(`
      INSERT INTO logger_log (namespace, timestamp, number, payload)
      VALUES ($namespace, $timestamp, $number, $payload)
    `), [getDatabase()]).run({ namespace, timestamp, number, payload })

    return `${timestamp}-${number}`
  }), [getDatabase()])(namespace, payload)
})
