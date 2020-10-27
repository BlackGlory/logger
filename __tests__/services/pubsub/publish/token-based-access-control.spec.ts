import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { DAO } from '@dao'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('token-based access control', () => {
  describe('id has log tokens', () => {
    describe('token matched', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await DAO.setLogToken({ id, token })

        const res = await server.inject({
          method: 'POST'
        , url: `/logger/${id}`
        , query: { token }
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('token does not matched', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await DAO.setLogToken({ id, token })

        const res = await server.inject({
          method: 'POST'
        , url: `/logger/${id}`
        , query: { token: 'bad' }
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('no token', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await DAO.setLogToken({ id, token })

        const res = await server.inject({
          method: 'POST'
        , url: `/logger/${id}`
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('id does not have log tokens', () => {
    describe('id has follow tokens', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await DAO.setFollowToken({ id, token })

        const res = await server.inject({
          method: 'POST'
        , url: `/logger/${id}`
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('id has no tokens', () => {
      describe('DISABLE_NO_TOKENS', () => {
        it('403', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_DISABLE_NO_TOKENS = 'true'
          const id = 'id'
          const message = 'message'
          const server = await buildServer()

          const res = await server.inject({
            method: 'POST'
          , url: `/logger/${id}`
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })

          expect(res.statusCode).toBe(403)
        })
      })

      describe('not DISABLE_NO_TOKENS', () => {
        it('204', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const message = 'message'
          const server = await buildServer()

          const res = await server.inject({
            method: 'POST'
          , url: `/logger/${id}`
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })
})
