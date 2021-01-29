import { FastifyPluginAsync } from 'fastify'
import { routes as writeRoutes } from './write'
import { routes as followRoutes } from './follow'
import { routes as queryRoutes } from './query'
import { routes as deleteRoutes } from './delete'
import { routes as getAllLoggerIdsRoutes } from './get-all-logger-ids'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(writeRoutes, { Core })
  server.register(followRoutes, { Core })
  server.register(queryRoutes, { Core })
  server.register(deleteRoutes, { Core })
  server.register(getAllLoggerIdsRoutes, { Core })
}
