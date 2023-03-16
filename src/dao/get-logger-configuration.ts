import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { ILoggerConfiguration } from '@src/contract.js'

export const getLoggerConfiguration = withLazyStatic((
  id: string
): ILoggerConfiguration | null => {
  const row = lazyStatic(() => getDatabase().prepare(`
    SELECT time_to_live
         , quantity_limit
      FROM logger
     WHERE id = $id;
  `), [getDatabase()])
    .get({ id }) as {
      time_to_live: number | null
      quantity_limit: number | null
    }

  if (!row) return null

  return {
    timeToLive: row.time_to_live
  , limit: row.quantity_limit
  }
})
