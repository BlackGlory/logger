import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { url, header, pathname } from 'extra-request/transformers'
import { get } from 'extra-request'
import { readJSONFile } from 'extra-filesystem'
import { getAppRoot } from '@utils/get-app-root.js'
import path from 'path'

beforeEach(startService)
afterEach(stopService)

describe('global', () => {
  test('response with cache-control', async () => {
    const res = await fetch(get(
      url(getAddress())
    ))

    expect(res.headers.get('cache-control')).toBe('private, no-cache')
  })

  describe('request with accept-version', () => {
    test('accept-version match', async () => {
      const pkg = await readJSONFile<{ version: string }>(
        path.join(getAppRoot(), 'package.json')
      )
      const res = await fetch(get(
        url(getAddress())
      , pathname('/health') // https://github.com/fastify/fastify/issues/3625
      , header('Accept-Version', pkg.version)
      ))

      expect(res.status).toBe(200)
    })

    test('accept-version not match', async () => {
      const res = await fetch(get(
        url(getAddress())
      , pathname('/health') // https://github.com/fastify/fastify/issues/3625
      , header('Accept-Version', '0.0.0')
      ))

      expect(res.status).toBe(400)
    })
  })
})
