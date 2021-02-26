import * as DAO from '@dao/data-in-sqlite3/logger/write-log'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { getAllRawLogs } from './utils'
import 'jest-extended'

let timestamp = Date.now()

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/logger/utils/get-timestamp', () => ({
  getTimestamp() {
    return timestamp
  }
}))

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('writeLog(id: string, payload: string): string', () => {
  describe('no limit', () => {
    describe('write two logs in the same second', () => {
      it('return undefined', () => {
        const id = 'id'
        const payload1 = 'payload-1'
        const payload2 = 'payload-2'
        const timestamp = Date.now()

        setTimestamp(timestamp)
        const result1 = DAO.writeLog(id, payload1)
        const result2 = DAO.writeLog(id, payload2)
        const rows = getAllRawLogs(id)

        expect(result1).toBe(`${timestamp}-0`)
        expect(result2).toBe(`${timestamp}-1`)
        expect(rows).toMatchObject([
          { payload: payload1, timestamp, number: 0 }
        , { payload: payload2, timestamp, number: 1 }
        ])
      })
    })

    describe('write two logs in the different second', () => {
      it('return undefined', () => {
        const id = 'id'
        const payload1 = 'payload-1'
        const payload2 = 'payload-2'
        const timestamp1 = Date.now()
        const timestamp2 = timestamp1 + 1

        setTimestamp(timestamp1)
        const result1 = DAO.writeLog(id, payload1)
        setTimestamp(timestamp2)
        const result2 = DAO.writeLog(id, payload2)
        const rows = getAllRawLogs(id)

        expect(result1).toEqual(`${timestamp1}-0`)
        expect(result2).toEqual(`${timestamp2}-0`)
        expect(rows).toMatchObject([
          { payload: payload1, timestamp: timestamp1, number: 0 }
        , { payload: payload2, timestamp: timestamp2, number: 0 }
        ])
      })
    })
  })
})

function setTimestamp(value: number) {
  timestamp = value
}
