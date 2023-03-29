import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema, logIdSchema } from '@src/schema.js'
import { IAPI, ILog, IRange, LoggerNotFound, LogId, Order } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.get<{
    Params: { id: string }
    Querystring: {
      order: Order
      from?: LogId
      to?: LogId
      limit?: number
      skip?: number
    }
    Reply: ILog[]
  }>(
    '/loggers/:id/logs'
  , {
      schema: {
        params: {
          id: loggerIdSchema
        }
      , querystring: {
          type: 'object'
        , properties: {
            order: { enum: ['asc', 'desc'] }
          , from: logIdSchema
          , to: logIdSchema
          , limit: { type: 'integer' }
          , skip: { type: 'integer' }
          }
        , required: ['order']
        }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                id: logIdSchema
              , value: {}
              }
            }
          }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const order = req.query.order
      const from = req.query.from
      const to = req.query.to
      const limit = req.query.limit
      const skip = req.query.skip

      const range: IRange = {
        order
      , from
      , to
      , limit
      , skip
      }

      try {
        const logs = API.queryLogs(id, range)

        return reply.send(logs)
      } catch (e) {
        if (e instanceof LoggerNotFound) return reply.status(404).send()

        throw e
      }
    }
  )
}
