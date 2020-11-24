import { getDatabase } from '../database'

export function getAllBlacklistItems(): string[] {
  const result = getDatabase().prepare(`
    SELECT logger_id FROM logger_blacklist;
  `).all()
  return result.map(x => x['logger_id'])
}

export function inBlacklist(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_blacklist
              WHERE logger_id = $id
           ) AS exist_in_blacklist;
  `).get({ id })
  return result['exist_in_blacklist'] === 1
}

export function addBlacklistItem(id: string) {
  try {
    getDatabase().prepare(`
      INSERT INTO logger_blacklist (logger_id)
      VALUES ($id);
    `).run({ id })
  } catch {}
}

export function removeBlacklistItem(id: string) {
  getDatabase().prepare(`
    DELETE FROM logger_blacklist
     WHERE logger_id = $id;
  `).run({ id })
}
