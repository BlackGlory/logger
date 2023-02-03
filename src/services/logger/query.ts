import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, logIdSchema } from '@src/schema.js'
import { Readable } from 'stream'
import { stringifyJSONStream, stringifyNDJSONStream } from 'extra-generator'
import accepts from '@fastify/accepts'
import { IAPI, IHead, IRange, ISlice, ITail } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  await server.register(accepts)

  server.get<{
    Params: { namespace: string }
    Querystring: {
      from?: string
      to?: string
      tail?: number
      head?: number
    }
  }>(
    '/logger/:namespace/logs'
  , {
      schema: {
        params: {
          namespace: namespaceSchema
        }
      , querystring: {
          from: logIdSchema
        , to: logIdSchema
        , head: { type: 'integer' }
        , tail: { type: 'integer' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const range: IRange = {
        from: req.query.from
      , to: req.query.to
      }
      if (req.query.head) {
        (range as ISlice & IHead).head = req.query.head
      }
      if (req.query.tail) {
        (range as ISlice & ITail).tail = req.query.tail
      }

      const logs = api.Logger.query(namespace, range)
      const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
      if (accept === 'application/x-ndjson') {
        return reply
          .status(200)
          .header('Content-Type', 'application/x-ndjson')
          .send(Readable.from(stringifyNDJSONStream(logs)))
      } else {
        return reply
          .status(200)
          .header('Content-Type', 'application/json')
          .send(Readable.from(stringifyJSONStream(logs)))
      }
    }
  )
}
