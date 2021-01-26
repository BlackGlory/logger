import * as DAO from '@dao/config-in-sqlite3/purge-policy/purge-policy'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { getRawPurgePolicy, hasRawPurgePolicy, setRawPurgePolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('PurgePolicy', () => {
  describe('getAllIdsWithPurgePolicies(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setRawPurgePolicy({
        logger_id: id
      , time_to_live: 100
      , number_limit: 200
      })

      const result = DAO.getAllIdsWithPurgePolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getPurgePolicies(id: string): { timeToLive: number | null, numberLimit: number | null', () => {
    describe('policy exists', () => {
      it('return', () => {
        const id = 'id'
        const timeToLive = 100
        const numberLimit = 200
        setRawPurgePolicy({
          logger_id: id
        , time_to_live: timeToLive
        , number_limit: numberLimit
        })

        const result = DAO.getPurgePolicies(id)

        expect(result).toEqual({
          timeToLive
        , numberLimit
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', () => {
        const id = 'id'

        const result = DAO.getPurgePolicies(id)

        expect(result).toEqual({
          timeToLive: null
        , numberLimit: null
        })
      })
    })
  })

  describe('setTimeToLive(id: string, timeToLive: number): void', () => {
    it('return undefined', () => {
      const id = 'id'
      const timeToLive = 100

      const result = DAO.setTimeToLive(id, timeToLive)
      const row = getRawPurgePolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['time_to_live']).toBe(timeToLive)
    })
  })

  describe('unsetTimeToLive(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawPurgePolicy({
          logger_id: id
        , time_to_live: 100
        , number_limit: 100
        })

        const result = DAO.unsetTimeToLive(id)
        const row = getRawPurgePolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['time_to_live']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetTimeToLive(id)

        expect(result).toBeUndefined()
        expect(hasRawPurgePolicy(id)).toBeFalse()
      })
    })
  })

  describe('setNumberLimit(id: string, numberLimit: number): void', () => {
    it('return undefined', () => {
      const id = 'id'
      const numberLimit = 100

      const result = DAO.setNumberLimit(id, numberLimit)
      const row = getRawPurgePolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['number_limit']).toBe(numberLimit)
    })
  })

  describe('unsetNumberLimit(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawPurgePolicy({
          logger_id: id
        , time_to_live: 100
        , number_limit: 100
        })

        const result = DAO.unsetNumberLimit(id)
        const row = getRawPurgePolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['number_limit']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetNumberLimit(id)

        expect(result).toBeUndefined()
        expect(hasRawPurgePolicy(id)).toBeFalse()
      })
    })
  })
})
