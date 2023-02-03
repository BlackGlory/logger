import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { JSON_PAYLOAD_ONLY, WRITE_PAYLOAD_LIMIT } from '@env/index.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  // overwrite application/json parser
  server.addContentTypeParser(
    'application/json'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.addContentTypeParser(
    '*'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body)
  )

  server.post<{
    Params: { namespace: string }
    Body: string
  }>(
    '/logger/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , headers: {
          'content-type':
            JSON_PAYLOAD_ONLY()
            ? { type: 'string', pattern: '^application/json' }
            : { type: 'string' }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: WRITE_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const payload = req.body

      api.Logger.write(namespace, payload)
      return reply
        .status(204)
        .send()
    }
  )
}
