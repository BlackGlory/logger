import { getDatabase } from './database'
import { concatStrings } from './utils/concat-strings'
import { parseFrom } from './utils/parse-from'
import { parseTo } from './utils/parse-to'

export function queryLogs(id: string, range: IRange): Iterable<{ id: string; payload: string }> {
  if ('head' in range) return queryLogsBySliceWithHead(id, range)
  if ('tail' in range) return queryLogsBySliceWithTail(id, range)
  return queryLogsBySlice(id, range)
}

function queryLogsBySlice(id: string, range: ISlice): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(range)
  const to = parseTo(range)
  const sql = concatStrings`
    SELECT timestamp || '-' || number AS id
         , payload
      FROM logger_log
     WHERE logger_id = $id
    ${ from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))' }
    ${ to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))' }
     ORDER BY timestamp ASC
            , number    ASC;
  `
  const rows = getDatabase().prepare(sql).all({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  })
  return rows
}

function queryLogsBySliceWithHead(id: string, range: ISlice & IHead): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(range)
  const to = parseTo(range)
  const sql = concatStrings`
    SELECT timestamp || '-' || number AS id
         , payload
      FROM logger_log
     WHERE logger_id = $id
    ${ from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))' }
    ${ to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))' }
     ORDER BY timestamp ASC
            , number    ASC
     LIMIT $head;
  `
  const rows = getDatabase().prepare(sql).iterate({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , head: range.head
  })
  return rows
}

function queryLogsBySliceWithTail(id: string, range: ISlice & ITail): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(range)
  const to = parseTo(range)
  const sql = concatStrings`
    SELECT timestamp || '-' || number AS id
         , payload
      FROM (
             SELECT timestamp
                  , number
                  , payload
               FROM logger_log
              WHERE logger_id = $id
             ${ from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))' }
             ${ to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))' }
              ORDER BY timestamp DESC
                     , number    DESC
              LIMIT $tail
           )
     ORDER BY timestamp ASC
            , number    ASC;
  `
  const rows = getDatabase().prepare(sql).iterate({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , tail: range.tail
  })
  return rows
}
