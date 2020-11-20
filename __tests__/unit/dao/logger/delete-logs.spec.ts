import { Database } from 'better-sqlite3'
import { resetLoggerDatabase, resetDatabases, resetEnvironment } from '@test/utils'
import * as DAO from '@dao/logger/delete-logs'
import { getDatabase } from '@dao/logger/database'
import '@blackglory/jest-matchers'

jest.mock('@dao/logger/database')
jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', async () => {
      const db = await getDatabase()
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
      insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
      insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
      insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

      const result = DAO.deleteLogs(id, {})
      const rows = select(db, id)

      expect(result).toBeUndefined()
      expect(rows).toEqual([])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { to: `${timestamp2}-0` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { to: `${timestamp1}-2` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { from: `${timestamp1}-1` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { from: `${timestamp1}-2` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        ])
      })
    })
  })
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string; head: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', async () => {
      const db = await getDatabase()
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
      insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
      insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
      insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

      const iter = DAO.deleteLogs(id, { head: 2 })
      const rows = select(db, id)

      expect(iter).toBeUndefined()
      expect(rows).toEqual([
        { payload: payload[2], timestamp: timestamp2, number: 0 }
      , { payload: payload[3], timestamp: timestamp2, number: 1 }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { head: 2, to: `${timestamp2}-0` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { head: 1, to: `${timestamp1}-2` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[1], timestamp: timestamp1, number: 1 }
        , { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { head: 2, from: `${timestamp1}-1` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { head: 1, from: `${timestamp1}-2` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string; tail: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', async () => {
      const db = await getDatabase()
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
      insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
      insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
      insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

      const iter = DAO.deleteLogs(id, { tail: 2 })
      const rows = select(db, id)

      expect(iter).toBeUndefined()
      expect(rows).toEqual([
        { payload: payload[0], timestamp: timestamp1, number: 0 }
      , { payload: payload[1], timestamp: timestamp1, number: 1 }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { tail: 2, to: `${timestamp2}-0` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { tail: 1, to: `${timestamp1}-2` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { tail: 2, from: `${timestamp1}-1` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        insert(db, { id, payload: payload[0], timestamp: timestamp1, number: 0 })
        insert(db, { id, payload: payload[1], timestamp: timestamp1, number: 1 })
        insert(db, { id, payload: payload[2], timestamp: timestamp2, number: 0 })
        insert(db, { id, payload: payload[3], timestamp: timestamp2, number: 1 })

        const iter = DAO.deleteLogs(id, { tail: 1, from: `${timestamp1}-2` })
        const rows = select(db, id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        , { payload: payload[2], timestamp: timestamp2, number: 0 }
        ])
      })
    })
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
