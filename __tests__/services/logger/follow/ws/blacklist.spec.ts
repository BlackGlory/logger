import { startService, stopService, getAddress } from '@test/utils.js'
import { AccessControlDAO } from '@dao/index.js'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

describe('blackllist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('error', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)
        const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

        const ws = new WebSocket(url)
        await waitForEventEmitter(ws, 'error')
      })
    })

    describe('namespace not in blacklist', () => {
      it('open', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')


        const ws = new WebSocket(url)
        await waitForEventEmitter(ws, 'open')
      })
    })
  })

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('open', async () => {
        const namespace = 'namespace'
        AccessControlDAO.Blacklist.addBlacklistItem(namespace)
        const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

        const ws = new WebSocket(url)
        await waitForEventEmitter(ws, 'open')
      })
    })
  })
})
