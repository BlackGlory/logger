import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const db = getDatabase()
      const id = 'id'
      insert(db, id, { writeTokenRequired: 1, readTokenRequired: 1, deleteTokenRequired: 1 })

      const result = DAO.getAllIdsWithTokenPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getTokenPolicies(id: string): { writeTokenRequired: boolean | null, readTokenRequired: boolean | null', () => {
    describe('policy exists', () => {
      it('return', () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { writeTokenRequired: 1, readTokenRequired: 1, deleteTokenRequired: 1 })

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          writeTokenRequired: true
        , readTokenRequired: true
        , deleteTokenRequired: true
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', () => {
        const id = 'id'

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          writeTokenRequired: null
        , readTokenRequired: null
        , deleteTokenRequired: null
        })
      })
    })
  })

  describe('setWriteTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setWriteTokenRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['write_token_required']).toBe(1)
    })
  })

  describe('unsetWriteTokenRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { readTokenRequired: 1, writeTokenRequired: 1, deleteTokenRequired: 1 })

        const result = DAO.unsetWriteTokenRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['write_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetWriteTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setReadTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setReadTokenRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['read_token_required']).toBe(1)
    })
  })

  describe('unsetReadTokenRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { readTokenRequired: 1, writeTokenRequired: 1, deleteTokenRequired: 1 })

        const result = DAO.unsetReadTokenRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['read_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetReadTokenRequired(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })

  describe('setDeleteTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const db = getDatabase()
      const id = 'id'

      const result = DAO.setDeleteTokenRequired(id, true)
      const row = select(db, id)

      expect(result).toBeUndefined()
      expect(row['delete_token_required']).toBe(1)
    })
  })

  describe('unsetDeleteTokenRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id'
        insert(db, id, { readTokenRequired: 1, writeTokenRequired: 1, deleteTokenRequired: 1 })

        const result = DAO.unsetDeleteTokenRequired(id)
        const row = select(db, id)

        expect(result).toBeUndefined()
        expect(row['delete_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id'

        const result = DAO.unsetDeleteTokenRequired(id)

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
      FROM logger_token_policy
     WHERE logger_id = $id;
  `).get({ id })
}

function insert(
  db: Database
, id: string
, { writeTokenRequired, readTokenRequired, deleteTokenRequired }: {
    writeTokenRequired: number | null
    readTokenRequired: number | null
    deleteTokenRequired: number | null
  }
) {
  db.prepare(`
    INSERT INTO logger_token_policy (logger_id, write_token_required, read_token_required, delete_token_required)
    VALUES ($id, $writeTokenRequired, $readTokenRequired, $deleteTokenRequired);
  `).run({
    id
  , writeTokenRequired
  , readTokenRequired
  , deleteTokenRequired
  })
}
