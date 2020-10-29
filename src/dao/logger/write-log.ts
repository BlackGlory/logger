import { getDatabase } from './database'
import { getTimestamp } from './utils/get-timestamp'

export function writeLog(id: string, payload: string): void {
  const db = getDatabase()
  db.transaction(() => {
    const timestamp = getTimestamp()
    let number
    const row: { number: number } = db.prepare(`
      SELECT count AS number
        FROM logger_counter
       WHERE logger_id = $id
         AND timestamp = $timestamp
    `).get({ id, timestamp })
    if (row) {
      number = row['number']
      db.prepare(`
        UPDATE logger_counter
           SET count = count + 1
         WHERE logger_id = $id
           AND timestamp = $timestamp;
      `).run({ id, timestamp })
    } else {
      number = 0
      db.prepare(`
        INSERT INTO logger_counter (logger_id, timestamp, count)
        VALUES ($id, $timestamp, 1)
            ON CONFLICT(logger_id)
            DO UPDATE SET timestamp = $timestamp
                        , count = 1
      `).run({ id, timestamp })
    }
    db.prepare(`
      INSERT INTO logger_log (logger_id, timestamp, number, payload)
      VALUES ($id, $timestamp, $number, $payload)
    `).run({ id, timestamp, number, payload })
  })()
}
