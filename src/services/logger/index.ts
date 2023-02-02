import { FastifyPluginAsync } from 'fastify'
import { routes as writeRoutes } from './write.js'
import { routes as followRoutes } from './follow.js'
import { routes as queryRoutes } from './query.js'
import { routes as deleteRoutes } from './delete.js'
import { routes as getAllNamespacesRoutes } from './get-all-namespaces.js'
import { IAPI } from '@src/api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
  await server.register(writeRoutes, { api })
  await server.register(followRoutes, { api })
  await server.register(queryRoutes, { api })
  await server.register(deleteRoutes, { api })
  await server.register(getAllNamespacesRoutes, { api })
}
