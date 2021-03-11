import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, searchParam, headers, json, text, header } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

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
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_DELETE_TOKEN_REQUIRED = 'true'
          const id = 'id'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('DELETE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          ))

          expect(res.status).toBe(204)
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
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('id does not need delete tokens', () => {
      describe('DELETE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.LOGGER_DELETE_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setDeleteToken({ id, token })

          const res = await fetch(del(
            url(getAddress())
          , pathname(`/logger/${id}/logs`)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
