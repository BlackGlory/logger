import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const server = getServer()
    const id = 'id'

    const res = await server.inject({
      method: 'DELETE'
    , url: `/logger/${id}/logs`
    })

    expect(res.statusCode).toBe(204)
  })
})
