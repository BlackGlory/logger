import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('Purge', () => {
  describe('POST /api/logger/:id/purge', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'POST'
        , url: `/api/logger/${id}/purge`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'POST'
        , url: `/api/logger/${id}/purge`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'POST'
        , url: `/api/logger/${id}/purge`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.LOGGER_ADMIN_PASSWORD }`
  }
}
