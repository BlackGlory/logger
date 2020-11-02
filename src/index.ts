import { migrateDatabase as migrateAccessControlDatabase } from '@src/dao/access-control/database'
import { migrateDatabase as migrateJsonSchemaDatabase } from '@src/dao/json-schema/database'
import { migrateDatabase as migrateLoggerDatabase } from '@src/dao/logger/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('SIGHUP', () => process.exit(1))

;(async () => {
  await migrateAccessControlDatabase()
  await migrateJsonSchemaDatabase()
  await migrateLoggerDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
