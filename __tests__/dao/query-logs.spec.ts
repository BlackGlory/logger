import { queryLogs } from '@dao/query-logs.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog } from '@test/dao.js'
import { Order } from '@src/contract.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('queryLogs', () => {
  test('logger does not exist', () => {
    const result = queryLogs('id', {
      order: Order.Asc
    })

    expect(result).toBe(null)
  })

  describe('logger exists', () => {
    describe('order', () => {
      test('asc', () => {
        setRawLogger({
          id: 'id'
        , quantity_limit: null
        , time_to_live: null
        })
        const log1 = setRawLog({
          logger_id: 'id'
        , payload: JSON.stringify('content-1')
        , timestamp: 0
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: 'id'
        , payload: JSON.stringify('content-2')
        , timestamp: 0
        , number: 1
        })

        const result = queryLogs('id', {
          order: Order.Asc
        })

        expect(result).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        , { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        ])
      })

      test('desc', () => {
        setRawLogger({
          id: 'id'
        , quantity_limit: null
        , time_to_live: null
        })
        const log1 = setRawLog({
          logger_id: 'id'
        , payload: JSON.stringify('content-1')
        , timestamp: 0
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: 'id'
        , payload: JSON.stringify('content-2')
        , timestamp: 0
        , number: 1
        })

        const result = queryLogs('id', {
          order: Order.Desc
        })

        expect(result).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
        , { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
        ])
      })
    })

    test('from', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      const log1 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , from: '0-1'
      })

      expect(result).toEqual([
        { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
      ])
    })

    test('to', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      const log1 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , to: '0-1'
      })

      expect(result).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
      ])
    })

    test('skip', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      const log1 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , skip: 1
      })

      expect(result).toEqual([
        { id: `${log2.timestamp}-${log2.number}`, payload: log2.payload }
      ])
    })

    test('limit', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      const log1 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , payload: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , limit: 1
      })

      expect(result).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, payload: log1.payload }
      ])
    })
  })
})
