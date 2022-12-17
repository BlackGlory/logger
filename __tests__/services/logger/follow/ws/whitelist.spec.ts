import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('namespace in whitelist', () => {
    it('open', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const namespace = 'namespace'
      await AccessControlDAO.addWhitelistItem(namespace)

      const ws = new WebSocket(`${getAddress()}/logger/${namespace}`.replace('http', 'ws'))
      await waitForEventEmitter(ws, 'open')
    })
  })

  describe('namespace not in whitelist', () => {
    it('error', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const namespace = 'namespace'

      const ws = new WebSocket(`${getAddress()}/logger/${namespace}`.replace('http', 'ws'))
      await waitForEventEmitter(ws, 'error')
    })
  })
})
