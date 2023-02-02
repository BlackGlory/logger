import * as DataInSqlite3 from '@dao/data/database.js'
import * as ConfigInSqlite3 from '@dao/config/database.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import Ajv from 'ajv'
import { UnpackedPromise } from 'hotypes'

const ajv = new Ajv.default()
let server: UnpackedPromise<ReturnType<typeof buildServer>>
let address: string

export function getAddress(): string {
  return address
}

export async function startService(): Promise<void> {
  await initializeDatabases()
  server = await buildServer()
  address = await server.listen()
}

export async function stopService(): Promise<void> {
  await server.close()
  clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases(): Promise<void> {
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  await DataInSqlite3.prepareDatabase()
}

export function clearDatabases(): void {
  ConfigInSqlite3.closeDatabase()
  DataInSqlite3.closeDatabase()
}

export function resetEnvironment(): void {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // see also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.LOGGER_ADMIN_PASSWORD
  delete process.env.LOGGER_LIST_BASED_ACCESS_CONTROL
  delete process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.LOGGER_WRITE_TOKEN_REQUIRED
  delete process.env.LOGGER_READ_TOKEN_REQUIRED
  delete process.env.LOGGER_DELETE_TOKEN_REQUIRED
  delete process.env.LOGGER_JSON_VALIDATION
  delete process.env.LOGGER_DEFAULT_JSON_SCHEMA
  delete process.env.LOGGER_JSON_PAYLOAD_ONLY

  // reset memoize
  resetCache()
}

export function expectMatchSchema(data: unknown, schema: object): void {
  if (!ajv.validate(schema, data)) {
    throw new Error(ajv.errorsText())
  }
}
