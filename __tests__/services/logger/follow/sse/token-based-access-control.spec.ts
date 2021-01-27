import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const es = new EventSource(`${address}/logger/${id}?token=${token}`)
            await waitForEventTarget(es as EventTarget, 'open')
            es.close()
          } finally {
            await server.close()
          }
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}`
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
          const server = await buildServer()
          await AccessControlDAO.setReadTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}`
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not have read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const server = await buildServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/logger/${id}`
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'false'
          const id = 'id'
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const es = new EventSource(`${address}/logger/${id}`)
            await waitForEventTarget(es as EventTarget, 'open')
            es.close()
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
        it('200', async () => {
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)
          await AccessControlDAO.setDeleteTokenRequired(id, true)
          await AccessControlDAO.setReadToken({ id, token })

          try {
            const es = new EventSource(`${address}/logger/${id}?token=${token}`)
            await waitForEventTarget(es as EventTarget, 'open')
            es.close()
          } finally {
            await server.close()
          }
        })
      })
    })

    describe('id does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.LOGGER_READ_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
          const server = await buildServer()
          const address = await server.listen(0)

          try {
            const es = new EventSource(`${address}/logger/${id}?token=${token}`)
            await waitForEventTarget(es as EventTarget, 'open')
            es.close()
          } finally {
            await server.close()
          }
        })
      })
    })
  })
})
