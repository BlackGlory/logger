import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { clearLogs } from '@dao/clear-logs.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLogger, setRawLog, hasRawLog } from '@test/dao.js'
import { Order } from '@src/contract.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('clearLogs', () => {
  test('logger does not exist', () => {
    clearLogs('id', { order: Order.Asc })
  })

  describe('logger exists', () => {
    describe('order', () => {
      test('asc', () => {
        setRawLogger({
          id: 'id'
        , quantity_limit: null
        , time_to_live: null
        })
        setRawLog({
          logger_id: 'id'
        , value: JSON.stringify('content-1')
        , timestamp: 0
        , number: 0
        })
        setRawLog({
          logger_id: 'id'
        , value: JSON.stringify('content-2')
        , timestamp: 1
        , number: 0
        })

        clearLogs('id', {
          order: Order.Asc
        , limit: 1
        })

        expect(hasRawLog('id', 0, 0)).toBe(false)
        expect(hasRawLog('id', 1, 0)).toBe(true)
      })

      test('desc', () => {
        setRawLogger({
          id: 'id'
        , quantity_limit: null
        , time_to_live: null
        })
        setRawLog({
          logger_id: 'id'
        , value: JSON.stringify('content-1')
        , timestamp: 0
        , number: 0
        })
        setRawLog({
          logger_id: 'id'
        , value: JSON.stringify('content-2')
        , timestamp: 1
        , number: 0
        })

        clearLogs('id', {
          order: Order.Desc
        , limit: 1
        })

        expect(hasRawLog('id', 0, 0)).toBe(true)
        expect(hasRawLog('id', 1, 0)).toBe(false)
      })
    })

    test('from', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      clearLogs('id', {
        order: Order.Asc
      , from: '0-1'
      })

      expect(hasRawLog('id', 0, 0)).toBe(true)
      expect(hasRawLog('id', 1, 0)).toBe(false)
    })

    test('to', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      clearLogs('id', {
        order: Order.Asc
      , to: '0-1'
      })

      expect(hasRawLog('id', 0, 0)).toBe(false)
      expect(hasRawLog('id', 1, 0)).toBe(true)
    })

    test('skip', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      clearLogs('id', {
        order: Order.Asc
      , skip: 1
      })

      expect(hasRawLog('id', 0, 0)).toBe(true)
      expect(hasRawLog('id', 1, 0)).toBe(false)
    })

    test('limit', () => {
      setRawLogger({
        id: 'id'
      , quantity_limit: null
      , time_to_live: null
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-1')
      , timestamp: 0
      , number: 0
      })
      setRawLog({
        logger_id: 'id'
      , value: JSON.stringify('content-2')
      , timestamp: 1
      , number: 0
      })

      clearLogs('id', {
        order: Order.Asc
      , limit: 1
      })

      expect(hasRawLog('id', 0, 0)).toBe(false)
      expect(hasRawLog('id', 1, 0)).toBe(true)
    })
  })
})
