import { getDatabase } from '@dao/data/database.js'

interface IRawLog {
  namespace: string
  payload: string
  timestamp: number
  number: number
}

export function setRawLog(raw: IRawLog): IRawLog {
  getDatabase().prepare(`
    INSERT INTO logger_log (
      namespace
    , payload
    , timestamp
    , number
    )
    VALUES (
      $namespace
    , $payload
    , $timestamp
    , $number
    );
  `).run(raw)

  return raw
}

export function getAllRawLogs(namespace: string): IRawLog[] {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_log
     WHERE namespace = $namespace
     ORDER BY timestamp ASC
            , number    ASC;
  `).all({ namespace })
}
