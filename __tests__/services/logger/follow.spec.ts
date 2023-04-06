import { startService, stopService, getAddress } from '@test/utils.js'
import EventSource from 'eventsource'
import { waitForEventTarget, waitForFunction } from '@blackglory/wait-for'
import { log } from '@apis/log.js'
import { setLogger } from '@apis/set-logger.js'
import { removeLogger } from '@apis/remove-logger.js'
import { LogId } from '@src/contract.js'
import { delay } from 'extra-promise'
import { jest } from '@jest/globals'

beforeEach(startService)
afterEach(stopService)

describe('follow', () => {
  test('logger does not exist', async () => {
    const loggerId = 'id'

    const es = new EventSource(`${getAddress()}/loggers/${loggerId}/follow`)
    try {
      await waitForEventTarget(es as EventTarget, 'error')
    } finally {
      es.close()
    }
  })

  describe('logger exists', () => {
    test('receive log', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })

      const es = new EventSource(`${getAddress()}/loggers/${loggerId}/follow`)
      try {
        await waitForEventTarget(es as EventTarget, 'open')
        let logId: LogId
        queueMicrotask(() => {
          logId = log(loggerId, 'value')
        })
        const event = await waitForEventTarget(es as EventTarget, 'message') as MessageEvent

        expect(event.lastEventId).toBe(logId!)
        expect(event.data).toStrictEqual(JSON.stringify('value'))
      } finally {
        es.close()
      }
    })

    test('remove logger while following', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })

      const es = new EventSource(`${getAddress()}/loggers/${loggerId}/follow`)
      try {
        await waitForEventTarget(es as EventTarget, 'open')
        queueMicrotask(() => {
          removeLogger(loggerId)
        })
        await waitForFunction(() => es.readyState === es.CLOSED)
      } finally {
        es.close()
      }
    })

    test('since', async () => {
      const loggerId = 'id'
      setLogger(loggerId, {
        limit: null
      , timeToLive: null
      })
      const logId1 = log(loggerId, 'value-1')
      const logId2 = log(loggerId, 'value-2')

      const es = new EventSource(
        `${getAddress()}/loggers/${loggerId}/follow?since=${logId1}`
      )
      try {
        const listener = jest.fn()
        es.addEventListener('message', listener)
        await waitForEventTarget(es as EventTarget, 'open')
        const logId3 = log(loggerId, 'value-3')
        await delay(1000)

        expect(listener).toBeCalledTimes(2)
        const event1 = listener.mock.calls[0][0] as MessageEvent
        expect(event1.data).toStrictEqual(JSON.stringify('value-2'))
        expect(event1.lastEventId).toBe(logId2)
        const event2 = listener.mock.calls[1][0] as MessageEvent
        expect(event2.data).toStrictEqual(JSON.stringify('value-3'))
        expect(event2.lastEventId).toBe(logId3)
      } finally {
        es.close()
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

      const es = new EventSource(
        `${getAddress()}/loggers/${loggerId}/follow`
      , {
          headers: {
            'Last-Event-ID': logId1
          }
        }
      )
      try {
        const listener = jest.fn()
        es.addEventListener('message', listener)
        await waitForEventTarget(es as EventTarget, 'open')
        const logId3 = log(loggerId, 'value-3')
        await delay(1000)

        expect(listener).toBeCalledTimes(2)
        const event1 = listener.mock.calls[0][0] as MessageEvent
        expect(event1.data).toStrictEqual(JSON.stringify('value-2'))
        expect(event1.lastEventId).toBe(logId2)
        const event2 = listener.mock.calls[1][0] as MessageEvent
        expect(event2.data).toStrictEqual(JSON.stringify('value-3'))
        expect(event2.lastEventId).toBe(logId3)
      } finally {
        es.close()
      }
    })
  })
})
