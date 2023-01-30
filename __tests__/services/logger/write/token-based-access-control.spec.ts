import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, searchParam, text } from 'extra-request/transformers'

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need write tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , searchParam('token', token)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , searchParam('token', 'bad')
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_WRITE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const message = 'message'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_WRITE_TOKEN_REQUIRED = 'false'
          const namespace = 'namespace'
          const message = 'message'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need write tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.LOGGER_WRITE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/logger/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
