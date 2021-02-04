import { resetEmitter } from '@dao/data-in-memory/pubsub/emitter-instance'
import { PubSubDAO } from '@dao/data-in-memory/pubsub'

beforeEach(() => {
  resetEmitter()
})

describe('PubSubDAO', () => {
  test('publish, subscribe', async done => {
    const loggerId = 'logger-id'
    const logId = 'log-id'
    const payload = 'payload'

    PubSubDAO.publish(loggerId, { id: logId, payload })
    PubSubDAO.subscribe(loggerId, () => done.fail())
    setImmediate(done)
  })

  test('subscribe, publish', async done => {
    const loggerId = 'logger-id'
    const logId = 'log-id'
    const payload = 'payload'

    PubSubDAO.subscribe(loggerId, val => {
      expect(val).toStrictEqual({ id: logId, payload })
      done()
    })
    PubSubDAO.publish(loggerId, { id: logId, payload })
  })

  test('subscribe, unsubscribe, publish', async done => {
    const loggerId = 'logger-id'
    const logId = 'log-id'
    const payload = 'payload'

    const unsubscribe = PubSubDAO.subscribe(loggerId, () => done.fail())
    unsubscribe()
    PubSubDAO.publish(loggerId, { id: logId, payload })
    setImmediate(done)
  })
})
