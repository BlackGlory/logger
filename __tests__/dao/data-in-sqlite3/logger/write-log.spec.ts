import * as DAO from '@dao/data-in-sqlite3/logger/write-log.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getAllRawLogs } from './utils.js'
import { _setMockedTimestamp, _clearMockedTimestamp } from '@dao/data-in-sqlite3/logger/utils/get-timestamp.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)
afterEach(_clearMockedTimestamp)

describe('writeLog(namespace: string, payload: string): string', () => {
  describe('no limit', () => {
    describe('write two logs in the same second', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const payload1 = 'payload-1'
        const payload2 = 'payload-2'
        const timestamp = 10000

        _setMockedTimestamp(timestamp)
        const result1 = DAO.writeLog(namespace, payload1)
        const result2 = DAO.writeLog(namespace, payload2)
        const rows = getAllRawLogs(namespace)

        expect(result1).toBe(`${timestamp}-0`)
        expect(result2).toBe(`${timestamp}-1`)
        expect(rows).toEqual([
          {
            namespace
          , payload: payload1
          , timestamp
          , number: 0
          }
        , {
            namespace
          , payload: payload2
          , timestamp
          , number: 1
          }
        ])
      })
    })

    describe('write two logs in the different second', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const payload1 = 'payload-1'
        const payload2 = 'payload-2'
        const timestamp1 = 10000
        const timestamp2 = timestamp1 + 1

        _setMockedTimestamp(timestamp1)
        const result1 = DAO.writeLog(namespace, payload1)
        _setMockedTimestamp(timestamp2)
        const result2 = DAO.writeLog(namespace, payload2)
        const rows = getAllRawLogs(namespace)

        expect(result1).toEqual(`${timestamp1}-0`)
        expect(result2).toEqual(`${timestamp2}-0`)
        expect(rows).toEqual([
          {
            namespace
          , payload: payload1
          , timestamp: timestamp1
          , number: 0
          }
        , {
            namespace
          , payload: payload2
          , timestamp: timestamp2
          , number: 0
          }
        ])
      })
    })
  })
})
