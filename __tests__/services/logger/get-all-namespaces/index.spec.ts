import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { prepareLoggers } from './utils'
import { fetch } from 'extra-fetch'
import { get } from 'extra-request'
import { url, pathname } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
jest.mock('@dao/data-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const namespaces = ['namespace']
    prepareLoggers(namespaces)

    const res = await fetch(get(
      url(getAddress())
    , pathname('/logger')
    ))

    expect(res.status).toBe(200)
    expect(await toJSON(res)).toStrictEqual(namespaces)
  })
})
