import { getDatabase } from './database'
import { concatStrings } from './utils/concat-strings'
import { parseFrom } from './utils/parse-from'
import { parseTo } from './utils/parse-to'

export function deleteLogs(id: string, parameters: IQueryParameters): void {
  if ('head' in parameters) return deleteLogsByHeadSliceParameters(id, parameters)
  if ('tail' in parameters) return deleteLogsByTailSliceParameters(id, parameters)
  return deleteLogsBySliceParameters(id, parameters)
}

function deleteLogsBySliceParameters(id: string, parameters: SliceParameters): void {
  const from = parseFrom(parameters)
  const to = parseTo(parameters)
  const sql = concatStrings`
    DELETE FROM logger_log
     WHERE logger_id = $id
    ${ from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))' }
    ${ to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))' }
  `
  getDatabase().prepare(sql).run({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  })
}

function deleteLogsByHeadSliceParameters(id: string, parameters: IHeadSliceParameters): void {
  const from = parseFrom(parameters)
  const to = parseTo(parameters)
  const sql = concatStrings`
    DELETE FROM logger_log
     WHERE logger_id = $id
    ${ from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))' }
    ${ to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))' }
     ORDER BY timestamp ASC
            , number    ASC
     LIMIT $head;
  `
  getDatabase().prepare(sql).run({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , head: parameters.head
  })
}

function deleteLogsByTailSliceParameters(id: string, parameters: ITailSliceParameters): void {
  const from = parseFrom(parameters)
  const to = parseTo(parameters)
  const sql = concatStrings`
    DELETE FROM logger_log
     WHERE logger_id = $id
    ${ from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))' }
    ${ to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))' }
     ORDER BY timestamp DESC
            , number    DESC
     LIMIT $tail;
  `
  getDatabase().prepare(sql).run({
    id
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , tail: parameters.tail
  })
}
