import { getDatabase } from './database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT logger_id
      FROM logger_token;
  `).all()
  return result.map(x => x['logger_id'])
}

export function getAllTokens(id: string): Array<{ token: string, write: boolean, read: boolean, delete: boolean }> {
  const result: Array<{
    token: string
    'write_permission': number
    'read_permission': number
    'delete_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , write_permission
         , read_permission
         , delete_permission
      FROM logger_token
     WHERE logger_id = $id;
  `).all({ id })
  return result.map(x => ({
    token: x['token']
  , write: x['write_permission'] === 1
  , read: x['read_permission'] === 1
  , delete: x['delete_permission'] === 1
  }))
}

export function hasWriteTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_token
              WHERE logger_id = $id
                AND write_permission = 1
           ) AS write_tokens_exist
  `).get({ id })
  return result['write_tokens_exist'] === 1
}

export function matchWriteToken({ token, id }: {
  token: string
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_token
              WHERE logger_id = $id
                AND token = $token
                AND write_permission = 1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setWriteToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO logger_token (token, logger_id, write_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, logger_id)
        DO UPDATE SET write_permission = 1;
  `).run({ token, id })
}

export function unsetWriteToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_token
         SET write_permission = 0
       WHERE token = $token
         AND logger_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

export function hasReadTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_token
              WHERE logger_id = $id
                AND read_permission = 1
           ) AS read_tokens_exist
  `).get({ id })
  return result['read_tokens_exist'] === 1
}

export function matchReadToken({ token, id }: {
  token: string;
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_token
              WHERE logger_id = $id
                AND token = $token
                AND read_permission = 1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setReadToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO logger_token (token, logger_id, read_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, logger_id)
        DO UPDATE SET read_permission = 1;
  `).run({ token, id })
}

export function unsetReadToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_token
         SET read_permission = 0
       WHERE token = $token
         AND logger_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

export function matchDeleteToken({ token, id }: {
  token: string;
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_token
              WHERE logger_id = $id
                AND token = $token
                AND delete_permission = 1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setDeleteToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO logger_token (token, logger_id, delete_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, logger_id)
        DO UPDATE SET delete_permission = 1;
  `).run({ token, id })
}

export function unsetDeleteToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_token
         SET delete_permission = 0
       WHERE token = $token
         AND logger_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

function deleteNoPermissionToken({ token, id }: { token: string, id: string }) {
  getDatabase().prepare(`
    DELETE FROM logger_token
     WHERE token = $token
       AND logger_id = $id
       AND write_permission = 0
       AND read_permission = 0
       AND delete_permission = 0;
  `).run({ token, id })
}
