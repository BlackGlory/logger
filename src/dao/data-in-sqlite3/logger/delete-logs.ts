import { getDatabase } from '../database'
import { sql } from 'extra-sql-builder'
import { parseFrom } from './utils/parse-from'
import { parseTo } from './utils/parse-to'

export function deleteLogs(namespace: string, range: IRange): void {
  if ('head' in range) return deleteLogsBySliceWithHead(namespace, range)
  if ('tail' in range) return deleteLogsBySliceWithTail(namespace, range)
  return deleteLogsBySlice(namespace, range)
}

function deleteLogsBySlice(namespace: string, range: ISlice): void {
  const from = parseFrom(range)
  const to = parseTo(range)
  getDatabase().prepare(sql`
    DELETE FROM logger_log
     WHERE namespace = $namespace
    ${from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))'}
    ${to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))'}
  `).run({
    namespace
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  })
}

function deleteLogsBySliceWithHead(namespace: string, range: ISlice & IHead): void {
  const from = parseFrom(range)
  const to = parseTo(range)
  getDatabase().prepare(sql`
    DELETE FROM logger_log
     WHERE namespace = $namespace
    ${from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))'}
    ${to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))'}
     ORDER BY timestamp ASC
            , number    ASC
     LIMIT $head;
  `).run({
    namespace
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , head: range.head
  })
}

function deleteLogsBySliceWithTail(namespace: string, range: ISlice & ITail): void {
  const from = parseFrom(range)
  const to = parseTo(range)
  getDatabase().prepare(sql`
    DELETE FROM logger_log
     WHERE namespace = $namespace
    ${from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))'}
    ${to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))'}
     ORDER BY timestamp DESC
           , number    DESC
     LIMIT $tail;
  `).run({
    namespace
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , tail: range.tail
  })
}
