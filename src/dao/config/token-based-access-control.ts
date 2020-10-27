import { getDatabase } from './database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT logger_id
      FROM logger_tbac;
  `).all()
  return result.map(x => x['logger_id'])
}

export function getAllTokens(id: string): Array<{ token: string, log: boolean, follow: boolean }> {
  const result: Array<{
    token: string
    'log_permission': number
    'follow_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , log_permission
         , follow_permission
      FROM logger_tbac
     WHERE logger_id = $id;
  `).all({ id })
  return result.map(x => ({
    token: x['token']
  , log: x['log_permission'] === 1
  , follow: x['follow_permission'] === 1
  }))
}

export function hasLogTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_tbac
               WHERE logger_id = $id AND log_permission=1
           ) AS log_tokens_exist
  `).get({ id })
  return result['log_tokens_exist'] === 1
}

export function matchLogToken({ token, id }: {
  token: string
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_tbac
               WHERE logger_id = $id AND token = $token AND log_permission=1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setLogToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT log_permission
      FROM logger_tbac
     WHERE token = $token AND logger_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['log_permission'] === 0) {
      db.prepare(`
        UPDATE logger_tbac
           SET log_permission = 1
         WHERE token = $token AND logger_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO logger_tbac (token, logger_id, follow_permission, log_permission)
      VALUES ($token, $id, 0, 1);
    `).run({ token, id })
  }
}

export function unsetLogToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE logger_tbac
       SET log_permission = 0
     WHERE token = $token AND logger_id = $id;
  `).run({ token, id })
}

export function hasFollowTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_tbac
               WHERE logger_id = $id AND follow_permission=1
           ) AS follow_tokens_exist
  `).get({ id })
  return result['follow_tokens_exist'] === 1
}

export function matchFollowToken({ token, id }: {
  token: string;
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM logger_tbac
               WHERE logger_id = $id AND token = $token AND follow_permission=1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setFollowToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT follow_permission
      FROM logger_tbac
     WHERE token = $token AND logger_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['follow_permission'] === 0) {
      db.prepare(`
        UPDATE logger_tbac
           SET follow_permission = 1
         WHERE token = $token AND logger_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO logger_tbac (token, logger_id, follow_permission, log_permission)
      VALUES ($token, $id, 1, 0);
    `).run({ token, id })
  }
}

export function unsetFollowToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE logger_tbac
       SET follow_permission = 0
     WHERE token = $token AND logger_id = $id;
  `).run({ token, id })
}
