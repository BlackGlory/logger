import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest'
import { startService, stopService } from '@test/utils.js'
import { startMaintainer } from '@src/maintainer.js'
import { SyncDestructor } from 'extra-defer'
import { setLogger } from '@apis/set-logger.js'
import { log } from '@apis/log.js'
import { hasRawLog } from './dao.js'

describe('maintainer', () => {
  describe('behaviors on startup', () => {
    beforeEach(() => startService({ maintainer: false }))
    afterEach(stopService)

    test('remove outdated logs', () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const loggerId = 'logger-id'
        setLogger(loggerId, {
          timeToLive: 100
        , limit: null
        })
        log(loggerId, 'log')
        vi.advanceTimersByTime(100)

        const logExists1 = hasRawLog(loggerId, 0, 0)
        destructor.defer(startMaintainer())
        const logExists2 = hasRawLog(loggerId, 0, 0)

        expect(logExists1).toBe(true)
        expect(logExists2).toBe(false)
      } finally {
        vi.useRealTimers()
        destructor.execute()
      }
    })
  })

  describe('behaviors after startup', () => {
    beforeEach(startService)
    afterEach(stopService)

    test('remove oudated logs', async () => {
      const destructor = new SyncDestructor()
      try {
        vi.useFakeTimers({ now: 0 })
        const loggerId = 'logger-id'
        setLogger(loggerId, {
          timeToLive: 100
        , limit: null
        })

        log(loggerId, 'log')
        vi.advanceTimersByTime(99)
        const log1Exists1 = hasRawLog(loggerId, 0, 0)
        vi.advanceTimersByTime(1)
        const log1Exists2 = hasRawLog(loggerId, 0, 0)

        expect(log1Exists1).toBe(true)
        expect(log1Exists2).toBe(false)
      } finally {
        vi.useRealTimers()
        destructor.execute()
      }
    })
  })
})
