import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema } from '@src/schema.js'
import { IAPI, ILoggerConfig } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.get<{
    Params: { id: string }
    Reply: ILoggerConfig
  }>(
    '/loggers/:id'
  , {
      schema: {
        params: { id: loggerIdSchema }
      , response: {
          200: {
            timeToLive: { type: ['integer', 'null'] }
          , limit: { type: ['integer', 'null'] }
          }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.id

      const config = API.getLogger(loggerId)

      if (config) {
        return reply.send(config)
      } else {
        return reply
          .status(404)
          .send()
      }
    }
  )
}
