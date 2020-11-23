import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import EventSource = require('eventsource')
import { waitForEventTarget } from '@blackglory/wait-for'

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
  it('200', async () => {
    const id = 'id'
    const server = await buildServer()
    const address = await server.listen(0)

    try {
      const es = new EventSource(`${address}/logger/${id}`)
      await waitForEventTarget(es as EventTarget, 'open')
      es.close()
    } finally {
      await server.close()
    }
  })
})
