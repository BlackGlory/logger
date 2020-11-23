import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
jest.mock('@dao/purge-policy/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('200', async () => {
    const server = await buildServer()
    const id = 'id'

    const res = await server.inject({
      method: 'DELETE'
    , url: `/logger/${id}/logs`
    })

    expect(res.statusCode).toBe(204)
  })
})
