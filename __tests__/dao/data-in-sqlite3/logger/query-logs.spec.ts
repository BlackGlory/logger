import * as DAO from '@dao/data-in-sqlite3/logger/query-logs'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { toArray } from 'iterable-operator'
import { setRawLog } from './utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('queryLogs(id: string, paramters: { from?: string; to?: string }): Iterable<{ id: string; payload: string }>', () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const log1 = setRawLog({
        logger_id: id
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: id
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      const log3 = setRawLog({
        logger_id: id
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      const log4 = setRawLog({
        logger_id: id
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.queryLogs(id, {})
      const rows = toArray(iter)

      expect(iter).toBeIterable()
      expect(rows).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
      , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
      , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
      , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('return rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { to: `${log3.timestamp}-${log3.number}` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('return rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { from: `${log2.timestamp}-${log2.number}` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })
  })
})

describe('queryLogs(id: string, paramters: { from?: string; to?: string; head: string }): Iterable<{ id: string; payload: string }>', () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const log1 = setRawLog({
        logger_id: id
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: id
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      const log3 = setRawLog({
        logger_id: id
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      const log4 = setRawLog({
        logger_id: id
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.queryLogs(id, { head: 2 })
      const rows = toArray(iter)

      expect(iter).toBeIterable()
      expect(rows).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
      , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('return rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { head: 2, to: `${log3.timestamp}-${log3.number}` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { head: 1, to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('return rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { head: 2, from: `${log2.timestamp}-${log2.number}` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { head: 1, from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })
  })
})

describe('queryLogs(id: string, paramters: { from?: string; to?: string; tail: string }): Iterable<{ id: string; payload: string }>', () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const log1 = setRawLog({
        logger_id: id
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: id
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      const log3 = setRawLog({
        logger_id: id
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      const log4 = setRawLog({
        logger_id: id
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.queryLogs(id, { tail: 2 })
      const rows = toArray(iter)

      expect(iter).toBeIterable()
      expect(rows).toEqual([
        { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
      , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('return rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { tail: 2, to: `${log3.timestamp}-${log3.number}` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { tail: 1, to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('return rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { tail: 2, from: `${log2.timestamp}-${log2.number}` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })

    describe('fake id', () => {
      it('return rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          logger_id: id
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: id
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          logger_id: id
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          logger_id: id
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(id, { tail: 1, from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(iter).toBeIterable()
        expect(rows).toEqual([
          { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })
  })
})
