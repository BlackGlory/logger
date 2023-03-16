import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { setLogger } from '@apis/set-logger.js'

beforeEach(startService)
afterEach(stopService)

describe('getLogger', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/loggers/${loggerId}`)
    ))

    expect(res.status).toBe(404)
  })

  test('logger exists', async () => {
    const loggerId = 'id'
    setLogger(loggerId, {
      limit: 100
    , timeToLive: 200
    })

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/loggers/${loggerId}`)
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual({
      limit: 100
    , timeToLive: 200
    })
  })
})
