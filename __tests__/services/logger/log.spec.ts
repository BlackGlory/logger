import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json, text } from 'extra-request/transformers'
import { setLogger } from '@apis/set-logger.js'
import { queryLogs } from '@apis/query-logs.js'
import { Order } from '@src/contract.js'
import { jest } from '@jest/globals'

beforeEach(startService)
afterEach(stopService)

describe('log', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const res = await fetch(post(
      url(getAddress())
    , pathname(`/loggers/${loggerId}/log`)
    , json('value')
    ))

    expect(res.status).toBe(404)
  })

  describe('logger exists', () => {
    describe('value-type', () => {
      test('json', async () => {
        const loggerId = 'id'
        setLogger(loggerId, {
          limit: null
        , timeToLive: null
        })

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/loggers/${loggerId}/log`)
        , json('value')
        ))

        expect(res.status).toBe(204)
      })

      test('non-json', async () => {
        const loggerId = 'id'
        setLogger(loggerId, {
          limit: null
        , timeToLive: null
        })

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/loggers/${loggerId}/log`)
        , text('value')
        ))

        expect(res.status).toBe(415)
      })
    })

    test('limit', async () => {
      jest.useFakeTimers({ now: 0 })
      try {
        const loggerId = 'id'
        setLogger(loggerId, {
          limit: 1
        , timeToLive: null
        })

        await fetch(post(
          url(getAddress())
        , pathname(`/loggers/${loggerId}/log`)
        , json('value-1')
        ))
        await fetch(post(
          url(getAddress())
        , pathname(`/loggers/${loggerId}/log`)
        , json('value-2')
        ))

        expect(queryLogs(loggerId, { order: Order.Asc })).toStrictEqual([
          {
            id: '0-1'
          , value: 'value-2'
          }
        ])
      } finally {
        jest.useRealTimers()
      }
    })

    test('time to live', async () => {
      jest.useFakeTimers({ now: 0 })
      try {
        const loggerId = 'id'
        setLogger(loggerId, {
          limit: null
        , timeToLive: 1000
        })

        await fetch(post(
          url(getAddress())
        , pathname(`/loggers/${loggerId}/log`)
        , json('value-1')
        ))
        jest.useFakeTimers({ now: 1100 })
        await fetch(post(
          url(getAddress())
        , pathname(`/loggers/${loggerId}/log`)
        , json('value-2')
        ))

        expect(queryLogs(loggerId, { order: Order.Asc })).toStrictEqual([
          {
            id: '1100-0'
          , value: 'value-2'
          }
        ])
      } finally {
        jest.useRealTimers()
      }
    })
  })
})
