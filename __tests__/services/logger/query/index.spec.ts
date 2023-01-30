import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils.js'
import { logIdSchema } from '@src/schema.js'
import { prepareLoggers } from './utils.js'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/transformers'
import { toJSON } from 'extra-response'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespace = 'namespace'
    prepareLoggers([namespace])

    const res = await fetch(get(
      url(getAddress())
    , pathname(`/logger/${namespace}/logs`)
    ))

    expect(res.status).toBe(200)
    expectMatchSchema(await toJSON(res), {
      type: 'array'
    , items: {
        type: 'object'
      , properties: {
          id: logIdSchema
        , payload: { type: 'string' }
        }
      }
    })
  })
})
