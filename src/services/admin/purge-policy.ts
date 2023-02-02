import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema.js'
import { IAPI } from '@api/contract.js'

export const routes: FastifyPluginAsync<{ api: IAPI }> = async (server, { api }) => {
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
      const result = api.PurgePolicy.getAllNamespaces()
      return reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/logger/:namespace/purge-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            timeToLive: { type: 'number', nullable: true }
          , limit: { type: 'number', nullable: true }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = api.PurgePolicy.get(namespace)
      return reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/logger/:namespace/purge-policies/time-to-live'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const timeToLive = req.body
      api.PurgePolicy.setTimeToLive(namespace, timeToLive)
      return reply
        .status(204)
        .send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: number
  }>(
    '/logger/:namespace/purge-policies/limit'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const limit = req.body
      api.PurgePolicy.setLimit(namespace, limit)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/logger/:namespace/purge-policies/time-to-live'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      api.PurgePolicy.unsetTimeToLive(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/logger/:namespace/purge-policies/limit'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      api.PurgePolicy.unsetLimit(namespace)
      return reply
        .status(204)
        .send()
    }
  )

  server.post<{
    Params: { namespace: string }
  }>(
    '/logger/:namespace/purge-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      api.PurgePolicy.purge(namespace)
      return reply
        .status(204)
        .send()
    }
  )
}
