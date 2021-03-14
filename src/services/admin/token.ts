import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  // get all ids
  server.get<{ Params: { id: string }}>(
    '/logger-with-tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await Core.TBAC.Token.getAllIds()
      reply.send(result)
    }
  )

  // get all tokens
  server.get<{
    Params: { id: string }
  }>(
    '/logger/:id/tokens'
  , {
      schema: {
        params: { id: idSchema }
      , response: {
          200: {
            type: 'array'
          , items: {
              type: 'object'
            , properties: {
                token: tokenSchema
              , write: { type: 'boolean' }
              , read: { type: 'boolean' }
              , delete: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const result = await Core.TBAC.Token.getAll(id)
      reply.send(result)
    }
  )

  // write token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/logger/:id/tokens/:token/write'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.setWriteToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/logger/:id/tokens/:token/write'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.unsetWriteToken(id, token)
      reply.status(204).send()
    }
  )

  // read token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/logger/:id/tokens/:token/read'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.setReadToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/logger/:id/tokens/:token/read'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.unsetReadToken(id, token)
      reply.status(204).send()
    }
  )

  // delete token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/logger/:id/tokens/:token/delete'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.setDeleteToken(id, token)
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/logger/:id/tokens/:token/delete'
  , {
      schema: {
        params: {
          token: tokenSchema
        , id: idSchema
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.params.token
      await Core.TBAC.Token.unsetDeleteToken(id, token)
      reply.status(204).send()
    }
  )
}
