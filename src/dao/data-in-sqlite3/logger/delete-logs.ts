import { getDatabase } from '../database'
import { concatStrings } from './utils/concat-strings'
import { parseFrom } from './utils/parse-from'
import { parseTo } from './utils/parse-to'

export function deleteLogs(id: string, range: IRange): void {
  if ('head' in range) return deleteLogsBySliceWithHead(id, range)
  if ('tail' in range) return deleteLogsBySliceWithTail(id, range)
  return deleteLogsBySlice(id, range)
}

function deleteLogsBySlice(id: string, range: ISlice): void {
  const from = parseFrom(range)
  const to = parseTo(range)
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

function deleteLogsBySliceWithHead(id: string, range: ISlice & IHead): void {
  const from = parseFrom(range)
  const to = parseTo(range)
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
  , head: range.head
  })
}

function deleteLogsBySliceWithTail(id: string, range: ISlice & ITail): void {
  const from = parseFrom(range)
  const to = parseTo(range)
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
  , tail: range.tail
  })
}
