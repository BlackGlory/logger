import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
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
  await prepareDatabase()
})

describe('blackllist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const id = 'id'
        const server = await buildServer()
        const address = await server.listen(0)
        await AccessControlDAO.addBlacklistItem(id)

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
