import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { purgeLogs } from '@dao/purge-logs.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog, hasRawLogger, hasRawLog } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('purgeLogs', () => {
  test('logger does not exist', () => {
    purgeLogs('id', 1)

    expect(hasRawLogger('id')).toBe(false)
  })

  describe('logger exists', () => {
    test('time to live', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: 1
      })
      const log1 = setRawLog({
        logger_id: 'id'
      , value: 'value1'
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , value: 'value2'
      , timestamp: 1
      , number: 0
      })

      purgeLogs('id', 1)

      expect(hasRawLog('id', 0, 0)).toBe(false)
      expect(hasRawLog('id', 1, 0)).toBe(true)
    })

    test('limit', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: 1
      , time_to_live: null
      })
      setRawLog({
        logger_id: 'id'
      , value: 'value1'
      , timestamp: 0
      , number: 0
      })
      setRawLog({
        logger_id: 'id'
      , value: 'value2'
      , timestamp: 1
      , number: 0
      })

      purgeLogs('id', 0)

      expect(hasRawLog('id', 0, 0)).toBe(false)
      expect(hasRawLog('id', 1, 0)).toBe(true)
    })
  })
})
