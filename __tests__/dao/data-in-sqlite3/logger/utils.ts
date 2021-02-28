import { getDatabase } from '@dao/data-in-sqlite3/database'

interface IRawLog {
  logger_id: string
  payload: string
  timestamp: number
  number: number
}

export function setRawLog(item: IRawLog): IRawLog {
  getDatabase().prepare(`
    INSERT INTO logger_log (
      logger_id
    , payload
    , timestamp
    , number
    )
    VALUES (
      $logger_id
    , $payload
    , $timestamp
    , $number
    );
  `).run(item)

  return item
}

export function getAllRawLogs(id: string): IRawLog[] {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_log
     WHERE logger_id = $id
     ORDER BY timestamp ASC
            , number    ASC;
  `).all({ id })
}
