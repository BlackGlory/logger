import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { DAO } from '@dao'
import WebSocket = require('ws')
import { waitForEvent } from '@blackglory/wait-for'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('token-based access control', () => {
  describe('id has follow tokens', () => {
    describe('token matched', () => {
      it('open', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        await DAO.setFollowToken({ id, token })
        const server = await buildServer()
        const address = await server.listen(0)

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
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const server = await buildServer()
        const address = await server.listen(0)
        await DAO.setFollowToken({ id, token })

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
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const server = await buildServer()
        const address = await server.listen(0)
        await DAO.setFollowToken({ id, token })

        try {
          const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
          await waitForEvent(ws as unknown as EventTarget, 'error')
        } finally {
          await server.close()
        }
      })
    })
  })

  describe('id does not have follow tokens', () => {
    describe('id has log tokens', () => {
      it('open', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        await DAO.setLogToken({ id, token })
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

    describe('id has no tokens', () => {
      describe('DISABLE_NO_TOKENS', () => {
        it('error', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_DISABLE_NO_TOKENS = 'true'
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

      describe('not DISABLE_NO_TOKENS', () => {
        it('open', async () => {
          process.env.LOGGER_ADMIN_PASSWORD = 'password'
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
