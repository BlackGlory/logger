import { buildServer } from '@src/server'
import { prepareDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import EventSource = require('eventsource')
import { waitForEventTarget } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabases()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('200', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        await AccessControlDAO.addWhitelistItem(id)
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

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}`
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('200', async () => {
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
