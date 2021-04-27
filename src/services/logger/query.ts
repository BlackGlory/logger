import { go } from '@blackglory/go'
import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema, logIdSchema } from '@src/schema'
import { Readable } from 'stream'
import { stringifyJSONStreamAsync, stringifyNDJSONStreamAsync } from 'extra-generator'
import accepts from 'fastify-accepts'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(accepts)

  server.get<{
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
        params: {
          namespace: namespaceSchema
        }
      , querystring: {
          token: tokenSchema
        , from: logIdSchema
        , to: logIdSchema
        , head: { type: 'integer' }
        , tail: { type: 'integer' }
        }
      }
    }
  , (req, reply) => {
      go(async () => {
        const namespace = req.params.namespace
        const token = req.query.token
        const range: IRange = {
          from: req.query.from
        , to: req.query.to
        }
        if (req.query.head) (range as ISlice & IHead).head = req.query.head
        if (req.query.tail) (range as ISlice & ITail).tail = req.query.tail

        try {
          await Core.Blacklist.check(namespace)
          await Core.Whitelist.check(namespace)
          await Core.TBAC.checkReadPermission(namespace, token)
        } catch (e) {
          if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
          throw e
        }

        const logs = Core.Logger.query(namespace, range)
        const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
        if (accept === 'application/x-ndjson') {
          reply
            .status(200)
            .header('Content-Type', 'application/x-ndjson')
            .send(Readable.from(stringifyNDJSONStreamAsync(logs)))
        } else {
          reply
            .status(200)
            .header('Content-Type', 'application/json')
            .send(Readable.from(stringifyJSONStreamAsync(logs)))
        }
      })
    }
  )
}
