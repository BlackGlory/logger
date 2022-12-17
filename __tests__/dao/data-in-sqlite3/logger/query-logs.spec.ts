import * as DAO from '@dao/data-in-sqlite3/logger/query-logs'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { toArray } from 'iterable-operator'
import { setRawLog } from './utils'

jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe(`
  queryLogs(
    namespace: string
  , paramters: { from?: string; to?: string }
  ): Iterable<{ id: string; payload: string }>
`, () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const namespace = 'namespace'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const log1 = setRawLog({
        namespace
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      const log2 = setRawLog({
        namespace
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      const log3 = setRawLog({
        namespace
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      const log4 = setRawLog({
        namespace
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.queryLogs(namespace, {})
      const rows = toArray(iter)

      expect(rows).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
      , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
      , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
      , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real log id', () => {
      it('return rows[:to]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { to: `${log3.timestamp}-${log3.number}` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })

    describe('fake log id', () => {
      it('return rows[:to]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real log id', () => {
      it('return rows[from:]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { from: `${log2.timestamp}-${log2.number}` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })

    describe('fake log id', () => {
      it('return rows[from:]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })
  })
})

describe(`
  queryLogs(
    namespace: string
  , paramters: { from?: string; to?: string; head: string }
  ): Iterable<{ id: string; payload: string }>
`, () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const namespace = 'namespace'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const log1 = setRawLog({
        namespace
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      const log2 = setRawLog({
        namespace
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      const log3 = setRawLog({
        namespace
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      const log4 = setRawLog({
        namespace
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.queryLogs(namespace, { head: 2 })
      const rows = toArray(iter)

      expect(rows).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
      , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real log id', () => {
      it('return rows[:to]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { head: 2, to: `${log3.timestamp}-${log3.number}` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })
    })

    describe('fake log id', () => {
      it('return rows[:to]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { head: 1, to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real log id', () => {
      it('return rows[from:]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { head: 2, from: `${log2.timestamp}-${log2.number}` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })

    describe('fake log id', () => {
      it('return rows[from:]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { head: 1, from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })
  })
})

describe(`
  queryLogs(
    namespace: string
  , paramters: { from?: string; to?: string; tail: string }
  ): Iterable<{ id: string; payload: string }>
`, () => {
  describe('ignore from and to', () => {
    it('return all rows', () => {
      const namespace = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const log1 = setRawLog({
        namespace
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      const log2 = setRawLog({
        namespace
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      const log3 = setRawLog({
        namespace
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      const log4 = setRawLog({
        namespace
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.queryLogs(namespace, { tail: 2 })
      const rows = toArray(iter)

      expect(rows).toEqual([
        { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
      , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real log id', () => {
      it('return rows[:to]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { tail: 2, to: `${log3.timestamp}-${log3.number}` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        ])
      })
    })

    describe('fake log id', () => {
      it('return rows[:to]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { tail: 1, to: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real log id', () => {
      it('return rows[from:]', () => {
        const namespace = 'namespace'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { tail: 2, from: `${log2.timestamp}-${log2.number}` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log3.timestamp}-${log3.number}`, payload: log3.payload }
        , { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })

    describe('fake log id', () => {
      it('return rows[from:]', () => {
        const namespace = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const log1 = setRawLog({
          namespace
        , payload: 'payload1'
        , timestamp: timestamp1
        , number: 0
        })
        const log2 = setRawLog({
          namespace
        , payload: 'payload2'
        , timestamp: timestamp1
        , number: 1
        })
        const log3 = setRawLog({
          namespace
        , payload: 'payload3'
        , timestamp: timestamp2
        , number: 0
        })
        const log4 = setRawLog({
          namespace
        , payload: 'payload4'
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.queryLogs(namespace, { tail: 1, from: `${timestamp1}-2` })
        const rows = toArray(iter)

        expect(rows).toEqual([
          { id: `${log4.timestamp}-${log4.number}`, payload: log4.payload }
        ])
      })
    })
  })
})
