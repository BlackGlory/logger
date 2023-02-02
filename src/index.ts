import { go } from '@blackglory/go'
import * as Config from '@dao/config/database.js'
import * as Data from '@dao/data/database.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { buildServer } from './server.js'
import { youDied } from 'you-died'

go(async () => {
  Config.openDatabase()
  youDied(() => Config.closeDatabase())
  Config.prepareDatabase()

  Data.openDatabase()
  youDied(() => Data.closeDatabase())
  Data.prepareDatabase()

  const server = buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
