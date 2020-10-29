import * as DAO from '@dao/config/token-based-access-control'
import { prepareConfigDatabase } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/config/database')

describe('TBAC(token-based access control)', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', async () => {
      const db = await prepareConfigDatabase()
      const id1 = 'id-1'
      const token1 = 'token-1'
      const id2 = 'id-2'
      const token2 = 'token-2'
      const id3 = 'id-3'
      const token3 = 'token-3'
      insert(db, { token: token1, id: id1, follow: true })
      insert(db, { token: token2, id: id2, log: true })
      insert(db, { token: token3, id: id3, del: true })

      const result = DAO.getAllIdsWithTokens()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id1, id2, id3])
    })
  })

  describe('getAllTokens(id: string): Array<{ token: string; log: boolean; follow: boolean }>', () => {
    it('return Array<{ token: string; log: boolean; follow: boolean }>', async () => {
      const db = await prepareConfigDatabase()
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      const token3 = 'token-3'
      insert(db, { token: token1, id, follow: true })
      insert(db, { token: token2, id, log: true })
      insert(db, { token: token3, id, del: true })

      const result = DAO.getAllTokens(id)

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([
        { token: token1, follow: true, log: false, delete: false }
      , { token: token2, follow: false, log: true, delete: false }
      , { token: token3, follow: false, log: false, delete: true }
      ])
    })
  })

  describe('LogToken', () => {
    describe('hasLogTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: false, log: true })

          const result = DAO.hasLogTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: false })

          const result = DAO.hasLogTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchLogToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: false, log: true })

          const result = DAO.matchLogToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: false })

          const result = DAO.matchLogToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setLogToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: false })

          const result = DAO.setLogToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['log_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setLogToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['log_permission']).toBe(1)
        })
      })
    })

    describe('unsetLogToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: true })

          const result = DAO.unsetLogToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['log_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetLogToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('FollowToken', () => {
    describe('hasFollowTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: false })

          const result = DAO.hasFollowTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: false, log: true })

          const result = DAO.hasFollowTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchFollowToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: false })

          const result = DAO.matchFollowToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: false, log: true })

          const result = DAO.matchFollowToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setFollowToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: false, log: true })

          const result = DAO.setFollowToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['follow_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setFollowToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['follow_permission']).toBe(1)
        })
      })
    })

    describe('unsetFollowToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, follow: true, log: true })

          const result = DAO.unsetFollowToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['follow_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetFollowToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('DeleteToken', () => {
    describe('matchDeleteToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareConfigDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, del: true })

          const result = DAO.matchDeleteToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareConfigDatabase()
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
        it('update row', async () => {
          const db = await prepareConfigDatabase()
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
        it('insert row', async () => {
          const db = await prepareConfigDatabase()
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
        it('return undefined', async () => {
          const db = await prepareConfigDatabase()
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
        it('return undefined', async () => {
          const db = await prepareConfigDatabase()
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
      FROM logger_tbac
     WHERE token = $token AND logger_id = $id;
  `).get({ token, id })
}

function insert(
  db: Database
, { token, id, follow = false, log = false, del = false }: {
    token: string
    id: string
    follow?: boolean
    log?: boolean
    del?: boolean
  }
) {
  db.prepare(`
    INSERT INTO logger_tbac (token, logger_id, follow_permission, log_permission, delete_permission)
    VALUES ($token, $id, $follow, $log, $del);
  `).run({
    token
  , id
  , follow: follow ? 1 : 0
  , log: log ? 1 : 0
  , del: del ? 1 : 0
  })
}
