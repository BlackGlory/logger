import { getDatabase } from './database'

export function getAllIdsWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT logger_id
      FROM logger_token_policy;
  `).all()
  return result.map(x => x['logger_id'])
}

export function getTokenPolicies(id: string): {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
  deleteTokenRequired: boolean | null
} {
  const row: {
    'write_token_required': number | null
  , 'read_token_required': number | null
  , 'delete_token_required': number | null
  } = getDatabase().prepare(`
    SELECT write_token_required
         , read_token_required
         , delete_token_required
      FROM logger_token_policy
     WHERE logger_id = $id;
  `).get({ id })
  if (row) {
    const writeTokenRequired = row['write_token_required']
    const readTokenRequired = row['read_token_required']
    const deleteTokenRequired = row['delete_token_required']
    return {
      writeTokenRequired:
        writeTokenRequired === null
        ? null
        : numberToBoolean(writeTokenRequired)
    , readTokenRequired:
        readTokenRequired === null
        ? null
        : numberToBoolean(readTokenRequired)
    , deleteTokenRequired:
        deleteTokenRequired === null
        ? null
        : numberToBoolean(deleteTokenRequired)
    }
  } else {
    return {
      writeTokenRequired: null
    , readTokenRequired: null
    , deleteTokenRequired: null
    }
  }
}

export function setWriteTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO logger_token_policy (logger_id, write_token_required)
    VALUES ($id, $writeTokenRequired)
        ON CONFLICT(logger_id)
        DO UPDATE SET write_token_required = $writeTokenRequired;
  `).run({ id, writeTokenRequired: booleanToNumber(val) })
}

export function unsetWriteTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_token_policy
         SET write_token_required = NULL
       WHERE logger_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

export function setReadTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO logger_token_policy (logger_id, read_token_required)
    VALUES ($id, $readTokenRequired)
        ON CONFLICT(logger_id)
        DO UPDATE SET read_token_required = $readTokenRequired;
  `).run({ id, readTokenRequired: booleanToNumber(val) })
}

export function unsetReadTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_token_policy
         SET read_token_required = NULL
       WHERE logger_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

export function setDeleteTokenRequired(id: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO logger_token_policy (logger_id, delete_token_required)
    VALUES ($id, $deleteTokenRequired)
        ON CONFLICT(logger_id)
        DO UPDATE SET delete_token_required = $deleteTokenRequired;
  `).run({ id, deleteTokenRequired: booleanToNumber(val) })
}

export function unsetDeleteTokenRequired(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_token_policy
         SET delete_token_required = NULL
       WHERE logger_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

function deleteNoPoliciesRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM logger_token_policy
     WHERE logger_id = $id
       AND write_token_required = NULL
       AND read_token_required = NULL
       AND delete_token_required = NULL
  `).run({ id })
}

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}