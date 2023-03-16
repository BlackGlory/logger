import { getAllLoggerIds } from '@dao/get-all-logger-ids.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger } from '@test/dao.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllLoggerIds', () => {
  test('empty', () => {
    const result = getAllLoggerIds()

    expect(result).toStrictEqual([])
  })

  test('not empty', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: null
    , time_to_live: null
    })

    const result = getAllLoggerIds()

    expect(result).toStrictEqual(['id'])
  })
})
