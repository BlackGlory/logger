import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, logIdSchema } from '@src/schema.js'
import { IAPI, IHead, IRange, ISlice, ITail } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
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
        params: { namespace: namespaceSchema }
      , querystring: {
          from: logIdSchema
        , to: logIdSchema
        , head: { type: 'integer' }
        , tail: { type: 'integer' }
        }
      , response: {
          204: { type: 'null' }
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

      api.Logger.del(namespace, range)
      return reply
        .status(204)
        .send()
    }
  )
}
