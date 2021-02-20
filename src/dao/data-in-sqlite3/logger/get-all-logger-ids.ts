import { getDatabase } from '../database'
import { map } from 'iterable-operator'

export function getAllLoggerIds(): Iterable<string> {
  const iter = getDatabase().prepare(`
    SELECT DISTINCT logger_id
      FROM logger_log;
  `).iterate()

  return map(iter, row => row['logger_id'])
}
