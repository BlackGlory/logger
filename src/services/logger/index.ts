import { FastifyPluginAsync } from 'fastify'
import { routes as getAllLoggerIdsRoutes } from './get-all-logger-ids.js'
import { routes as setLoggerRoutes } from './set-logger.js'
import { routes as getLoggerRoutes } from './get-logger.js'
import { routes as removeLoggerRoutes } from './remove-logger.js'
import { routes as logRoutes } from './log.js'
import { routes as followRoutes } from './follow.js'
import { routes as getLogsRoutes } from './get-logs.js'
import { routes as removeLogsRoutes } from './remove-logs.js'
import { routes as queryLogsRoutes } from './query-logs.js'
import { routes as clearLogsRoutes } from './clear-logs.js'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  await server.register(getAllLoggerIdsRoutes, { API })
  await server.register(setLoggerRoutes, { API })
  await server.register(getLoggerRoutes, { API })
  await server.register(removeLoggerRoutes, { API })
  await server.register(logRoutes, { API })
  await server.register(followRoutes, { API })
  await server.register(getLogsRoutes, { API })
  await server.register(removeLogsRoutes, { API })
  await server.register(queryLogsRoutes, { API })
  await server.register(clearLogsRoutes, { API })
}
