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
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      setRawLog({
        logger_id: id
      , payload: payload[0]
      , timestamp: timestamp1
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: payload[1]
      , timestamp: timestamp1
      , number: 1
      })
      setRawLog({
        logger_id: id
      , payload: payload[2]
      , timestamp: timestamp2
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: payload[3]
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
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { to: `${timestamp2}-0` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { to: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { from: `${timestamp1}-1` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { from: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        ])
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
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      setRawLog({
        logger_id: id
      , payload: payload[0]
      , timestamp: timestamp1
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: payload[1]
      , timestamp: timestamp1
      , number: 1
      })
      setRawLog({
        logger_id: id
      , payload: payload[2]
      , timestamp: timestamp2
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: payload[3]
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.deleteLogs(id, { head: 2 })
      const rows = getAllRawLogs(id)

      expect(iter).toBeUndefined()
      expect(rows).toMatchObject([
        { payload: payload[2], timestamp: timestamp2, number: 0 }
      , { payload: payload[3], timestamp: timestamp2, number: 1 }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { head: 2, to: `${timestamp2}-0` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { head: 1, to: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[1], timestamp: timestamp1, number: 1 }
        , { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { head: 2, from: `${timestamp1}-1` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { head: 1, from: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
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
    it('delete all rows', () => {
      const id = 'id'
      const timestamp1 = Date.now()
      const timestamp2 = timestamp1 + 1
      const payload = ['payload1', 'payload2', 'payload3', 'payload4']
      setRawLog({
        logger_id: id
      , payload: payload[0]
      , timestamp: timestamp1
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: payload[1]
      , timestamp: timestamp1
      , number: 1
      })
      setRawLog({
        logger_id: id
      , payload: payload[2]
      , timestamp: timestamp2
      , number: 0
      })
      setRawLog({
        logger_id: id
      , payload: payload[3]
      , timestamp: timestamp2
      , number: 1
      })

      const iter = DAO.deleteLogs(id, { tail: 2 })
      const rows = getAllRawLogs(id)

      expect(iter).toBeUndefined()
      expect(rows).toMatchObject([
        { payload: payload[0], timestamp: timestamp1, number: 0 }
      , { payload: payload[1], timestamp: timestamp1, number: 1 }
      ])
    })
  })

  describe('ignore from', () => {
    describe('real id', () => {
      it('delete rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { tail: 2, to: `${timestamp2}-0` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[:to]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { tail: 1, to: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[2], timestamp: timestamp2, number: 0 }
        , { payload: payload[3], timestamp: timestamp2, number: 1 }
        ])
      })
    })
  })

  describe('ignore to', () => {
    describe('real id', () => {
      it('delete rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { tail: 2, from: `${timestamp1}-1` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        ])
      })
    })

    describe('fake id', () => {
      it('delete rows[from:]', () => {
        const id = 'id'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1
        const payload = ['payload1', 'payload2', 'payload3', 'payload4']
        setRawLog({
          logger_id: id
        , payload: payload[0]
        , timestamp: timestamp1
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[1]
        , timestamp: timestamp1
        , number: 1
        })
        setRawLog({
          logger_id: id
        , payload: payload[2]
        , timestamp: timestamp2
        , number: 0
        })
        setRawLog({
          logger_id: id
        , payload: payload[3]
        , timestamp: timestamp2
        , number: 1
        })

        const iter = DAO.deleteLogs(id, { tail: 1, from: `${timestamp1}-2` })
        const rows = getAllRawLogs(id)

        expect(iter).toBeUndefined()
        expect(rows).toMatchObject([
          { payload: payload[0], timestamp: timestamp1, number: 0 }
        , { payload: payload[1], timestamp: timestamp1, number: 1 }
        , { payload: payload[2], timestamp: timestamp2, number: 0 }
        ])
      })
    })
  })
})
