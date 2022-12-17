import * as DAO from '@dao/data-in-sqlite3/logger/get-all-namespaces'
import { toArray } from 'iterable-operator'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { setRawLog } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('getAllNamespaces(): Iterable<string>', () => {
  describe('empty', () => {
    it('return Iterable<string>', () => {
      const iter = DAO.getAllNamespaces()
      const result = toArray(iter)

      expect(result).toStrictEqual([])
    })
  })

  describe('not empty', () => {
    it('return Iterable<string>', () => {
      const namespace = 'namespace'
      setRawLog({
        namespace
      , payload: 'payload'
      , timestamp: Date.now()
      , number: 0
      })

      const iter = DAO.getAllNamespaces()
      const result = toArray(iter)

      expect(result).toStrictEqual([namespace])
    })
  })
})
