import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get(
    '/logger-with-token-policies'
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
      const result = await Core.TBAC.TokenPolicy.getAllNamespaces()
      reply.send(result)
    }
  )

  server.get<{
    Params: { namespace: string }
  }>(
    '/logger/:namespace/token-policies'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , response: {
          200: {
            writeTokenRequired: { type: 'boolean', nullable: true }
          , readTokenRequired: { type: 'boolean', nullable: true }
          , deleteTokenRequired: { type: 'boolean', nullable: true }
          }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const result = await Core.TBAC.TokenPolicy.get(namespace)
      reply.send(result)
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/logger/:namespace/token-policies/write-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.TBAC.TokenPolicy.setWriteTokenRequired(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string}
  }>(
    '/logger/:namespace/token-policies/write-token-required'
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
      await Core.TBAC.TokenPolicy.unsetWriteTokenRequired(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/logger/:namespace/token-policies/read-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.TBAC.TokenPolicy.setReadTokenRequired(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string }
  }>(
    '/logger/:namespace/token-policies/read-token-required'
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
      await Core.TBAC.TokenPolicy.unsetReadTokenRequired(namespace)
      reply.status(204).send()
    }
  )

  server.put<{
    Params: { namespace: string }
    Body: boolean
  }>(
    '/logger/:namespace/token-policies/delete-token-required'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , body: { type: 'boolean' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const namespace = req.params.namespace
      const val = req.body
      await Core.TBAC.TokenPolicy.setDeleteTokenRequired(namespace, val)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { namespace: string}
  }>(
    '/logger/:namespace/token-policies/delete-token-required'
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
      await Core.TBAC.TokenPolicy.unsetDeleteTokenRequired(namespace)
      reply.status(204).send()
    }
  )
}
