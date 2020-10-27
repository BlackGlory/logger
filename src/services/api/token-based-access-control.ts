import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'

export const routes: FastifyPluginAsync<{ DAO: IDataAccessObject }> = async function routes(server, { DAO }) {
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
      const result = await DAO.getAllIdsWithTokens()
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
              , log: { type: 'boolean' }
              , follow: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  , async (req, reply) => {
      const result = await DAO.getAllTokens(req.params.id)
      reply.send(result)
    }
  )

  // log token
  server.put<{
    Params: { token: string, id: string }
  }>(
    '/logger/:id/tokens/:token/log'
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
      await DAO.setLogToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id: string }
  }>(
    '/logger/:id/tokens/:token/log'
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
      await DAO.unsetLogToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  // follow token
  server.put<{
    Params: { token: string, id : string }
  }>(
    '/logger/:id/tokens/:token/follow'
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
      await DAO.setFollowToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )

  server.delete<{
    Params: { token: string, id : string }
  }>(
    '/logger/:id/tokens/:token/follow'
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
      await DAO.unsetFollowToken({ token: req.params.token, id: req.params.id })
      reply.status(204).send()
    }
  )
}
