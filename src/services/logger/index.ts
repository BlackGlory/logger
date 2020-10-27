import { FastifyPluginAsync } from 'fastify'
import { routes as logRoutes } from './log'
import { routes as followRoutes } from './follow'
import { routes as queryRoutes } from './query'
import { routes as deleteRoutes } from './delete'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject, Logger: ILogger<string> }> = async function routes(server, { DAO, Logger }) {
  server.register(logRoutes, { Logger, DAO })
  server.register(followRoutes, { Logger, DAO })
  server.register(queryRoutes, { Logger, DAO })
  server.register(deleteRoutes, { Logger, DAO })
}
