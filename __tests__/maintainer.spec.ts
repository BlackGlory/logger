import { jest } from '@jest/globals'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { startMaintainer } from '@src/maintainer.js'
import { SyncDestructor } from 'extra-defer'
import { writeLog } from '@dao/write-log.js'
import { hasRawLog, setRawLogger } from './dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('maintainer', () => {
  test('remove outdated logs on startup', () => {
    const destructor = new SyncDestructor()
    try {
      const loggerId = 'logger-id'
      setRawLogger({
        id: loggerId
      , quantity_limit: null
      , time_to_live: 50
      })
      writeLog(loggerId, JSON.stringify('foo'), 100)
      writeLog(loggerId, JSON.stringify('bar'), 200)

      jest.useFakeTimers({ now: 151 })
      destructor.defer(startMaintainer())

      expect(hasRawLog(loggerId, 100, 0)).toBe(false)
      expect(hasRawLog(loggerId, 200, 0)).toBe(true)
    } finally {
      jest.useRealTimers()
      destructor.execute()
    }
  })
})
