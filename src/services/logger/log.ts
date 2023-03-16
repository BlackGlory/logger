import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema } from '@src/schema.js'
import { IAPI, LoggerNotFound } from '@src/contract.js'
import { JSONValue } from '@blackglory/prelude'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.post<{
    Params: { id: string }
    Body: JSONValue
  }>(
    '/loggers/:id/log'
  , {
      schema: {
        params: { id: loggerIdSchema }
      , response: {
          204: { type: 'null' }
        , 404: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const loggerId = req.params.id
      const content = req.body

      try {
        API.log(loggerId, content)

        return reply
          .status(204)
          .send()
      } catch (e) {
        if (e instanceof LoggerNotFound) return reply.status(404).send()

        throw e
      }
    }
  )
}
