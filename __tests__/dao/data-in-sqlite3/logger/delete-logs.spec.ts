import * as DAO from '@dao/data-in-sqlite3/logger/delete-logs'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawLog, getAllRawLogs } from './utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('deleteLogs(namespace: string, paramters: { from?: string; to?: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', () => {
      const namespace = 'namespace'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      setRawLog({
        namespace
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      setRawLog({
        namespace
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      setRawLog({
        namespace
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      setRawLog({
        namespace
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const result = DAO.deleteLogs(namespace, {})
      const rows = getAllRawLogs(namespace)

      expect(result).toBeUndefined()
      expect(rows).toEqual([])
    })
  })

  describe('ignore from', () => {
    describe('real log id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(namespace, { to: `${timestamp2}-0` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log4])
      })
    })

    describe('fake log id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(namespace, { to: `${timestamp1}-2` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log3, log4])
      })
    })
  })

  describe('ignore to', () => {
    describe('real log id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(namespace, { from: `${timestamp1}-1` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1])
      })
    })

    describe('fake log id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(namespace, { from: `${timestamp1}-2` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2])
      })
    })
  })
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string; head: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', () => {
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

      const iter = DAO.deleteLogs(namespace, { head: 2 })
      const rows = getAllRawLogs(namespace)

      expect(iter).toBeUndefined()
      expect(rows).toEqual([log3, log4])
    })
  })

  describe('ignore from', () => {
    describe('real log id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(namespace, { head: 2, to: `${timestamp2}-0` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log3, log4])
      })
    })

    describe('fake log id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(namespace, { head: 1, to: `${timestamp1}-2` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log2, log3, log4])
      })
    })
  })

  describe('ignore to', () => {
    describe('real log id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(namespace, { head: 2, from: `${timestamp1}-1` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log4])
      })
    })

    describe('fake log id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(namespace, { head: 1, from: `${timestamp1}-2` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2, log4])
      })
    })
  })
})

describe('deleteLogs(namespace: string, paramters: { from?: string; to?: string; tail: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', () => {
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

      const iter = DAO.deleteLogs(namespace, { tail: 2 })
      const rows = getAllRawLogs(namespace)

      expect(iter).toBeUndefined()
      expect(rows).toEqual([log1, log2])
    })
  })

  describe('ignore from', () => {
    describe('real log id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(namespace, { tail: 2, to: `${timestamp2}-0` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log4])
      })
    })

    describe('fake log id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(namespace, { tail: 1, to: `${timestamp1}-2` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log3, log4])
      })
    })
  })

  describe('ignore to', () => {
    describe('real log id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(namespace, { tail: 2, from: `${timestamp1}-1` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2])
      })
    })

    describe('fake log id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(namespace, { tail: 1, from: `${timestamp1}-2` })
        const rows = getAllRawLogs(namespace)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2, log3])
      })
    })
  })
})
