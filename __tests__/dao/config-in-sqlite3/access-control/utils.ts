import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  logger_id: string
}

interface IRawWhitelist {
  logger_id: string
}

interface IRawTokenPolicy {
  logger_id: string
  write_token_required: number | null
  read_token_required: number | null
  delete_token_required: number | null
}

interface IRawToken {
  token: string
  logger_id: string
  write_permission: number
  read_permission: number
  delete_permission: number
}

export function setRawBlacklist(props: IRawBlacklist): void {
  getDatabase().prepare(`
    INSERT INTO logger_blacklist (logger_id)
    VALUES ($logger_id);
  `).run(props)
}

export function hasRawBlacklist(id: string): boolean {
  return !!getRawBlacklist(id)
}

export function getRawBlacklist(id: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_blacklist
     WHERE logger_id = $id;
  `).get({ id })
}

export function setRawWhitelist(props: IRawWhitelist): void {
  getDatabase().prepare(`
    INSERT INTO logger_whitelist (logger_id)
    VALUES ($logger_id);
  `).run(props)
}

export function hasRawWhitelist(id: string): boolean {
  return !!getRawWhitelist(id)
}

export function getRawWhitelist(id: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_whitelist
     WHERE logger_id = $id;
  `).get({ id })
}

export function setRawTokenPolicy(props: IRawTokenPolicy): void {
  getDatabase().prepare(`
    INSERT INTO logger_token_policy (
      logger_id
    , write_token_required
    , read_token_required
    , delete_token_required
    )
    VALUES (
      $logger_id
    , $write_token_required
    , $read_token_required
    , $delete_token_required
    );
  `).run(props)
}

export function hasRawTokenPolicy(id: string): boolean {
  return !!getRawTokenPolicy(id)
}

export function getRawTokenPolicy(id: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_token_policy
     WHERE logger_id = $id;
  `).get({ id })
}

export function setRawToken(props: IRawToken): void {
  getDatabase().prepare(`
    INSERT INTO logger_token (
      token
    , logger_id
    , write_permission
    , read_permission
    , delete_permission
    )
    VALUES (
      $token
    , $logger_id
    , $write_permission
    , $read_permission
    , $delete_permission
    );
  `).run(props)
}

export function hasRawToken(token: string, id: string): boolean {
  return !!getRawToken(token, id)
}

export function getRawToken(token: string, id: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_token
     WHERE token = $token
       AND logger_id = $id;
  `).get({ token, id })
}
