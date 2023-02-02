import { FastifyPluginAsync } from 'fastify'
import { routes as writeRoutes } from './write.js'
import { routes as followRoutes } from './follow.js'
import { routes as queryRoutes } from './query.js'
import { routes as deleteRoutes } from './delete.js'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'
import { IAPI } from '@src/api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  server.register(writeRoutes, { api })
  server.register(followRoutes, { api })
  server.register(queryRoutes, { api })
  server.register(deleteRoutes, { api })
  server.register(getAllNamespacesRoutes, { api })
}
