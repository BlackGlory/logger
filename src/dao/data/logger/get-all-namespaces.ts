import { getDatabase } from '../database.js'
import { map } from 'iterable-operator'
import { withLazyStatic, lazyStatic } from 'extra-lazy'

export const getAllNamespaces = withLazyStatic((): Iterable<string> => {
  const iter = lazyStatic(() => getDatabase().prepare(`
    SELECT DISTINCT namespace
      FROM logger_log;
  `), [getDatabase()]).iterate()

  return map(iter, row => row['namespace'])
})
