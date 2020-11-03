import * as DAO from '@dao/logger/purge'
import { prepareLoggerDatabase } from '@test/utils'
import { Database } from 'better-sqlite3'

jest.mock('@dao/logger/database')

describe('purgeByTimestamp(id: string, timestamp: number): void', () => {
  it('return undefined', async () => {
    const db = await prepareLoggerDatabase()
    const id = 'id'
    insert(db, { id, payload: 'payload1', timestamp: 0, number: 0 })
    insert(db, { id, payload: 'payload2', timestamp: 1, number: 0 })
    const timestamp = 1

    const result = DAO.purgeByTimestamp(id, timestamp)
    const rows = select(db, id)

    expect(result).toBeUndefined()
    expect(rows).toEqual([
      { payload: 'payload2', timestamp: 1, number: 0}
    ])
  })
})

describe('purgeByLimit(id: string, limit: number): void', () => {
  it('return undefined', async () => {
    const db = await prepareLoggerDatabase()
    const id = 'id'
    insert(db, { id, payload: 'payload1', timestamp: 0, number: 0 })
    insert(db, { id, payload: 'payload2', timestamp: 0, number: 1 })
    const limit = 1

    const result = DAO.purgeByLimit(id, limit)
    const rows = select(db, id)

    expect(result).toBeUndefined()
    expect(rows).toEqual([
      { payload: 'payload2', timestamp: 0, number: 1 }
    ])
  })
})

function insert(db: Database, { id, payload, timestamp, number }: { id: string; payload: string; timestamp: number; number: number }) {
  db.prepare(`
    INSERT INTO logger_log (logger_id, payload, timestamp, number)
    VALUES ($id, $payload, $timestamp, $number);
  `).run({ id, payload, timestamp, number })
}

function select(db: Database, id: string): Array<{ timestamp: number; number: number; payload: string }> {
  return db.prepare(`
    SELECT *
      FROM logger_log
     WHERE logger_id = $id
     ORDER BY timestamp ASC
            , number    ASC;
  `).all({ id }).map(x => ({
    timestamp: x.timestamp
  , number: x.number
  , payload: x.payload
  }))
}
