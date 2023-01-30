import * as DAO from '@dao/data-in-sqlite3/logger/purge.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLog, getAllRawLogs } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('purgeByTimestamp(namespace: string, timestamp: number): void', () => {
  it('return undefined', () => {
    const namespace = 'namespace'
    const log1 = setRawLog({
      namespace
    , payload: 'payload1'
    , timestamp: 0
    , number: 0
    })
    const log2 = setRawLog({
      namespace
    , payload: 'payload2'
    , timestamp: 1
    , number: 0
    })
    const timestamp = 1

    const result = DAO.purgeByTimestamp(namespace, timestamp)
    const rows = getAllRawLogs(namespace)

    expect(result).toBeUndefined()
    expect(rows).toEqual([log2])
  })
})

describe('purgeByLimit(namespace: string, limit: number): void', () => {
  it('return undefined', () => {
    const namespace = 'namespace'
    const log1 = setRawLog({
      namespace
    , payload: 'payload1'
    , timestamp: 0
    , number: 0
    })
    const log2 = setRawLog({
      namespace
    , payload: 'payload2'
    , timestamp: 0
    , number: 1
    })
    const limit = 1

    const result = DAO.purgeByLimit(namespace, limit)
    const rows = getAllRawLogs(namespace)

    expect(result).toBeUndefined()
    expect(rows).toEqual([log2])
  })
})
