import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawPurgePolicy {
  logger_id: string
  time_to_live: number
  number_limit: number
}

export function setRawPurgePolicy(item: IRawPurgePolicy): IRawPurgePolicy {
  getDatabase().prepare(`
    INSERT INTO logger_purge_policy (
      logger_id
    , time_to_live
    , number_limit
    )
    VALUES (
      $logger_id
    , $time_to_live
    , $number_limit
    );
  `).run(item)

  return item
}

export function hasRawPurgePolicy(id: string): boolean {
  return !!getRawPurgePolicy(id)
}

export function getRawPurgePolicy(id: string): IRawPurgePolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_purge_policy
     WHERE logger_id = $id;
  `).get({ id })
}
