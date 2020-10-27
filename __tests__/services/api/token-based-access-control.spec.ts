import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { tokenSchema } from '@src/schema'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('TBAC', () => {
  describe('GET /api/logger-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/logger-with-tokens'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/logger-with-tokens'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/logger-with-tokens'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/logger/:id/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/logger/${id}/tokens`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              token: tokenSchema
            , log: { type: 'boolean' }
            , follow: { type: 'boolean' }
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/logger/${id}/tokens`
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
          method: 'GET'
        , url: `/api/logger/${id}/tokens`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/logger/:id/tokens/:token/log', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/tokens/${token}/log`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/tokens/${token}/log`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/tokens/${token}/log`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/logger/:id/tokens/:token/log', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/tokens/${token}/log`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/tokens/${token}/log`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/tokens/${token}/log`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/logger/:id/tokens/:token/follow', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/tokens/${token}/follow`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/tokens/${token}/follow`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/tokens/${token}/follow`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/logger/:id/tokens/:token/follow', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/tokens/${token}/follow`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/tokens/${token}/follow`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/tokens/${token}/follow`
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
