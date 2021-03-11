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

describe('blackllist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('error', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        await AccessControlDAO.addBlacklistItem(id)

        const ws = new WebSocket(`${getAddress()}/logger/${id}`.replace('http', 'ws'))
        await waitForEventEmitter(ws, 'error')
      })
    })

    describe('id not in blacklist', () => {
      it('open', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'

        const ws = new WebSocket(`${getAddress()}/logger/${id}`.replace('http', 'ws'))
        await waitForEventEmitter(ws, 'open')
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('open', async () => {
        const id = 'id'
        await AccessControlDAO.addBlacklistItem(id)

        const ws = new WebSocket(`${getAddress()}/logger/${id}`.replace('http', 'ws'))
        await waitForEventEmitter(ws, 'open')
      })
    })
  })
})
