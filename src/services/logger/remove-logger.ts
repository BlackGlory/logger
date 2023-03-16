import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema } from '@src/schema.js'
import { IAPI } from '@src/contract.js'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.delete<{
    Params: { id: string }
  }>(
    '/loggers/:id'
  , {
      schema: {
        params: { id: loggerIdSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.id

      API.removeLogger(loggerId)

      return reply
        .status(204)
        .send()
    }
  )
}
