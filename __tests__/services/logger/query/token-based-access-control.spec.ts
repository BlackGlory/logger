import { startService, stopService, getServer } from '@test/utils'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          , query: { token }
          })

          expect(res.statusCode).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          , query: { token: 'bad' }
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = getServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'false'
          const id = 'id'
          const server = getServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need read tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          , query: { token }
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}/logs`
          , query: { token }
          })

          expect(res.statusCode).toBe(200)
        })
      })
    })
  })
})
