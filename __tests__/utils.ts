import * as DataInSqlite3 from '@dao/data-in-sqlite3/database.js'
import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import Ajv from 'ajv'

// @ts-ignore
const ajv = new Ajv()
let server: ReturnType<typeof buildServer>
let address: string

export function getAddress() {
  return address
}

export async function startService() {
  await initializeDatabases()
  server = buildServer()
  address = await server.listen()
}

export async function stopService() {
  await server.close()
  clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases() {
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()

  DataInSqlite3.openDatabase()
  await DataInSqlite3.prepareDatabase()
}

export async function clearDatabases() {
  ConfigInSqlite3.closeDatabase()
  DataInSqlite3.closeDatabase()
}

export function resetEnvironment() {
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
