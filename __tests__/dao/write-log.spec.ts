import { writeLog } from '@dao/write-log.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, getRawLog } from '@test/dao.js'
import { getError } from 'return-style'
import { LoggerNotFound } from '@src/contract.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('writeLog', () => {
  test('logger does not exist', () => {
    const err = getError(() => writeLog('id', JSON.stringify('content'), 0))

    expect(err).toBeInstanceOf(LoggerNotFound)
  })

  describe('logger exists', () => {
    test('write logs in the same timestamp', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })

      const result1 = writeLog('id', JSON.stringify('content-1'), 0)
      const result2 = writeLog('id', JSON.stringify('content-2'), 0)

      expect(result1).toBe(`0-0`)
      expect(result2).toBe(`0-1`)
      expect(getRawLog('id', 0, 0)).toStrictEqual({
        logger_id: 'id'
      , timestamp: 0
      , number: 0
      , value: JSON.stringify('content-1')
      })
      expect(getRawLog('id', 0, 1)).toStrictEqual({
        logger_id: 'id'
      , timestamp: 0
      , number: 1
      , value: JSON.stringify('content-2')
      })
    })

    test('write logs in the different timestamp', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })

      const result1 = writeLog('id', JSON.stringify('content-1'), 0)
      const result2 = writeLog('id', JSON.stringify('content-2'), 1)

      expect(result1).toBe(`0-0`)
      expect(result2).toBe(`1-0`)
      expect(getRawLog('id', 0, 0)).toStrictEqual({
        logger_id: 'id'
      , timestamp: 0
      , number: 0
      , value: JSON.stringify('content-1')
      })
      expect(getRawLog('id', 1, 0)).toStrictEqual({
        logger_id: 'id'
      , timestamp: 1
      , number: 0
      , value: JSON.stringify('content-2')
      })
    })
  })
})
