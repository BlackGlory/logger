import {
  getDatabase as getAccessControlDatabase
, reconnectDatabase as reconnectAccessControlDatabase
, migrateDatabase as migrateAccessControlDatabase
} from '@dao/access-control/database'
import {
  getDatabase as getJsonSchemaDatabase
, reconnectDatabase as reconnectJsonSchemaDatabase
, migrateDatabase as migrateJsonSchemaDatabase
} from '@dao/json-schema/database'
import {
  getDatabase as getLoggerDatabase
, reconnectDatabase as reconnectLoggerDatabase
, migrateDatabase as migrateLoggerDatabase
} from '@dao/logger/database'

export async function prepareAccessControlDatabase() {
  reconnectAccessControlDatabase()
  const db = getAccessControlDatabase()
  await migrateAccessControlDatabase()
  return db
}

export async function prepareJsonSchemaDatabase() {
  reconnectJsonSchemaDatabase()
  const db = getJsonSchemaDatabase()
  await migrateJsonSchemaDatabase()
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
  delete process.env.LOGGER_WRITE_TOKEN_REQUIRED
  delete process.env.LOGGER_READ_TOKEN_REQUIRED
  delete process.env.LOGGER_DELETE_TOKEN_REQUIRED
  delete process.env.LOGGER_JSON_VALIDATION
  delete process.env.LOGGER_DEFAULT_JSON_SCHEMA
  delete process.env.LOGGER_JSON_PAYLOAD_ONLY
}
