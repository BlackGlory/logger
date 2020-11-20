import { buildServer } from '@src/server'
import { prepareDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabases()
})

describe('json schema', () => {
  describe('GET /api/logger-with-json-schema', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/logger-with-json-schema'
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
        , url: '/api/logger-with-json-schema'
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
        , url: '/api/logger-with-json-schema'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/logger/<id>/json-schema', () => {
    describe('auth', () => {
      describe('exist', () => {
        it('200', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          const server = await buildServer()
          const id = 'id'
          const schema = { type: 'number' }
          await JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await server.inject({
            method: 'GET'
          , url: `/api/logger/${id}/json-schema`
          , headers: createAuthHeaders()
          })

          expect(res.statusCode).toBe(200)
          expect(res.json()).toEqual(schema)
        })
      })

      describe('not exist', () => {
        it('404', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          const server = await buildServer()
          const id = 'id'

          const res = await server.inject({
            method: 'GET'
          , url: `/api/logger/${id}/json-schema`
          , headers: createAuthHeaders()
          })

          expect(res.statusCode).toBe(404)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/logger/${id}/json-schema`
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
        , url: `/api/logger/${id}/json-schema`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/logger/<id>/json-schema', () => {
    describe('auth', () => {
      describe('valid JSON', () => {
        it('204', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          const server = await buildServer()
          const id = 'id'
          const schema = { type: 'number' }

          const res = await server.inject({
            method: 'PUT'
          , url: `/api/logger/${id}/json-schema`
          , headers: {
              ...createAuthHeaders()
            , ...createJsonHeaders()
            }
          , payload: schema
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('invalid JSON', () => {
        it('400', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          const server = await buildServer()
          const id = 'id'

          const res = await server.inject({
            method: 'PUT'
          , url: `/api/logger/${id}/json-schema`
          , headers: {
              ...createAuthHeaders()
            , ...createJsonHeaders()
            }
          , payload: ''
          })

          expect(res.statusCode).toBe(400)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = await buildServer()
        const id = 'id'
        const schema = { type: 'number' }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/json-schema`
        , headers: createJsonHeaders()
        , payload: schema
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'
        const schema = { type: 'number' }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/logger/${id}/json-schema`
        , headers: {
            ...createAuthHeaders('bad')
          , ...createJsonHeaders()
          }
        , payload: schema
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/logger/<id>/json-schema', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const server = await buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/logger/${id}/json-schema`
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
          method: 'DELETE'
        , url: `/api/logger/${id}/json-schema`
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
          method: 'DELETE'
        , url: `/api/logger/${id}/json-schema`
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

function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
