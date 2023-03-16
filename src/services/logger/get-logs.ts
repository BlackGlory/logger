import { FastifyPluginAsync } from 'fastify'
import { IAPI, ILog, LogId } from '@src/contract.js'
import { loggerIdSchema, logIdsSchema } from '@src/schema.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.get<{
    Params: {
      loggerId: string
      logIds: string
    }
    Reply: Array<ILog | null>
  }>(
    '/loggers/:loggerId/logs/:logIds'
  , {
      schema: {
        params: {
          loggerId: loggerIdSchema
        , logIds: logIdsSchema
        }
      , response: {
          200: {
            type: 'array'
          , items: {}
          }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.loggerId
      const logIds = req.params.logIds.split(',') as LogId[]

      const logs = API.getLogs(loggerId, logIds)

      if (logs) {
        return reply.send(logs)
      } else {
        return reply
          .status(404)
          .send()
      }
    }
  )
}
