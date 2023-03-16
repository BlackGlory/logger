import { go } from '@blackglory/go'
import { openDatabase, prepareDatabase, closeDatabase } from '@src/database.js'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env/index.js'
import { buildServer } from './server.js'
import { startMaintainer } from './maintainer.js'
import { youDied } from 'you-died'

// eslint-disable-next-line
go(async () => {
  openDatabase()
  youDied(closeDatabase)
  await prepareDatabase()

  const stopMaintainer = startMaintainer()
  youDied(stopMaintainer)

  const server = await buildServer()
  await server.listen({
    host: HOST()
  , port: PORT()
  })
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
