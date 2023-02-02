import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('namespace in whitelist', () => {
    it('open', async () => {
      process.env.LOGGER_ADMIN_PASSWORD = 'password'
      process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const namespace = 'namespace'
      AccessControlDAO.Whitelist.addWhitelistItem(namespace)

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
