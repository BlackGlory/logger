import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('204', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = await buildServer()
        await AccessControlDAO.addWhitelistItem(id)

        const res = await server.inject({
          method: 'DELETE'
        , url: `/logger/${id}/logs`
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = await buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/logger/${id}/logs`
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('204', async () => {
        const id = 'id'
        const server = await buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/logger/${id}/logs`
        })

        expect(res.statusCode).toBe(204)
      })
    })
  })
})