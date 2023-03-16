import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { del } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { getLogger } from '@apis/get-logger.js'
import { setLogger } from '@apis/set-logger.js'

beforeEach(startService)
afterEach(stopService)

describe('removeLogger', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/loggers/${loggerId}`)
    ))

    expect(res.status).toBe(204)
  })

  test('logger exists', async () => {
    const loggerId = 'id'
    setLogger(loggerId, {
      limit: null
    , timeToLive: null
    })

    const res = await fetch(del(
      url(getAddress())
    , pathname(`/loggers/${loggerId}`)
    ))

    expect(res.status).toBe(204)
    expect(getLogger(loggerId)).toBe(null)
  })
})
