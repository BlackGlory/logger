import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { hasLogger } from '@dao/has-logger.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('hasLogger', () => {
  test('logger does not exist', () => {
    const id = 'id'

    const result = hasLogger(id)

    expect(result).toBe(false)
  })

  test('logger exists', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: null
    , time_to_live: null
    })

    const result = hasLogger('id')

    expect(result).toBe(true)
  })
})
