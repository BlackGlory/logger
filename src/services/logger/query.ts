import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema, logIdSchema } from '@src/schema'
import accepts from 'fastify-accepts'
import { Readable } from 'stream'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(accepts)

  server.get<{
    Params: { id: string }
    Querystring: { token?: string } & IRange
  }>(
    '/logger/:id/logs'
  , {
      schema: {
        params: {
          id: idSchema
        }
      , querystring: {
          token: tokenSchema
        , from: logIdSchema
        , to: logIdSchema
        , head: { type: 'number' }
        , tail: { type: 'number' }
        }
      }
    }
  , (req, reply) => {
      ;(async () => {
        const id = req.params.id
        const token = req.query.token

        try {
          await Core.Blacklist.check(id)
          await Core.Whitelist.check(id)
          await Core.TBAC.checkReadPermission(id, token)
        } catch (e) {
          if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
          if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
          if (e instanceof Error) return reply.status(400).send(e.message)
          throw e
        }

        const range: IRange = { from: req.query.from, to: req.query.to }
        if ('head' in req.query) (range as ISlice & IHead).head = req.query.head
        if ('tail' in req.query) (range as ISlice & ITail).tail = req.query.tail

        const accept = req.accepts().type(['application/json', 'application/x-ndjson'])
        if (accept === 'application/x-ndjson') {
          reply.raw.setHeader('Content-Type', 'application/x-ndjson')
          Readable.from(generateNDJson(id, range)).pipe(reply.raw)
        } else {
          reply.raw.setHeader('Content-Type', 'application/json')
          Readable.from(generateJSON(id, range)).pipe(reply.raw)
        }
      })()

    }
  )

  async function* generateNDJson(id: string, range: ISlice): AsyncIterable<string> {
    const asyncIter = Core.Logger.query(id, range)[Symbol.asyncIterator]()
    const firstResult = await asyncIter.next()
    if (!firstResult.done) yield JSON.stringify(firstResult.value)
    while (true) {
      const result = await asyncIter.next()
      if (result.done) break
      yield '\n' + JSON.stringify(result.value)
    }
  }

  async function* generateJSON(id: string, range: ISlice): AsyncIterable<string> {
    const asyncIter = Core.Logger.query(id, range)[Symbol.asyncIterator]()
    const firstResult = await asyncIter.next()
    yield '['
    if (!firstResult.done) yield JSON.stringify(firstResult.value)
    while (true) {
      const result = await asyncIter.next()
      if (result.done) break
      yield ',' + JSON.stringify(result.value)
    }
    yield ']'
  }
}
