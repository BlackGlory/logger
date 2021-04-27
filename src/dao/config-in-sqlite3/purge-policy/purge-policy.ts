import { getDatabase } from '../database'

export function getAllNamespacesWithPurgePolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM logger_purge_policy;
  `).all()

  return result.map(x => x['namespace'])
}

export function getPurgePolicies(namespace: string): {
  timeToLive: number | null
  numberLimit: number | null
} {
  const row = getDatabase().prepare(`
    SELECT time_to_live
         , number_limit
      FROM logger_purge_policy
     WHERE namespace = $namespace;
  `).get({ namespace })

  if (row) {
    return {
      timeToLive: row['time_to_live']
    , numberLimit: row['number_limit']
    }
  } else {
    return { timeToLive: null, numberLimit: null }
  }
}

export function setTimeToLive(namespace: string, timeToLive: number): void {
  getDatabase().prepare(`
    INSERT INTO logger_purge_policy (namespace, time_to_live)
    VALUES ($namespace, $timeToLive)
        ON CONFLICT(namespace)
        DO UPDATE SET time_to_live = $timeToLive;
  `).run({ namespace, timeToLive })
}

export function unsetTimeToLive(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_purge_policy
         SET time_to_live = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setNumberLimit(namespace: string, numberLimit: number): void {
  getDatabase().prepare(`
    INSERT INTO logger_purge_policy (namespace, number_limit)
    VALUES ($namespace, $numberLimit)
        ON CONFLICT(namespace)
        DO UPDATE SET number_limit = $numberLimit;
  `).run({ namespace, numberLimit })
}

export function unsetNumberLimit(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE logger_purge_policy
         SET number_limit = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

function deleteNoPoliciesRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM logger_purge_policy
     WHERE namespace = $namespace
       AND time_to_live IS NULL
       AND number_limit IS NULL
  `).run({ namespace })
}
