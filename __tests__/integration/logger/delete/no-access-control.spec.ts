import { buildServer } from '@src/server'
import { prepareDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabases()
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
