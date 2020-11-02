import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema, logIdSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.delete<{
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
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.query.token

      try {
        await Core.Blacklist.check(id)
        await Core.Whitelist.check(id)
        await Core.TBAC.checkDeletePermission(id, token)
      } catch (e) {
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        if (e instanceof Error) return reply.status(400).send(e.message)
        throw e
      }

      const range: IRange = { from: req.query.from, to: req.query.to }
      if ('head' in req.query) (range as ISlice & IHead).head = req.query.head
      if ('tail' in req.query) (range as ISlice & ITail).tail = req.query.tail

      await Core.Logger.remove(id, range)
      reply.status(204).send()
    }
  )
  return undefined
}
