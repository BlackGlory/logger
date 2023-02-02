import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, logIdSchema } from '@src/schema.js'
import { IAPI, IHead, IRange, ISlice, ITail } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.delete<{
    Params: { namespace: string }
    Querystring: {
      token?: string
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
          token: tokenSchema
        , from: logIdSchema
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
      const token = req.query.token
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

      try {
        api.Blacklist.check(namespace)
        api.Whitelist.check(namespace)
        api.TBAC.checkDeletePermission(namespace, token)
      } catch (e) {
        if (e instanceof api.Blacklist.Forbidden) return reply.status(403).send()
        if (e instanceof api.Whitelist.Forbidden) return reply.status(403).send()
        if (e instanceof api.TBAC.Unauthorized) return reply.status(401).send()
        throw e
      }

      api.Logger.del(namespace, range)
      return reply
        .status(204)
        .send()
    }
  )
}
