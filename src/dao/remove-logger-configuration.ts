import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const removeLoggerConfiguration = withLazyStatic((id: string): void => {
  lazyStatic(() => getDatabase().prepare(`
    DELETE FROM logger
     WHERE id = $id;
  `), [getDatabase()])
    .run({ id })
})
