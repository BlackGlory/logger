import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('open', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      await AccessControlDAO.addWhitelistItem(id)

      const ws = new WebSocket(`${getAddress()}/logger/${id}`.replace('http', 'ws'))
      await waitForEventEmitter(ws, 'open')
    })
  })

  describe('id not in whitelist', () => {
    it('error', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'

      const ws = new WebSocket(`${getAddress()}/logger/${id}`.replace('http', 'ws'))
      await waitForEventEmitter(ws, 'error')
    })
  })
})
