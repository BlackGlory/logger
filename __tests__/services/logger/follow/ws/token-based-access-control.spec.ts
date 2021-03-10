import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('open', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}?token=${token}`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'open')
          } finally {
            await server.close()
          }
        })
      })

      describe('token does not matched', () => {
        it('error', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}?token=bad`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'error')
          } finally {
            await server.close()
          }
        })
      })

      describe('no token', () => {
        it('error', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = getServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'error')
          } finally {
            await server.close()
          }
        })
      })
    })

    describe('id does not have read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('error', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = getServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'error')
          } finally {
            await server.close()
          }
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('open', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'false'
          const id = 'id'
          const server = getServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'open')
          } finally {
            await server.close()
          }
        })
      })
    })
  })

  describe('disabled', () => {
    describe('id need read tokens', () => {
      describe('no token', () => {
        it('open', async () => {
          const id = 'id'
          const token = 'token'
          const server = getServer()
          const address = await server.listen(0)
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'open')
          } finally {
            await server.close()
          }
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('open', async () => {
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = getServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEventEmitter(ws, 'open')
          } finally {
            await server.close()
          }
        })
      })
    })
  })
})
