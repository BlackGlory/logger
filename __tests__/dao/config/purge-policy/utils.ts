import { getDatabase } from '@dao/config/database.js'

interface IRawPurgePolicy {
  namespace: string
  time_to_live: number
  number_limit: number
}

export function setRawPurgePolicy(raw: IRawPurgePolicy): IRawPurgePolicy {
  getDatabase().prepare(`
    INSERT INTO logger_purge_policy (
      namespace
    , time_to_live
    , number_limit
    )
    VALUES (
      $namespace
    , $time_to_live
    , $number_limit
    );
  `).run(raw)

  return raw
}

export function hasRawPurgePolicy(namespace: string): boolean {
  return !!getRawPurgePolicy(namespace)
}

export function getRawPurgePolicy(namespace: string): IRawPurgePolicy | undefined {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_purge_policy
     WHERE namespace = $namespace;
  `).get({ namespace }) as IRawPurgePolicy | undefined
}
