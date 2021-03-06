import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('open', async () => {
    const namespace = 'namespace'

    const ws = new WebSocket(`${getAddress()}/logger/${namespace}`.replace('http', 'ws'))
    await waitForEventEmitter(ws, 'open')
  })
})
