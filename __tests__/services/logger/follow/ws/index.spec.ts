import { startService, stopService, getAddress } from '@test/utils.js'
import WebSocket from 'ws'
import { waitForEventEmitter } from '@blackglory/wait-for'

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('open', async () => {
    const namespace = 'namespace'

    const ws = new WebSocket(`${getAddress()}/logger/${namespace}`.replace('http', 'ws'))
    await waitForEventEmitter(ws, 'open')
  })
})
