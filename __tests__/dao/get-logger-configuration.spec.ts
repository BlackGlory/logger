import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { getLoggerConfiguration } from '@dao/get-logger-configuration.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getLoggerConfiguration', () => {
  test('logger does not exist', () => {
    const id = 'id'

    const result = getLoggerConfiguration(id)

    expect(result).toBe(null)
  })

  test('logger exists', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: 100
    , time_to_live: 200
    })

    const result = getLoggerConfiguration('id')

    expect(result).toStrictEqual({
      limit: 100
    , timeToLive: 200
    })
  })
})
