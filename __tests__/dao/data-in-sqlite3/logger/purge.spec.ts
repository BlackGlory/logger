import * as DAO from '@dao/data-in-sqlite3/logger/purge'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawLog, getAllRawLogs } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('purgeByTimestamp(id: string, timestamp: number): void', () => {
  it('return undefined', () => {
    const id = 'id'
    const log1 = setRawLog({
      logger_id: id
    , payload: 'payload1'
    , timestamp: 0
    , number: 0
    })
    const log2 = setRawLog({
      logger_id: id
    , payload: 'payload2'
    , timestamp: 1
    , number: 0
    })
    const timestamp = 1

    const result = DAO.purgeByTimestamp(id, timestamp)
    const rows = getAllRawLogs(id)

    expect(result).toBeUndefined()
    expect(rows).toEqual([log2])
  })
})

describe('purgeByLimit(id: string, limit: number): void', () => {
  it('return undefined', () => {
    const id = 'id'
    const log1 = setRawLog({
      logger_id: id
    , payload: 'payload1'
    , timestamp: 0
    , number: 0
    })
    const log2 = setRawLog({
      logger_id: id
    , payload: 'payload2'
    , timestamp: 0
    , number: 1
    })
    const limit = 1

    const result = DAO.purgeByLimit(id, limit)
    const rows = getAllRawLogs(id)

    expect(result).toBeUndefined()
    expect(rows).toEqual([log2])
  })
})
