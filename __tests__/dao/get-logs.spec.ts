import { getLogs } from '@dao/get-logs.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog } from '@test/dao.js'
import { LoggerNotFound } from '@src/contract.js'
import { getError } from 'return-style'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getLogs', () => {
  test('logger does not exist', () => {
    const err = getError(() => getLogs('id', ['0-0']))

    expect(err).toBeInstanceOf(LoggerNotFound)
  })

  test('logger exists', () => {
    setRawLogger({
      id: 'id'
    , quantity_limit: null
    , time_to_live: null
    })
    const log = setRawLog({
      logger_id: 'id'
    , timestamp: 0
    , number: 0
    , payload: JSON.stringify('content')
    })

    const result = getLogs('id', ['0-0', '0-1'])

    expect(result).toStrictEqual([
      log.payload
    , null
    ])
  })
})
