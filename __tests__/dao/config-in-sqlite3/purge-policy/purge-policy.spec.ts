import * as DAO from '@dao/config-in-sqlite3/purge-policy/purge-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawPurgePolicy, hasRawPurgePolicy, setRawPurgePolicy } from './utils'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('PurgePolicy', () => {
  describe('getAllNamespacesWithPurgePolicies(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawPurgePolicy({
        namespace
      , time_to_live: 100
      , number_limit: 200
      })

      const result = DAO.getAllNamespacesWithPurgePolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe('getPurgePolicies(namespace: string): { timeToLive: number | null, numberLimit: number | null', () => {
    describe('policy exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        const rawPurgePolicy = setRawPurgePolicy({
          namespace
        , time_to_live: 100
        , number_limit: 200
        })

        const result = DAO.getPurgePolicies(namespace)

        expect(result).toEqual({
          timeToLive: rawPurgePolicy.time_to_live
        , numberLimit: rawPurgePolicy.number_limit
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = DAO.getPurgePolicies(namespace)

        expect(result).toEqual({
          timeToLive: null
        , numberLimit: null
        })
      })
    })
  })

  describe('setTimeToLive(namespace: string, timeToLive: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'
      const timeToLive = 100

      const result = DAO.setTimeToLive(namespace, timeToLive)
      const row = getRawPurgePolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['time_to_live']).toBe(timeToLive)
    })
  })

  describe('unsetTimeToLive(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawPurgePolicy({
          namespace
        , time_to_live: 100
        , number_limit: 100
        })

        const result = DAO.unsetTimeToLive(namespace)
        const row = getRawPurgePolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['time_to_live']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetTimeToLive(namespace)

        expect(result).toBeUndefined()
        expect(hasRawPurgePolicy(namespace)).toBe(false)
      })
    })
  })

  describe('setNumberLimit(namespace: string, numberLimit: number): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'
      const numberLimit = 100

      const result = DAO.setNumberLimit(namespace, numberLimit)
      const row = getRawPurgePolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['number_limit']).toBe(numberLimit)
    })
  })

  describe('unsetNumberLimit(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawPurgePolicy({
          namespace
        , time_to_live: 100
        , number_limit: 100
        })

        const result = DAO.unsetNumberLimit(namespace)
        const row = getRawPurgePolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['number_limit']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetNumberLimit(namespace)

        expect(result).toBeUndefined()
        expect(hasRawPurgePolicy(namespace)).toBe(false)
      })
    })
  })
})
