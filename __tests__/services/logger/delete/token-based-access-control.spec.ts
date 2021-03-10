import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need delete tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/logger/${id}/logs`
          , query: { token }
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await server.inject({
            method: 'DELETE'
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
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_DELETE_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = getServer()

          const res = await server.inject({
            method: 'DELETE'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('DELETE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const server = getServer()

          const res = await server.inject({
            method: 'DELETE'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need delete tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.LOGGER_DELETE_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await server.inject({
            method: 'DELETE'
          , url: `/logger/${id}/logs`
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })
  })
})
