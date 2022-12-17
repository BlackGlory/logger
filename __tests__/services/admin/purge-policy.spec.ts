import { expectMatchSchema, startService, stopService, getAddress } from '@test/utils'
import { fetch } from 'extra-fetch'
import { get, put, del, post } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('PurgePolicy', () => {
  describe('GET /admin/logger-with-purge-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/logger-with-purge-policies')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              timeToLive: {
                oneOf: [
                  { type: 'number' }
                , { type: 'null' }
                ]
              }
            , limit: {
                oneOf: [
                  { type: 'number' }
                , { type: 'null' }
                ]
              }
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/logger-with-purge-policies')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/logger-with-purge-policies')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/logger/:namespace/purge-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expectMatchSchema(await toJSON(res), {
          type: 'object'
        , properties: {
            timeToLive: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , limit: {
              oneOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies`)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/logger/:namespace/purge-policies/time-to-live', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 1

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = 1

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 1

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/logger/:namespace/purge-policies/limit', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 1

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'
        const val = 1

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'
        const val = 1

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/logger/:namespace/purge-policies/time-to-live', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/time-to-live`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/logger/:namespace/purge-policies/limit', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies/limit`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('POST /admin/logger/:namespace/purge-policies', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const namespace = 'namespace'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.LOGGER_ADMIN_PASSWORD = 'password'
        const namespace = 'namespace'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/admin/logger/${namespace}/purge-policies`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.LOGGER_ADMIN_PASSWORD }`
  }
}
