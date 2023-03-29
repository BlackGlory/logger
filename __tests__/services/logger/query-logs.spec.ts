import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname, appendSearchParam } from 'extra-request/transformers'
import { setLogger } from '@apis/set-logger.js'
import { writeLog } from '@dao/write-log.js'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('queryLogs', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs`)
    , appendSearchParam('order', 'desc')
    ))

    expect(res.status).toBe(404)
  })

  test('logger exists', async () => {
    const loggerId = 'id'
    setLogger(loggerId, {
      limit: null
    , timeToLive: null
    })
    writeLog(loggerId, JSON.stringify('value-1'), 0)
    writeLog(loggerId, JSON.stringify('value-2'), 0)
    writeLog(loggerId, JSON.stringify('value-3'), 1)

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/logs`)
    , appendSearchParam('order', 'desc')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual([
      {
        id: '1-0'
      , value: 'value-3'
      }
    , {
        id: '0-1'
      , value: 'value-2'
      }
    , {
        id: '0-0'
      , value: 'value-1'
      }
    ])
  })
})
