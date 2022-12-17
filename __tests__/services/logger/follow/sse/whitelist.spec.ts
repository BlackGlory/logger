import { startService, stopService, getAddress } from '@test/utils'
import { AccessControlDAO } from '@dao'
import { EventSource } from 'extra-fetch'
import { waitForEventTarget } from '@blackglory/wait-for'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('200', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        await AccessControlDAO.addWhitelistItem(namespace)

        const es = new EventSource(`${getAddress()}/logger/${namespace}`)
        await waitForEventTarget(es as EventTarget, 'open')
        es.close()
      })
    })

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.LOGGER_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/logger/${namespace}`)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('200', async () => {
        const namespace = 'namespace'

        const es = new EventSource(`${getAddress()}/logger/${namespace}`)
        await waitForEventTarget(es as EventTarget, 'open')
        es.close()
      })
    })
  })
})
