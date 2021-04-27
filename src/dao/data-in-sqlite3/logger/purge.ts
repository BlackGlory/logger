import { getDatabase } from '../database'

export function purgeByTimestamp(namespace: string, timestamp: number): void {
  getDatabase().prepare(`
    DELETE FROM logger_log
     WHERE namespace = $namespace
       AND timestamp < $timestamp;
  `).run({ namespace, timestamp })
}

export function purgeByLimit(namespace: string, limit: number): void {
  getDatabase().prepare(`
    DELETE FROM logger_log
     WHERE namespace = $namespace
     ORDER BY timestamp DESC
            , number    DESC
     LIMIT -1
    OFFSET $limit;
  `).run({ namespace, limit })
}
