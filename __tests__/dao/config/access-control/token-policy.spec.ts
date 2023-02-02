import * as DAO from '@dao/config/access-control/token-policy.js'
import { initializeDatabases, clearDatabases } from '@test/utils.js'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils.js'

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllNamespacesWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawTokenPolicy({
        namespace
      , write_token_required: 1
      , read_token_required: 1
      , delete_token_required: 1
      })

      const result = DAO.getAllNamespacesWithTokenPolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe('getTokenPolicies(namespace: string): TokenPolicy', () => {
    describe('exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , write_token_required: 1
        , read_token_required: 1
        , delete_token_required: 1
        })

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          writeTokenRequired: true
        , readTokenRequired: true
        , deleteTokenRequired: true
        })
      })
    })

    describe('does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          writeTokenRequired: null
        , readTokenRequired: null
        , deleteTokenRequired: null
        })
      })
    })
  })

  describe('setWriteTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setWriteTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['write_token_required']).toBe(1)
    })
  })

  describe('unsetWriteTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        , delete_token_required: 1
        })

        const result = DAO.unsetWriteTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['write_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetWriteTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBe(false)
      })
    })
  })

  describe('setReadTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setReadTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['read_token_required']).toBe(1)
    })
  })

  describe('unsetReadTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        , delete_token_required: 1
        })

        const result = DAO.unsetReadTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['read_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetReadTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBe(false)
      })
    })
  })

  describe('setDeleteTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setDeleteTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['delete_token_required']).toBe(1)
    })
  })

  describe('unsetDeleteTokenRequired(namespace: string): void', () => {
    describe('exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        , delete_token_required: 1
        })

        const result = DAO.unsetDeleteTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['delete_token_required']).toBeNull()
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetDeleteTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBe(false)
      })
    })
  })
})
