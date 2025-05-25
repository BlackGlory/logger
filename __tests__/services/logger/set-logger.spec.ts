import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { put } from 'extra-request'
import { url, pathname, json } from 'extra-request/transformers'
import { ILoggerConfig } from '@src/contract.js'
import { getLogger } from '@apis/get-logger.js'
import { setLogger } from '@apis/set-logger.js'
import { getLogs } from '@apis/get-logs.js'
import { log } from '@apis/log.js'

beforeEach(startService)
afterEach(stopService)

describe('setLogger', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const res = await fetch(put(
      url(getAddress())
    , pathname(`/loggers/${loggerId}`)
    , json<ILoggerConfig>({
        limit: 100
      , timeToLive: 200
      })
    ))

    expect(res.status).toBe(204)
    expect(getLogger(loggerId)).toStrictEqual({
      limit: 100
    , timeToLive: 200
    })
  })

  describe('logger exists', () => {
    test('reduce restrictions', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: 2
      , timeToLive: null
      })
      const logId1 = log(loggerId, 'content-1')
      const logId2 = log(loggerId, 'content-2')

      const res = await fetch(put(
        url(getAddress())
      , pathname(`/loggers/${loggerId}`)
      , json<ILoggerConfig>({
          limit: 10
        , timeToLive: null
        })
      ))

      expect(res.status).toBe(204)
      expect(getLogger(loggerId)).toStrictEqual({
        limit: 10
      , timeToLive: null
      })
      expect(getLogs(loggerId, [logId1, logId2])).toStrictEqual([
        'content-1'
      , 'content-2'
      ])
    })

    test('add restrictions', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: 10
      , timeToLive: null
      })
      const logId1 = log(loggerId, 'content-1')
      const logId2 = log(loggerId, 'content-2')

      const res = await fetch(put(
        url(getAddress())
      , pathname(`/loggers/${loggerId}`)
      , json<ILoggerConfig>({
          limit: 1
        , timeToLive: null
        })
      ))

      expect(res.status).toBe(204)
      expect(getLogger(loggerId)).toStrictEqual({
        limit: 1
      , timeToLive: null
      })
      expect(getLogs(loggerId, [logId1, logId2])).toStrictEqual([
        null
      , 'content-2'
      ])
    })
  })
})
