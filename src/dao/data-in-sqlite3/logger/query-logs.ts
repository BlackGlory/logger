import { sql } from 'extra-sql-builder'
import { getDatabase } from '../database'
import { parseFrom } from './utils/parse-from'
import { parseTo } from './utils/parse-to'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export function queryLogs(
  namespace: string
, range: IRange
): Iterable<{ id: string; payload: string }> {
  if ('head' in range) return queryLogsBySliceWithHead(namespace, range)
  if ('tail' in range) return queryLogsBySliceWithTail(namespace, range)
  return queryLogsBySlice(namespace, range)
}

const queryLogsBySlice = withLazyStatic(function (
  namespace: string
, range: ISlice
): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(range)
  const to = parseTo(range)

  const rows = lazyStatic(() => getDatabase().prepare(sql`
    SELECT timestamp || '-' || number AS id
         , payload
      FROM logger_log
     WHERE namespace = $namespace
    ${from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))'}
    ${to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))'}
     ORDER BY timestamp ASC
            , number    ASC;
  `), [getDatabase()]).iterate({
    namespace
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  })
  return rows
})

const queryLogsBySliceWithHead = withLazyStatic(function (
  namespace: string
, range: ISlice & IHead
): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(range)
  const to = parseTo(range)

  const rows = lazyStatic(() => getDatabase().prepare(sql`
    SELECT timestamp || '-' || number AS id
         , payload
      FROM logger_log
     WHERE namespace = $namespace
    ${from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))'}
    ${to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))'}
     ORDER BY timestamp ASC
            , number    ASC
     LIMIT $head;
  `), [getDatabase()]).iterate({
    namespace
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , head: range.head
  })
  return rows
})

const queryLogsBySliceWithTail = withLazyStatic(function (
  namespace: string
, range: ISlice & ITail
): Iterable<{ id: string; payload: string }> {
  const from = parseFrom(range)
  const to = parseTo(range)

  const rows = lazyStatic(() => getDatabase().prepare(sql`
    SELECT timestamp || '-' || number AS id
         , payload
      FROM (
             SELECT timestamp
                  , number
                  , payload
               FROM logger_log
              WHERE namespace = $namespace
             ${from && 'AND (timestamp > $fromTimestamp OR (timestamp = $fromTimestamp AND number >= $fromNumber))'}
             ${to   && 'AND (timestamp < $toTimestamp OR (timestamp = $toTimestamp AND number <= $toNumber))'}
              ORDER BY timestamp DESC
                     , number    DESC
              LIMIT $tail
           )
     ORDER BY timestamp ASC
            , number    ASC;
  `), [getDatabase()]).iterate({
    namespace
  , fromTimestamp: from?.timestamp
  , fromNumber: from?.number
  , toTimestamp: to?.timestamp
  , toNumber: to?.number
  , tail: range.tail
  })
  return rows
})
