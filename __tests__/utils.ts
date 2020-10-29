import { getDatabase as getConfigDatabase, reconnectDatabase as reconnectConfigDatabase, migrateDatabase as migrateConfigDatabase } from '@dao/config/database'
import { getDatabase as getLoggerDatabase, reconnectDatabase as reconnectLoggerDatabase, migrateDatabase as migrateLoggerDatabase } from '@dao/logger/database'

export async function prepareConfigDatabase() {
  reconnectConfigDatabase()
  const db = getConfigDatabase()
  await migrateConfigDatabase()
  return db
}

export async function prepareLoggerDatabase() {
  reconnectLoggerDatabase()
  const db = getLoggerDatabase()
  await migrateLoggerDatabase()
  return db
}

export async function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // sjee also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.LOGGER_HOST
  delete process.env.LOGGER_PORT
  delete process.env.LOGGER_ADMIN_PASSWORD
  delete process.env.LOGGER_LIST_BASED_ACCESS_CONTROL
  delete process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.LOGGER_DISABLE_NO_TOKENS
  delete process.env.LOGGER_JSON_VALIDATION
  delete process.env.LOGGER_DEFAULT_JSON_SCHEMA
  delete process.env.LOGGER_JSON_PAYLOAD_ONLY
}
