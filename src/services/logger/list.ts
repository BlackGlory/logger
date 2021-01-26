import { FastifyPluginAsync } from 'fastify'
import { toArrayAsync } from 'iterable-operator'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/logger'
  , async (req, reply) => {
      const result = await toArrayAsync(Core.Logger.list())
      reply.send(result)
    }
  )
}
