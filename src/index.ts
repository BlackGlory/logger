import { prepareDatabase as prepareAccessControlDatabase } from '@dao/access-control/database'
import { prepareDatabase as prepareJsonSchemaDatabase } from '@dao/json-schema/database'
import { prepareDatabase as prepareLoggerDatabase } from '@dao/logger/database'
import { prepareDatabase as preparePurgePolicyDatabase } from '@dao/purge-policy/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('SIGHUP', () => process.exit(1))

;(async () => {
  await prepareAccessControlDatabase()
  await prepareJsonSchemaDatabase()
  await prepareLoggerDatabase()
  await preparePurgePolicyDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
