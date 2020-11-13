import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('no access control', () => {
  describe('LOGGER_JSON_VALIDATION=true', () => {
    describe('LOGGER_JSON_DEFAULT_SCHEMA', () => {
      describe('Content-Type: application/json', () => {
        describe('valid', () => {
          it('204', async () => {
            process.env.LOGGER_JSON_VALIDATION = 'true'
            process.env.LOGGER_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            const server = await buildServer()
            const id = 'id'
            const message = '123'

            const res = await server.inject({
              method: 'POST'
            , url: `/logger/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid', () => {
          it('400', async () => {
            process.env.LOGGER_JSON_VALIDATION = 'true'
            process.env.LOGGER_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            const server = await buildServer()
            const id = 'id'
            const message = ' "message" '

            const res = await server.inject({
              method: 'POST'
            , url: `/logger/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('204', async () => {
          process.env.LOGGER_JSON_VALIDATION = 'true'
          process.env.LOGGER_DEFAULT_JSON_SCHEMA = JSON.stringify({
            type: 'number'
          })
          const server = await buildServer()
          const id = 'id'
          const message = 'message'

          const res = await server.inject({
            method: 'POST'
          , url: `/logger/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id has JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async () => {
            process.env.LOGGER_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = ' "message" '
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })
            const server = await buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/logger/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.LOGGER_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = 'message'
            const server = await buildServer()
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            const res = await server.inject({
              method: 'POST'
            , url: `/logger/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('400', async () => {
          process.env.LOGGER_JSON_VALIDATION = 'true'
          const id = 'id'
          const schema = { type: 'string' }
          const message = ' "message" '
          const server = await buildServer()
          await JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await server.inject({
            method: 'POST'
          , url: `/logger/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })

          expect(res.statusCode).toBe(400)
        })
      })
    })

    describe('id does not have JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async () => {
            process.env.LOGGER_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = ' "message" '
            const server = await buildServer()
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            const res = await server.inject({
              method: 'POST'
            , url: `/logger/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.LOGGER_JSON_VALIDATION = 'true'
            const id = 'id'
            const message = 'message'
            const server = await buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/logger/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })
    })
  })

  describe('LOGGER_JSON_PAYLOAD_ONLY', () => {
    describe('Content-Type: application/json', () => {
      it('accpet any plaintext, return 204', async () => {
        process.env.LOGGER_JSON_PAYLOAD_ONLY = 'true'
        const server = await buildServer()
        const id = 'id'
        const message = JSON.stringify('message')

        const res = await server.inject({
          method: 'POST'
        , url: `/logger/${id}`
        , payload: message
        , headers: {
            'Content-Type': 'application/json'
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('other Content-Type', () => {
      it('400', async () => {
        process.env.LOGGER_JSON_PAYLOAD_ONLY = 'true'
        const server = await buildServer()
        const id = 'id'
        const message = 'message'

        const res = await server.inject({
          method: 'POST'
        , url: `/logger/${id}`
        , payload: message
        , headers: {
            'Content-Type': 'text/plain'
          }
        })

        expect(res.statusCode).toBe(400)
      })
    })
  })

  describe('Content-Type', () => {
    it('accpet any content-type', async () => {
      const server = await buildServer()
      const id = 'id'
      const message = 'message'

      const res = await server.inject({
        method: 'POST'
      , url: `/logger/${id}`
      , payload: message
      , headers: {
          'Content-Type': 'apple/banana'
        }
      })

      expect(res.statusCode).toBe(204)
    })
  })
})
