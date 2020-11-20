import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('blacklist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}/logs`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}/logs`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const id = 'id'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

        const res = await server.inject({
          method: 'GET'
        , url: `/logger/${id}/logs`
        })

        expect(res.statusCode).toBe(200)
      })
    })
  })
})
