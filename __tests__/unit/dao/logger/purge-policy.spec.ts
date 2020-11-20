import * as DAO from '@dao/logger/purge-policy'
import { getDatabase } from '@dao/logger/database'
import { resetLoggerDatabase, resetDatabases, resetEnvironment } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/logger/database')
jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('PurgePolicy', () => {
  describe('getAllIdsWithPurgePolicies(): string[]', () => {
    it('return string[]', async () => {
      const db = await getDatabase()
      const id = 'id'
      const timeToLive = 100
      const numberLimit = 200
      insert(db, id, { timeToLive, numberLimit })

      const result = DAO.getAllIdsWithPurgePolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getPurgePolicies(id: string): { timeToLive: number | null, numberLimit: number | null', () => {
    describe('policy exists', () => {
      it('return', async () => {
        const db = await getDatabase()
        const id = 'id'
        const timeToLive = 100
        const numberLimit = 200
        insert(db, id, { timeToLive, numberLimit })

        const result = DAO.getPurgePolicies(id)

        expect(result).toEqual({
          timeToLive
        , numberLimit
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', async () => {
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
    it('return undefined', async () => {
      const db = await getDatabase()
      const id = 'id'
      const timeToLive = 100

      const result = DAO.setTimeToLive(id, timeToLive)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['time_to_live']).toBe(timeToLive)
    })
  })

  describe('unsetTimeToLive(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const db = await getDatabase()
        const id = 'id'
        insert(db, id, { timeToLive: 100, numberLimit: 100 })

        const result = DAO.unsetTimeToLive(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['time_to_live']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const db = await getDatabase()
        const id = 'id'

        const result = DAO.unsetTimeToLive(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setNumberLimit(id: string, numberLimit: number): void', () => {
    it('return undefined', async () => {
      const db = await getDatabase()
      const id = 'id'
      const numberLimit = 100

      const result = DAO.setNumberLimit(id, numberLimit)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['number_limit']).toBe(numberLimit)
    })
  })

  describe('unsetNumberLimit(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', async () => {
        const db = await getDatabase()
        const id = 'id'
        insert(db, id, { timeToLive: 100, numberLimit: 100 })

        const result = DAO.unsetNumberLimit(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['number_limit']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', async () => {
        const db = await getDatabase()
        const id = 'id'

        const result = DAO.unsetNumberLimit(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function exist(db: Database, id: string) {
  return !!select(db, id)
}

function select(db: Database, id: string) {
  return db.prepare(`
    SELECT *
      FROM logger_purge_policy
     WHERE logger_id = $id;
  `).get({ id })
}

function insert(db: Database, id: string, { timeToLive, numberLimit }: { timeToLive?: number,  numberLimit?: number }) {
  db.prepare(`
    INSERT INTO logger_purge_policy (logger_id, time_to_live, number_limit)
    VALUES ($id, $timeToLive, $numberLimit);
  `).run({
    id
  , timeToLive
  , numberLimit
  })
}
