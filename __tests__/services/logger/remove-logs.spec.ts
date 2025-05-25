import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { setLogger } from '@apis/set-logger.js'
import { getLogs } from '@apis/get-logs.js'
import { writeLog } from '@dao/write-log.js'
import { LogId } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('removeLogs', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'
    const logs: LogId[] = ['0-0']

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs/${logs.join(',')}`)
    ))

    expect(res.status).toBe(204)
  })

  test('logger exists', async () => {
    const loggerId = 'id'
    const logIds: LogId[] = ['0-0', '0-1']
    setLogger(loggerId, {
      limit: null
    , timeToLive: null
    })
    writeLog(loggerId, JSON.stringify('content'), 0)

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs/${logIds.join(',')}`)
    ))

    expect(res.status).toBe(204)
    expect(getLogs(loggerId, logIds)).toStrictEqual([null, null])
  })
})
