import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { removeLoggerConfiguration } from '@dao/remove-logger-configuration.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, hasRawLogger } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('removeLoggerConfiguration', () => {
  test('logger does not exist', () => {
    removeLoggerConfiguration('id')

    expect(hasRawLogger('id')).toBe(false)
  })

  test('logger exists', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: 100
    , time_to_live: 200
    })

    removeLoggerConfiguration('id')

    expect(hasRawLogger('id')).toBe(false)
  })
})
