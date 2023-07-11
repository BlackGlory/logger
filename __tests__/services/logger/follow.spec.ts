import { startService, stopService, getAddress } from '@test/utils.js'
import { IEvent, fetchEvents } from 'extra-sse'
import { getErrorAsyncIterable } from 'return-style'
import { log } from '@apis/log.js'
import { setLogger } from '@apis/set-logger.js'
import { removeLogger } from '@apis/remove-logger.js'
import { delay } from 'extra-promise'
import { NotFound } from '@blackglory/http-status'
import { firstAsync, toArrayAsync } from 'iterable-operator'
import { AbortController } from 'extra-abort'
import { go, pass } from '@blackglory/prelude'
import { Request } from 'extra-fetch'

beforeEach(startService)
afterEach(stopService)

describe('follow', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const err = await getErrorAsyncIterable(
      fetchEvents(`${getAddress()}/loggers/${loggerId}/follow`, {
        autoReconnect: false
      })
    )

    expect(err).toBeInstanceOf(NotFound)
  })

  describe('logger exists', () => {
    test('receive log', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })

      const iter = fetchEvents(`${getAddress()}/loggers/${loggerId}/follow`, {
        autoReconnect: false
      })
      const promise = firstAsync(iter)
      await delay(500)
      const logId = log(loggerId, 'value')
      const result = await promise

      expect(result).toStrictEqual({
        comment: undefined
      , event: undefined
      , data: JSON.stringify('value')
      , id: logId
      , retry: undefined
      })
    })

    test('remove logger while following', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })

      const iter = fetchEvents(`${getAddress()}/loggers/${loggerId}/follow`, {
        autoReconnect: false
      })
      const promise = toArrayAsync(iter)
      await delay(500)
      removeLogger(loggerId)
      const results = await promise

      expect(results).toStrictEqual([])
    })

    test('since', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })
      const logId1 = log(loggerId, 'value-1')
      const logId2 = log(loggerId, 'value-2')

      const controller = new AbortController()
      try {
        const iter = fetchEvents(
          () => new Request(`${getAddress()}/loggers/${loggerId}/follow?since=${logId1}`, {
            signal: controller.signal
          })
        , { autoReconnect: false }
        )
        const results: IEvent[] = []
        go(async () => {
          for await (const result of iter) {
            results.push(result)
          }
        }).catch(pass)
        await delay(500)
        const logId3 = log(loggerId, 'value-3')
        await delay(500)

        expect(results.length).toBe(2)
        expect(results[0]).toStrictEqual({
          comment: undefined
        , event: undefined
        , data: JSON.stringify('value-2')
        , id: logId2
        , retry: undefined
        })
        expect(results[1]).toStrictEqual({
          comment: undefined
        , event: undefined
        , data: JSON.stringify('value-3')
        , id: logId3
        , retry: undefined
        })
      } finally {
        controller.abort()
      }
    })

    test('Last-Event-ID', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })
      const logId1 = log(loggerId, 'value-1')
      const logId2 = log(loggerId, 'value-2')

      const controller = new AbortController()
      try {
        const iter = fetchEvents(
          () => new Request(`${getAddress()}/loggers/${loggerId}/follow`, {
            signal: controller.signal
          })
        , {
            autoReconnect: false
          , lastEventId: logId1
          }
        )
        const results: IEvent[] = []
        go(async () => {
          for await (const result of iter) {
            results.push(result)
          }
        }).catch(pass)
        await delay(500)
        const logId3 = log(loggerId, 'value-3')
        await delay(500)

        expect(results.length).toBe(2)
        expect(results[0]).toStrictEqual({
          comment: undefined
        , event: undefined
        , data: JSON.stringify('value-2')
        , id: logId2
        , retry: undefined
        })
        expect(results[1]).toStrictEqual({
          comment: undefined
        , event: undefined
        , data: JSON.stringify('value-3')
        , id: logId3
        , retry: undefined
        })
      } finally {
        controller.abort()
      }
    })
  })
})
