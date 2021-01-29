import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/logger'
  , async (req, reply) => {
      const result = Core.Logger.getAllLoggerIds()
      reply.send(result)
    }
  )
}
