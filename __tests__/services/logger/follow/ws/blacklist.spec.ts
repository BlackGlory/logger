import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('blackllist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('error', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        await AccessControlDAO.addBlacklistItem(namespace)
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
        await AccessControlDAO.addBlacklistItem(namespace)
        const url = `${getAddress()}/logger/${namespace}`.replace('http', 'ws')

        const ws = new WebSocket(url)
        await waitForEventEmitter(ws, 'open')
      })
    })
  })
})
