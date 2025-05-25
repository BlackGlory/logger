import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { setLoggerConfiguration } from '@dao/set-logger-configuration.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, getRawLogger } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('setLoggerConfiguration', () => {
  test('logger does not exist', () => {
    setLoggerConfiguration('id', {
      limit: 100
    , timeToLive: 200
    })

    expect(getRawLogger('id')).toStrictEqual({
      id: 'id'
    , quantity_limit: 100
    , time_to_live: 200
    })
  })

  test('logger exists', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: 50
    , time_to_live: 100
    })

    setLoggerConfiguration('id', {
      limit: 100
    , timeToLive: 200
    })

    expect(getRawLogger('id')).toStrictEqual({
      id: 'id'
    , quantity_limit: 100
    , time_to_live: 200
    })
  })
})
