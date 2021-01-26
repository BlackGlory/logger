import * as DAO from '@dao/data-in-sqlite3/logger/list-all-logger-ids'
import { toArray } from 'iterable-operator'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { setRawLog } from './utils'
import '@blackglory/jest-matchers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('listAllLoggerIds(): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const iter = DAO.listAllLoggerIds()
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const id = 'id'
      setRawLog({
        logger_id: id
      , payload: 'payload'
      , timestamp: Date.now()
      , number: 0
      })

      const iter = DAO.listAllLoggerIds()
      const result = toArray(iter)

      expect(iter).toBeIterable()
      expect(result).toStrictEqual([id])
    })
  })
})
