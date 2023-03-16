import { FastifyPluginAsync } from 'fastify'
import { IAPI, LogId } from '@src/contract.js'
import { loggerIdSchema, logIdsSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.delete<{
    Params: {
      loggerId: string
      logIds: string
    }
  }>(
    '/loggers/:loggerId/logs/:logIds'
  , {
      schema: {
        params: {
          loggerId: loggerIdSchema
        , logIds: logIdsSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.loggerId
      const logIds = req.params.logIds.split(',') as LogId[]

      API.removeLogs(loggerId, logIds)

      return reply
        .status(204)
        .send()
    }
  )
}
