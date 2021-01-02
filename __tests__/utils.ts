import * as DataInSqlite3 from '@dao/data-in-sqlite3/database'
import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database'
import { resetCache } from '@env/cache'

export async function resetDatabases() {
  await resetDataInSqlite3Database()
  await resetConfigInSqlite3Database()
}

async function resetDataInSqlite3Database() {
  DataInSqlite3.closeDatabase()
  DataInSqlite3.openDatabase()
  await DataInSqlite3.prepareDatabase()
}

async function resetConfigInSqlite3Database() {
  ConfigInSqlite3.closeDatabase()
  ConfigInSqlite3.openDatabase()
  await ConfigInSqlite3.prepareDatabase()
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
