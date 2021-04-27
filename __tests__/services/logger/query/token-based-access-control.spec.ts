import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, searchParam, headers, json, text, header } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(200)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          , searchParam('token', 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'false'
          const namespace = 'namespace'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need read tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(200)
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/logger/${namespace}/logs`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(200)
        })
      })
    })
  })
})
