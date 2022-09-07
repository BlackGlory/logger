import { go } from '@blackglory/go'
import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database'
import * as DataInSqlite3 from '@dao/data-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, NODE_ENV, NodeEnv } from '@env'
import { youDied } from 'you-died'

go(async () => {
  ConfigInSqlite3.openDatabase()
  youDied(() => ConfigInSqlite3.closeDatabase())
  ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  youDied(() => DataInSqlite3.closeDatabase())
  DataInSqlite3.prepareDatabase()

  const server = buildServer()
  await server.listen(PORT(), HOST())
  if (NODE_ENV() === NodeEnv.Test) process.exit()

  process.send?.('ready')
})
