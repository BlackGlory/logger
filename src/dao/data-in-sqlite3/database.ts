import Database from 'better-sqlite3'
import type { Database as IDatabase } from 'better-sqlite3'
import * as path from 'path'
import { ensureDirSync } from 'extra-filesystem'
import { NODE_ENV, NodeEnv, DATA } from '@env'
import { assert } from '@blackglory/errors'
import { migrateDatabase } from './utils'
assert(NODE_ENV() !== NodeEnv.Test)

let db: IDatabase

export function openDatabase(): void {
  const dataPath = DATA()
  const dataFilename = path.join(dataPath, 'data.db')
  ensureDirSync(dataPath)

  db = new Database(dataFilename)
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
}

export function getDatabase() {
  assert(db)
  return db
}

export function closeDatabase() {
  if (db) {
    db.exec(`
      PRAGMA analysis_limit=400;
      PRAGMA optimize;
    `)
    db.close()
  }
}
