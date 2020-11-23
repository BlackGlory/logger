import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import WebSocket = require('ws')
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
jest.mock('@dao/purge-policy/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('no access control', () => {
  it('open', async () => {
    const id = 'id'
    const server = await buildServer()
    const address = await server.listen(0)

    try {
      const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
      await waitForEventEmitter(ws, 'open')
    } finally {
      await server.close()
    }
  })
})
