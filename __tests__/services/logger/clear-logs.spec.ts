import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { setLogger } from '@apis/set-logger.js'
import { log } from '@apis/log.js'
import { getLogs } from '@apis/get-logs.js'

beforeEach(startService)
afterEach(stopService)

describe('clearLogs', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs`)
    ))

    expect(res.status).toBe(204)
  })

  test('logger exists', async () => {
    const loggerId = 'id'
    setLogger(loggerId, {
      limit: null
    , timeToLive: null
    })
    const logId = log(loggerId, 'content')

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs`)
    ))

    expect(res.status).toBe(204)
    expect(getLogs(loggerId, [logId])).toStrictEqual([null])
  })
})
