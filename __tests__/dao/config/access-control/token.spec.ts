import * as DAO from '@dao/config/access-control/token.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawToken, hasRawToken, setRawToken } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllNamespacesWithTokens(): string[]', () => {
    it('return string[]', () => {
      const namespace1 = 'namespace-1'
      const token1 = 'token-1'
      const namespace2 = 'namespace-2'
      const token2 = 'token-2'
      const namespace3 = 'namespace-3'
      const token3 = 'token-3'
      setRawToken({
        token: token1
      , namespace: namespace1
      , read_permission: 1
      , write_permission: 0
      , delete_permission: 0
      })
      setRawToken({
        token: token2
      , namespace: namespace2
      , read_permission: 0
      , write_permission: 1
      , delete_permission: 0
      })
      setRawToken({
        token: token3
      , namespace: namespace3
      , read_permission: 0
      , write_permission: 0
      , delete_permission: 1
      })

      const result = DAO.getAllNamespacesWithTokens()

      expect(result).toEqual([namespace1, namespace2, namespace3])
    })
  })

  describe('getAllTokens(namespace: string): TokenInfo[]', () => {
    it('return TokenInfo[]', () => {
      const namespace = 'namespace'
      const token1 = 'token-1'
      const token2 = 'token-2'
      const token3 = 'token-3'
      setRawToken({
        token: token1
      , namespace
      , read_permission: 1
      , write_permission: 0
      , delete_permission: 0
      })
      setRawToken({
        token: token2
      , namespace
      , read_permission: 0
      , write_permission: 1
      , delete_permission: 0
      })
      setRawToken({
        token: token3
      , namespace
      , read_permission: 0
      , write_permission: 0
      , delete_permission: 1
      })

      const result = DAO.getAllTokens(namespace)

      expect(result).toEqual([
        { token: token1, read: true, write: false, delete: false }
      , { token: token2, read: false, write: true, delete: false }
      , { token: token3, read: false, write: false, delete: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.hasWriteTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.hasWriteTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchWriteToken({ token: string; namespace: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.matchWriteToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.matchWriteToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.unsetWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetWriteToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('hasReadTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.hasReadTokens(namespace)

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.hasReadTokens(namespace)

          expect(result).toBe(false)
        })
      })
    })

    describe('matchReadToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.matchReadToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.matchReadToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setReadToken(token: string, namespace: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.setReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })
    })

    describe('unsetReadToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 1
          , delete_permission: 0
          })

          const result = DAO.unsetReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetReadToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })

  describe('DeleteToken', () => {
    describe('matchDeleteToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 0
          , delete_permission: 1
          })

          const result = DAO.matchDeleteToken({ token, namespace })

          expect(result).toBe(true)
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.matchDeleteToken({ token, namespace })

          expect(result).toBe(false)
        })
      })
    })

    describe('setDeleteToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 0
          , delete_permission: 0
          })

          const result = DAO.setDeleteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['delete_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setDeleteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['delete_permission']).toBe(1)
        })
      })
    })

    describe('unsetDeleteToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 0
          , delete_permission: 1
          })

          const result = DAO.unsetDeleteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).toBeUndefined()
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetDeleteToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBe(false)
        })
      })
    })
  })
})
