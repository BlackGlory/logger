import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const hasLogger = withLazyStatic((id: string): boolean => {
  const { matched } = lazyStatic(() => getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM logger
              WHERE id = $id
           ) AS matched;
  `), [getDatabase()])
    .get({ id }) as { matched: 1 | 0 }

  return !!matched
})
