import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('200', async () => {
        const id = 'id'
        const message = 'message'
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const server = await buildServer()
        await AccessControlDAO.addWhitelistItem(id)

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}/logs`
        , payload: message
        })

        expect(res.statusCode).toBe(200)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const message = 'message'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}/logs`
        , payload: message
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('200', async () => {
        const id = 'id'
        const message = 'message'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}/logs`
        , payload: message
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })
})
