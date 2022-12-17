import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils'
import { logIdSchema } from '@src/schema'
import { prepareLoggers } from './utils'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

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
