import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema } from '@src/schema.js'
import { IAPI, ILoggerConfig } from '@src/contract.js'
import { AssertionError } from '@blackglory/errors'

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
          timeToLive: {
            type: ['integer', 'null']
          , minimum: 0
          }
        , limit: {
            type: ['integer', 'null']
          , minimum: 0
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.id
      const config = req.body

      try {
        API.setLogger(loggerId, config)
      } catch (e) {
        if (e instanceof AssertionError) {
          return reply
            .status(400)
            .send(e.message)
        } else {
          throw e
        }
      }

      return reply
        .status(204)
        .send()
    }
  )
}
