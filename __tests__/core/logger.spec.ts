import { createLogger } from '@core'

describe('Logger', () => {
  test('log,  follow', async done => {
    const logger = await createLogger()
    const key = 'key'
    const value = 'value'

    logger.log(key, value)
    logger.follow(key, () => done.fail())
    setImmediate(done)
  })

  test('follow, log', async done => {
    const logger = await createLogger()
    const key = 'key'
    const value = 'value'

    logger.follow(key, v => {
      expect(v).toBe(value)
      done()
    })
    logger.log(key, value)
  })

  test('follow, unfollow, log', async done => {
    const logger = await createLogger()
    const key = 'key'
    const value = 'value'

    const unfollow = logger.follow(key, () => done.fail())
    unfollow()
    logger.log(key, value)
    setImmediate(done)
  })
})
