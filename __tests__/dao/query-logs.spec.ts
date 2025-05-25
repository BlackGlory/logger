import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { queryLogs } from '@dao/query-logs.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog } from '@test/dao.js'
import { LoggerNotFound, Order } from '@src/contract.js'
import { getError } from 'return-style'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('queryLogs', () => {
  test('logger does not exist', () => {
    const err = getError(() => queryLogs('id', {
      order: Order.Asc
    }))

    expect(err).toBeInstanceOf(LoggerNotFound)
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
        , value: JSON.stringify('content-1')
        , timestamp: 0
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: 'id'
        , value: JSON.stringify('content-2')
        , timestamp: 0
        , number: 1
        })

        const result = queryLogs('id', {
          order: Order.Asc
        })

        expect(result).toEqual([
          { id: `${log1.timestamp}-${log1.number}`, value: log1.value }
        , { id: `${log2.timestamp}-${log2.number}`, value: log2.value }
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
        , value: JSON.stringify('content-1')
        , timestamp: 0
        , number: 0
        })
        const log2 = setRawLog({
          logger_id: 'id'
        , value: JSON.stringify('content-2')
        , timestamp: 0
        , number: 1
        })

        const result = queryLogs('id', {
          order: Order.Desc
        })

        expect(result).toEqual([
          { id: `${log2.timestamp}-${log2.number}`, value: log2.value }
        , { id: `${log1.timestamp}-${log1.number}`, value: log1.value }
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
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , from: '0-1'
      })

      expect(result).toEqual([
        { id: `${log2.timestamp}-${log2.number}`, value: log2.value }
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
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , to: '0-1'
      })

      expect(result).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, value: log1.value }
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
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , skip: 1
      })

      expect(result).toEqual([
        { id: `${log2.timestamp}-${log2.number}`, value: log2.value }
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
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      const log2 = setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      const result = queryLogs('id', {
        order: Order.Asc
      , limit: 1
      })

      expect(result).toEqual([
        { id: `${log1.timestamp}-${log1.number}`, value: log1.value }
      ])
    })
  })
})
