import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'
import { setLoggerConfiguration } from '@dao/set-logger-configuration.js'

beforeEach(startService)
afterEach(stopService)

describe('getAllLoggerIds', () => {
  test('empty', async () => {
    const res = await fetch(get(
      url(getAddress())
    , pathname('/loggers')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual([])
  })

  test('non-empty', async () => {
    setLoggerConfiguration('id', {
      limit: null
    , timeToLive: null
    })

    const res = await fetch(get(
      url(getAddress())
    , pathname('/loggers')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual(['id'])
  })
})
