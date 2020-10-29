import { getDatabase } from './database'

export function getEliminationPolicies(id: string): { timeToLive: number | null, numberLimit: number | null } {
  const row = getDatabase().prepare(`
    SELECT time_to_live
         , number_limit
      FROM logger_elimination_policy
     WHERE logger_id = $id
  `).get({ id })
  if (row) {
    return {
      timeToLive: row['time_to_live']
    , numberLimit: row['number_limit']
    }
  } else {
    return { timeToLive: null, numberLimit: null }
  }
}

export function setTimeToLive(id: string, timeToLive: number): void {
  getDatabase().prepare(`
    INSERT INTO logger_elimination_policy (logger_id, time_to_live)
    VALUES ($id, $timeToLive)
        ON CONFLICT(logger_id)
        DO UPDATE SET time_to_live = $timeToLive;
  `).run({ id, timeToLive })
}

export function unsetTimeToLive(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_elimination_policy
         SET time_to_live = NULL
       WHERE logger_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

export function setNumberLimit(id: string, numberLimit: number): void {
  getDatabase().prepare(`
    INSERT INTO logger_elimination_policy (logger_id, number_limit)
    VALUES ($id, $numberLimit)
        ON CONFLICT(logger_id)
        DO UPDATE SET number_limit = $numberLimit;
  `).run({ id, numberLimit })
}

export function unsetNumberLimit(id: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_elimination_policy
         SET number_limit = NULL
       WHERE logger_id = $id;
    `).run({ id })
    deleteNoPoliciesRow(id)
  })()
}

function deleteNoPoliciesRow(id: string): void {
  getDatabase().prepare(`
    DELETE FROM logger_elimination_policy
     WHERE logger_id = $id
       AND time_to_live IS NULL
       AND number_limit IS NULL
  `).run({ id })
}
