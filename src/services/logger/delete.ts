import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync<{
  Logger: ILogger<string>
  DAO: IDataAccessObject
}> = async function routes(server, { Logger, DAO }) {
  return undefined
}
