import * as AccessControlDatabase from '@dao/access-control/database'
import * as JsonSchemaDatabase from '@dao/json-schema/database'
import * as LoggerDatabase from '@dao/logger/database'
import * as PurgePolicyDatabase from '@dao/purge-policy/database'

export async function resetDatabases() {
  await resetAccessControlDatabase()
  await resetJsonSchemaDatabase()
  await resetLoggerDatabase()
  await resetPurgePolicyDatabase()
}

export async function resetAccessControlDatabase() {
  AccessControlDatabase.closeDatabase()
  await AccessControlDatabase.prepareDatabase()
}

export async function resetJsonSchemaDatabase() {
  JsonSchemaDatabase.closeDatabase()
  await JsonSchemaDatabase.prepareDatabase()
}

export async function resetLoggerDatabase() {
  LoggerDatabase.closeDatabase()
  await LoggerDatabase.prepareDatabase()
}

export async function resetPurgePolicyDatabase() {
  PurgePolicyDatabase.closeDatabase()
  await PurgePolicyDatabase.prepareDatabase()
}

export function resetEnvironment() {
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
