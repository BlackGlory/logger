import { getDatabase } from './database'

export function eliminateByTimestamp(id: string, timestamp: number): void {
  getDatabase().prepare(`
    DELETE FROM logger_log
     WHERE logger_id = $id
       AND timestamp < $timestamp;
  `).run({ id, timestamp })
}

export function eliminateByLimit(id: string, limit: number): void {
  getDatabase().prepare(`
    DELETE FROM logger_log
     WHERE logger_id = $id
     ORDER BY timestamp DESC
            , number    DESC
     LIMIT -1 OFFSET $limit;
  `).run({ id, limit })
}
