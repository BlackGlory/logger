import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { setLogger } from '@apis/set-logger.js'
import { writeLog } from '@dao/write-log.js'
import { LogId } from '@src/contract.js'

beforeEach(startService)
afterEach(stopService)

describe('getLogs', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'
    const loggerIds: LogId[] = ['0-0']

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs/${loggerIds.join(',')}`)
    ))

    expect(res.status).toBe(404)
  })

  test('logger exists', async () => {
    const loggerId = 'id'
    const logIds: LogId[] = ['0-0', '0-1']
    setLogger(loggerId, {
      limit: null
    , timeToLive: null
    })
    writeLog(loggerId, JSON.stringify('content'), 0)

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs/${logIds.join(',')}`)
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual(['content', null])
  })
})
