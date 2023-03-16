import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getFirstLogTimestamp = withLazyStatic((loggerId: string): number | null => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT timestamp
      FROM log
     WHERE logger_id = $loggerId
     ORDER BY timestamp ASC
     LIMIT 1
  `), [getDatabase()])
    .get({ loggerId }) as { timestamp: number } | undefined

  return row?.timestamp ?? null
})
