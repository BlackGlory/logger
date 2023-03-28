import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema } from '@src/schema.js'
import { IAPI, ILoggerConfig } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.put<{
    Params: { id: string }
    Body: ILoggerConfig
  }>(
    '/loggers/:id'
  , {
      schema: {
        params: { id: loggerIdSchema }
      , body: {
          timeToLive: { type: ['integer', 'null'] }
        , limit: { type: ['integer', 'null'] }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.id
      const config = req.body

      API.setLogger(loggerId, config)

      return reply
        .status(204)
        .send()
    }
  )
}
