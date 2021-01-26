import { Database } from 'better-sqlite3'
import * as DAO from '@dao/data-in-sqlite3/logger/list-all-logger-ids'
import { toArray } from 'iterable-operator'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('listAllLoggerIds(): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const iter = DAO.listAllLoggerIds()
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const db = getDatabase()
      const id = 'id'
      insert(db, { id, payload: 'payload', timestamp: Date.now(), number: 0 })

      const iter = DAO.listAllLoggerIds()
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([id])
    })
  })
})

function insert(db: Database, { id, payload, timestamp, number }: { id: string; payload: string; timestamp: number; number: number }) {
  db.prepare(`
    INSERT INTO logger_log (logger_id, payload, timestamp, number)
    VALUES ($id, $payload, $timestamp, $number);
  `).run({ id, payload, timestamp, number })
}
