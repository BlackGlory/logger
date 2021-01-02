import { Database } from 'better-sqlite3'
import { resetDatabases, resetEnvironment } from '@test/utils'
import * as DAO from '@dao/data-in-sqlite3/logger/query-logs'
import { getDatabase } from '@dao/data-in-sqlite3/database'
import '@blackglory/jest-matchers'

jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/config-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('queryLogs(id: string, paramters: { from?: string; to?: string }): Iterable<{ id: string; payload: string }>', () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const db = getDatabase()
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
      insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
      insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
      insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

      const iter = DAO.queryLogs(id, {})
      const rows = toArray(iter)

      expect(iter).toBeIterable()
      expect(rows).toEqual([
        { id: `${timestamp1}-0`, payload: payload[0] }
      , { id: `${timestamp1}-1`, payload: payload[1] }
      , { id: `${timestamp2}-0`, payload: payload[2] }
      , { id: `${timestamp2}-1`, payload: payload[3] }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('return rows[:to]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { to: `${timestamp2}-0` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-0`, payload: payload[0] }
        , { id: `${timestamp1}-1`, payload: payload[1] }
        , { id: `${timestamp2}-0`, payload: payload[2] }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[:to]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-0`, payload: payload[0] }
        , { id: `${timestamp1}-1`, payload: payload[1] }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('return rows[from:]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { from: `${timestamp1}-1` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-1`, payload: payload[1] }
        , { id: `${timestamp2}-0`, payload: payload[2] }
        , { id: `${timestamp2}-1`, payload: payload[3] }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[from:]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp2}-0`, payload: payload[2] }
        , { id: `${timestamp2}-1`, payload: payload[3] }
        ])
      })
    })
  })
})

describe('queryLogs(id: string, paramters: { from?: string; to?: string; head: string }): Iterable<{ id: string; payload: string }>', () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const db = getDatabase()
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
      insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
      insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
      insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

      const iter = DAO.queryLogs(id, { head: 2 })
      const rows = toArray(iter)

      expect(iter).toBeIterable()
      expect(rows).toEqual([
        { id: `${timestamp1}-0`, payload: payload[0] }
      , { id: `${timestamp1}-1`, payload: payload[1] }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('return rows[:to]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { head: 2, to: `${timestamp2}-0` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-0`, payload: payload[0] }
        , { id: `${timestamp1}-1`, payload: payload[1] }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[:to]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { head: 1, to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-0`, payload: payload[0] }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('return rows[from:]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { head: 2, from: `${timestamp1}-1` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-1`, payload: payload[1] }
        , { id: `${timestamp2}-0`, payload: payload[2] }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[from:]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { head: 1, from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp2}-0`, payload: payload[2] }
        ])
      })
    })
  })
})

describe('queryLogs(id: string, paramters: { from?: string; to?: string; tail: string }): Iterable<{ id: string; payload: string }>', () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const db = getDatabase()
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
      insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
      insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
      insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

      const iter = DAO.queryLogs(id, { tail: 2 })
      const rows = toArray(iter)

      expect(iter).toBeIterable()
      expect(rows).toEqual([
        { id: `${timestamp2}-0`, payload: payload[2] }
      , { id: `${timestamp2}-1`, payload: payload[3] }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('return rows[:to]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { tail: 2, to: `${timestamp2}-0` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-1`, payload: payload[1] }
        , { id: `${timestamp2}-0`, payload: payload[2] }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[:to]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { tail: 1, to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp1}-1`, payload: payload[1] }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('return rows[from:]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { tail: 2, from: `${timestamp1}-1` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp2}-0`, payload: payload[2] }
        , { id: `${timestamp2}-1`, payload: payload[3] }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[from:]', () => {
        const db = getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.queryLogs(id, { tail: 1, from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${timestamp2}-1`, payload: payload[3] }
        ])
      })
    })
  })
})

function toArray<T>(iter: Iterable<T>): T[] {
  return Array.from(iter)
}

function insert(db: Database, { id, payload, timestamp, number }: { id: string; payload: string; timestamp: number; number: number }) {
  db.prepare(`
    INSERT INTO logger_log (logger_id, payload, timestamp, number)
    VALUES ($id, $payload, $timestamp, $number);
  `).run({ id, payload, timestamp, number })
}
