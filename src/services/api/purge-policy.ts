import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/logger-with-purge-policies'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.PurgePolicy.getAllIds()
      reply.send(result)
    }
  )

  server.get<{
    Params: { id: string }
  }>(
    '/logger/:id/purge-policies'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            timeToLive: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          , limit: {
              anyOf: [
                { type: 'number' }
              , { type: 'null' }
              ]
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.PurgePolicy.get(id)
      reply.send(result)
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/logger/:id/purge-policies/time-to-live'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const timeToLive = req.body
      await Core.PurgePolicy.setTimeToLive(id, timeToLive)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { id: string }
    Body: number
  }>(
    '/logger/:id/purge-policies/limit'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const limit = req.body
      await Core.PurgePolicy.setLimit(id, limit)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/logger/:id/purge-policies/time-to-live'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.PurgePolicy.unsetTimeToLive(id)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { id: string }
  }>(
    '/logger/:id/purge-policies/limit'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.PurgePolicy.unsetLimit(id)
      reply.status(204).send()
    }
  )

  server.post<{
    Params: { id: string }
  }>(
    '/logger/:id/purge-policies'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      await Core.PurgePolicy.purge(id)
      reply.status(204).send()
    }
  )
}
