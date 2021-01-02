import * as DAO from '@dao/config-in-sqlite3/access-control/token'
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

describe('token-based access control', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', () => {
      const db = getDatabase()
      const id1 = 'id-1'
      const token1 = 'token-1'
      const id2 = 'id-2'
      const token2 = 'token-2'
      const id3 = 'id-3'
      const token3 = 'token-3'
      insert(db, { token: token1, id: id1, read: true })
      insert(db, { token: token2, id: id2, write: true })
      insert(db, { token: token3, id: id3, del: true })

      const result = DAO.getAllIdsWithTokens()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id1, id2, id3])
    })
  })

  describe('getAllTokens(id: string): Array<{ token: string; write: boolean; read: boolean; delete: boolean }>', () => {
    it('return Array<{ token: string; write: boolean; read: boolean; delete: boolean }>', () => {
      const db = getDatabase()
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      const token3 = 'token-3'
      insert(db, { token: token1, id, read: true })
      insert(db, { token: token2, id, write: true })
      insert(db, { token: token3, id, del: true })

      const result = DAO.getAllTokens(id)

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([
        { token: token1, read: true, write: false, delete: false }
      , { token: token2, read: false, write: true, delete: false }
      , { token: token3, read: false, write: false, delete: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.hasWriteTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.hasWriteTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchWriteToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.matchWriteToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.matchWriteToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setWriteToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.setWriteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setWriteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: true })

          const result = DAO.unsetWriteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetWriteToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('hasReadTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.hasReadTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.hasReadTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchReadToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.matchReadToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.matchReadToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setReadToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.setReadToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setReadToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(1)
        })
      })
    })

    describe('unsetReadToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: true })

          const result = DAO.unsetReadToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetReadToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('DeleteToken', () => {
    describe('matchDeleteToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, del: true })

          const result = DAO.matchDeleteToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, del: false })

          const result = DAO.matchDeleteToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setDeleteToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, del: false })

          const result = DAO.setDeleteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['delete_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setDeleteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['delete_permission']).toBe(1)
        })
      })
    })

    describe('unsetDeleteToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, del: true })

          const result = DAO.unsetDeleteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row).toBeUndefined()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const db = getDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetDeleteToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })
})

function exist(db: Database, { token, id }: { token: string; id: string }) {
  return !!select(db, { token, id })
}

function select(db: Database, { token, id }: { token: string; id: string }) {
  return db.prepare(`
    SELECT *
      FROM logger_token
     WHERE token = $token AND logger_id = $id;
  `).get({ token, id })
}

function insert(
  db: Database
, { token, id, read = false, write = false, del = false }: {
    token: string
    id: string
    read?: boolean
    write?: boolean
    del?: boolean
  }
) {
  db.prepare(`
    INSERT INTO logger_token (token, logger_id, write_permission, read_permission, delete_permission)
    VALUES ($token, $id, $write, $read, $del);
  `).run({
    token
  , id
  , write: write ? 1 : 0
  , read: read ? 1 : 0
  , del: del ? 1 : 0
  })
}
