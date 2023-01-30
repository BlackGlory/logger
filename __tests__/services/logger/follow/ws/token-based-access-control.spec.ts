import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('namespace need read tokens', () => {
      describe('token matched', () => {
        it('open', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })
          const url = `${getAddress()}/logger/${namespace}?token=${token}`
            .replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'open')
        })
      })

      describe('token does not matched', () => {
        it('error', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })
          const url = `${getAddress()}/logger/${namespace}?token=bad`
            .replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'error')
        })
      })

      describe('no token', () => {
        it('error', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })
          const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'error')
        })
      })
    })

    describe('namespace does not have read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('error', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'error')
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('open', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'false'
          const namespace = 'namespace'
          const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'open')
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need read tokens', () => {
      describe('no token', () => {
        it('open', async () => {
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setDeleteTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })
          const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'open')
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('open', async () => {
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

          const ws = new WebSocket(url)
          await waitForEventEmitter(ws, 'open')
        })
      })
    })
  })
})
