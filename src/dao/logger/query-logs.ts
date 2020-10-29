import { getDatabase } from './database'
import { concatStrings } from './utils/concat-strings'
import { parseFrom } from './utils/parse-from'
import { parseTo } from './utils/parse-to'

export function queryLogs(id: string, parameters: IQueryParameters): Iterable<{ id: string; payload: string }> {
  if ('head' in parameters) return queryLogsByHeadSliceParameters(id, parameters)
  if ('tail' in parameters) return queryLogsByTailSliceParameters(id, parameters)
  return queryLogsBySliceParameters(id, parameters)
}

function queryLogsBySliceParameters(id: string, parameters: SliceParameters): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(parameters)
  const to = parseTo(parameters)
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
  const rows = getDatabase().prepare(sql).iterate({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  })
  return rows
}

function queryLogsByHeadSliceParameters(id: string, parameters: IHeadSliceParameters): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(parameters)
  const to = parseTo(parameters)
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
  , head: parameters.head
  })
  return rows
}

function queryLogsByTailSliceParameters(id: string, parameters: ITailSliceParameters): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(parameters)
  const to = parseTo(parameters)
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
  , tail: parameters.tail
  })
  return rows
}
