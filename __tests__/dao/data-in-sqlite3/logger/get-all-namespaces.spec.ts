import * as DAO from '@dao/data-in-sqlite3/logger/get-all-namespaces.js'
import { toArray } from 'iterable-operator'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { setRawLog } from './utils.js'

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
