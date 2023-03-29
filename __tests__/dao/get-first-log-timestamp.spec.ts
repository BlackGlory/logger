import { getFirstLogTimestamp } from '@dao/get-first-log-timestamp.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getFirstLogTimestamp', () => {
  test('logger does not exist', () => {
    const result = getFirstLogTimestamp('id')

    expect(result).toBe(null)
  })

  describe('logger exists', () => {
    test('log does not exist', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })

      const result = getFirstLogTimestamp('id')

      expect(result).toBe(null)
    })

    test('log exists', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      setRawLog({
        logger_id: 'id'
      , timestamp: 0
      , number: 0
      , value: JSON.stringify('content-1')
      })
      setRawLog({
        logger_id: 'id'
      , timestamp: 0
      , number: 1
      , value: JSON.stringify('content-2')
      })
      setRawLog({
        logger_id: 'id'
      , timestamp: 1
      , number: 0
      , value: JSON.stringify('content-3')
      })

      const result = getFirstLogTimestamp('id')

      expect(result).toBe(0)
    })
  })
})
