import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import WebSocket = require('ws')
import { waitForEventEmitter } from '@blackglory/wait-for'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
jest.mock('@dao/logger/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('blackllist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('error', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        await AccessControlDAO.addBlacklistItem(id)
        const server = await buildServer()
        const address = await server.listen(0)

        try {
          const ws = new WebSocket(`${address}/logger/${id}`.replace('http', 'ws'))
          await waitForEventEmitter(ws, 'error')
        } finally {
          await server.close()
        }
      })
    })

    describe('id not in blacklist', () => {
      it('open', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('open', async () => {
        const id = 'id'
        await AccessControlDAO.addBlacklistItem(id)
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

  })
})
