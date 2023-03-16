import { getDatabase } from '@src/database.js'

interface IRawLog {
  logger_id: string
  timestamp: number
  number: number
  payload: string
}

interface IRawLogger {
  id: string
  time_to_live: number | null
  quantity_limit: number | null
}

export function setRawLogger(raw: IRawLogger): IRawLogger {
  getDatabase().prepare(`
    INSERT INTO logger (
      id
    , time_to_live
    , quantity_limit
    )
    VALUES (
      $id
    , $time_to_live
    , $quantity_limit
    );
  `)
    .run(raw)

  return raw
}

export function hasRawLogger(loggerId: string): boolean {
  return !!getRawLogger(loggerId)
}

export function getRawLogger(loggerId: string): IRawLogger | undefined {
  const row = getDatabase().prepare(`
    SELECT *
      FROM logger
     WHERE id = $id;
  `)
    .get({ id: loggerId }) as IRawLogger | undefined

  if (row) {
    return { ...row }
  } else {
    return undefined
  }
}

export function setRawLog(raw: IRawLog): IRawLog {
  getDatabase().prepare(`
    INSERT INTO log (
      logger_id
    , timestamp
    , number
    , payload
    )
    VALUES (
      $logger_id
    , $timestamp
    , $number
    , $payload
    );
  `)
    .run(raw)

  return raw
}

export function hasRawLog(loggerId: string, timestamp: number, number: number): boolean {
  return !!getRawLog(loggerId, timestamp, number)
}

export function getRawLog(
  loggerId: string
, timestamp: number
, number: number
): IRawLog | undefined {
  const row = getDatabase().prepare(`
    SELECT *
      FROM log
     WHERE logger_id = $loggerId
       AND timestamp = $timestamp
       AND number = $number
  `)
    .get({
      loggerId
    , timestamp
    , number
    }) as IRawLog | undefined

  if (row) {
    return { ...row }
  } else {
    return undefined
  }
}
