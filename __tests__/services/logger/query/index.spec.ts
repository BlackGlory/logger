import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { logIdSchema } from '@src/schema'
import { prepareLoggers } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('200', async () => {
    const server = await buildServer()
    const id = 'id'
    prepareLoggers()

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
