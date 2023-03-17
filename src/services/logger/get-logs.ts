import { FastifyPluginAsync } from 'fastify'
import { IAPI, ILog, LoggerNotFound, LogId } from '@src/contract.js'
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

      try {
        const logs = API.getLogs(loggerId, logIds)

        return reply.send(logs)
      } catch (e) {
        if (e instanceof LoggerNotFound) return reply.status(404).send()

        throw e
      }
    }
  )
}
