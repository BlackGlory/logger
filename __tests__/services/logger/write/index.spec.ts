import { startService, stopService, getAddress } from '@test/utils.js'
import { fetch } from 'extra-fetch'
import { post } from 'extra-request'
import { url, pathname, json, text, header } from 'extra-request/transformers'

// 由于服务启动时会读取环境变量 LOGGER_JSON_PAYLOAD_ONLY
// 因此环境变量必须在服务启动前设置, 这迫使测试用例手动启动服务
afterEach(stopService)

describe('no access control', () => {
  describe('LOGGER_JSON_PAYLOAD_ONLY', () => {
    describe('Content-Type: application/json', () => {
      it('accpet any plaintext, return 204', async () => {
        process.env.LOGGER_JSON_PAYLOAD_ONLY = 'true'
        await startService()
        const namespace = 'namespace'
        const message = JSON.stringify('message')

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/logger/${namespace}`)
        , json(message)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('other Content-Type', () => {
      it('400', async () => {
        process.env.LOGGER_JSON_PAYLOAD_ONLY = 'true'
        await startService()
        const namespace = 'namespace'
        const message = 'message'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/logger/${namespace}`)
        , text(message)
        ))

        expect(res.status).toBe(400)
      })
    })
  })

  describe('Content-Type', () => {
    it('accpet any content-type', async () => {
      await startService()
      const namespace = 'namespace'
      const message = 'message'

      const res = await fetch(post(
        url(getAddress())
      , pathname(`/logger/${namespace}`)
      , text(message)
      , header('Content-Type', 'apple/banana')
      ))

      expect(res.status).toBe(204)
    })
  })
})
