import { resetDatabases, resetEnvironment } from '@test/utils'
import * as DAO from '@dao/data-in-sqlite3/logger/delete-logs'
import { setRawLog, getAllRawLogs } from './utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', () => {
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      setRawLog({
        logger_id: id
      , payload: 'payload1'
      , timestamp: timestamp1
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: 'payload2'
      , timestamp: timestamp1
      , number: 1
      })
      setRawLog({
        logger_id: id
      , payload: 'payload3'
      , timestamp: timestamp2
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: 'payload4'
      , timestamp: timestamp2
      , number: 1
      })

      const result = DAO.deleteLogs(id, {})
      const rows = getAllRawLogs(id)

      expect(result).toBeUndefined()
      expect(rows).toEqual([])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(id, { to: `${timestamp2}-0` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log4])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(id, { to: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log3, log4])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(id, { from: `${timestamp1}-1` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(id, { from: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2])
      })
    })
  })
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string; head: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', () => {
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

      const iter = DAO.deleteLogs(id, { head: 2 })
      const rows = getAllRawLogs(id)

      expect(iter).toBeUndefined()
      expect(rows).toEqual([log3, log4])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(id, { head: 2, to: `${timestamp2}-0` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log3, log4])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(id, { head: 1, to: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log2, log3, log4])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(id, { head: 2, from: `${timestamp1}-1` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log4])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(id, { head: 1, from: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2, log4])
      })
    })
  })
})

describe('deleteLogs(id: string, paramters: { from?: string; to?: string; tail: string }): void', () => {
  describe('ignore from and to', () => {
    it('delete all rows', () => {
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

      const iter = DAO.deleteLogs(id, { tail: 2 })
      const rows = getAllRawLogs(id)

      expect(iter).toBeUndefined()
      expect(rows).toEqual([log1, log2])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(id, { tail: 2, to: `${timestamp2}-0` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log4])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', () => {
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

        const iter = DAO.deleteLogs(id, { tail: 1, to: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log3, log4])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(id, { tail: 2, from: `${timestamp1}-1` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', () => {
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

        const iter = DAO.deleteLogs(id, { tail: 1, from: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toEqual([log1, log2, log3])
      })
    })
  })
})
