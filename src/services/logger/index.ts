import { FastifyPluginAsync } from 'fastify'
import { routes as writeRoutes } from './write.js'
import { routes as followRoutes } from './follow.js'
import { routes as queryRoutes } from './query.js'
import { routes as deleteRoutes } from './delete.js'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(writeRoutes, { Core })
  server.register(followRoutes, { Core })
  server.register(queryRoutes, { Core })
  server.register(deleteRoutes, { Core })
  server.register(getAllNamespacesRoutes, { Core })
}
