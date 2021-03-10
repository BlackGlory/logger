import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { logIdSchema } from '@src/schema'
import { prepareLoggers } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const server = getServer()
    const id = 'id'
    prepareLoggers(['logger-id'])

    const res = await server.inject({
      method: 'GET'
    , url: `/logger/${id}/logs`
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toMatchSchema({
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
