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

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('open', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      await AccessControlDAO.addWhitelistItem(id)
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

  describe('id not in whitelist', () => {
    it('error', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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
})