import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('open', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}?token=${token}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
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
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}?token=bad`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'error')
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
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'error')
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
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'error')
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
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
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
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
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
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
            await waitForEvent(ws as unknown as EventTarget, 'open')
          } finally {
            await server.close()
          }
        })
      })
    })
  })
})