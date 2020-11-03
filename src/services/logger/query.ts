import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema, logIdSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
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
  , async (req, reply) => {
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

      reply.raw.setHeader('Content-Type', 'application/json')
      const asyncIter = Core.Logger.query(id, range)[Symbol.asyncIterator]()
      const firstResult = await asyncIter.next()
      reply.raw.write('[')
      if (!firstResult.done) reply.raw.write(JSON.stringify(firstResult.value))
      while (true) {
        const result = await asyncIter.next()
        if (result.done) break
        reply.raw.write(', ' + JSON.stringify(result.value))
      }
      reply.raw.write(']')
      reply.raw.end()
    }
  )
}
