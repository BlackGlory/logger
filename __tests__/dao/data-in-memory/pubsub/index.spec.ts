import { resetEmitter } from '@dao/data-in-memory/pubsub/emitter-instance.js'
import { PubSubDAO } from '@dao/data-in-memory/pubsub/index.js'

beforeEach(resetEmitter)

describe('PubSubDAO', () => {
  test('publish, subscribe', done => {
    const namespace = 'namespace'
    const logId = 'log-id'
    const payload = 'payload'

    PubSubDAO.publish(namespace, { id: logId, payload })
    PubSubDAO.subscribe(namespace, () => done.fail())
    setImmediate(done)
  })

  test('subscribe, publish', done => {
    const namespace = 'namespace'
    const logId = 'log-id'
    const payload = 'payload'

    PubSubDAO.subscribe(namespace, val => {
      expect(val).toStrictEqual({ id: logId, payload })
      done()
    })
    PubSubDAO.publish(namespace, { id: logId, payload })
  })

  test('subscribe, unsubscribe, publish', done => {
    const namespace = 'namespace'
    const logId = 'log-id'
    const payload = 'payload'

    const unsubscribe = PubSubDAO.subscribe(namespace, () => done.fail())
    unsubscribe()
    PubSubDAO.publish(namespace, { id: logId, payload })
    setImmediate(done)
  })
})
