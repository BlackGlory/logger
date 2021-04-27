import { getDatabase } from '../database'
import { getTimestamp } from './utils/get-timestamp'

export function writeLog(namespace: string, payload: string): string {
  let number
  const timestamp = getTimestamp()
  const db = getDatabase()

  db.transaction(() => {
    const row: { number: number } = db.prepare(`
      SELECT count AS number
        FROM logger_counter
       WHERE namespace = $namespace
         AND timestamp = $timestamp
    `).get({ namespace, timestamp })

    if (row) {
      number = row['number']
      db.prepare(`
        UPDATE logger_counter
           SET count = count + 1
         WHERE namespace = $namespace
           AND timestamp = $timestamp;
      `).run({ namespace, timestamp })
    } else {
      number = 0
      db.prepare(`
        INSERT INTO logger_counter (namespace, timestamp, count)
        VALUES ($namespace, $timestamp, 1)
            ON CONFLICT(namespace)
            DO UPDATE SET timestamp = $timestamp
                        , count = 1
      `).run({ namespace, timestamp })
    }

    db.prepare(`
      INSERT INTO logger_log (namespace, timestamp, number, payload)
      VALUES ($namespace, $timestamp, $number, $payload)
    `).run({ namespace, timestamp, number, payload })
  })()

  return `${timestamp}-${number}`
}
