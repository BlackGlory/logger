import { removeLogs } from '@dao/remove-logs.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog, hasRawLogger, hasRawLog } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('removeLogs', () => {
  test('logger does not exist', () => {
    removeLogs('id', ['0-0'])

    expect(hasRawLogger('id')).toBe(false)
    expect(hasRawLog('id', 0, 0)).toBe(false)
  })

  test('logger exists', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: null
    , time_to_live: null
    })
    setRawLog({
      logger_id: 'id'
    , timestamp: 0
    , number: 0
    , payload: JSON.stringify('content-1')
    })
    setRawLog({
      logger_id: 'id'
    , timestamp: 0
    , number: 1
    , payload: JSON.stringify('content-2')
    })

    removeLogs('id', ['0-1', '0-2'])

    expect(hasRawLogger('id')).toBe(true)
    expect(hasRawLog('id', 0, 0)).toBe(true)
    expect(hasRawLog('id', 0, 1)).toBe(false)
    expect(hasRawLog('id', 0, 2)).toBe(false)
  })
})
