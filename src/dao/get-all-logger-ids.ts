import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllLoggerIds = withLazyStatic((): string[] => {
  const rows = lazyStatic(() => getDatabase().prepare(`
    SELECT id
      FROM logger;
  `), [getDatabase()])
    .all() as Array<{ id: string }>

  return rows.map(row => row.id)
})
