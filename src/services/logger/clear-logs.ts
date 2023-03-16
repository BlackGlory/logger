import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema, logIdSchema } from '@src/schema.js'
import { IAPI, IRange, LogId, Order } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.delete<{
    Params: { id: string }
    Querystring: {
      order?: Order
      from?: LogId
      to?: LogId
      limit?: number
      skip?: number
    }
  }>(
    '/loggers/:id/logs'
  , {
      schema: {
        params: {
          id: loggerIdSchema
        }
      , querystring: {
          anyOf: [
            {
              type: 'object'
            , properties: {}
            }
          , {
              type: 'object'
            , properties: {
                order: { enum: ['asc', 'desc'] }
              , from: logIdSchema
              , to: logIdSchema
              , limit: { type: 'integer' }
              , skip: { type: 'integer' }
              }
            }
          ]
        }
      , response: {
          204: { type: 'null' }
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
        order: order ?? Order.Asc
      , from
      , to
      , limit
      , skip
      }

      API.clearLogs(id, range)

      return reply
        .status(204)
        .send()
    }
  )
}
