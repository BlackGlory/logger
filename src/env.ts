import { memoize } from 'lodash'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV = memoize(function (): NodeEnv | undefined {
  switch (process.env.NODE_ENV) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
})

export const PORT = memoize(function (): number {
  if (process.env.LOGGER_PORT) {
    return Number(process.env.LOGGER_PORT)
  } else {
    return 8080
  }
})

export const HOST = memoize(function (): string {
  return process.env.LOGGER_HOST || 'localhost'
})

export const ADMIN_PASSWORD = memoize(function (): string | undefined {
  return process.env.LOGGER_ADMIN_PASSWORD
})

export const LIST_BASED_ACCESS_CONTROL = memoize(function (): ListBasedAccessControl {
  switch (process.env.LOGGER_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
})

export const TOKEN_BASED_ACCESS_CONTROL = memoize(function (): boolean {
  return process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL === 'true'
})

export const WRITE_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.LOGGER_WRITE_TOKEN_REQUIRED === 'true'
})

export const READ_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.LOGGER_READ_TOKEN_REQUIRED === 'true'
})

export const DELETE_TOKEN_REQUIRED = memoize(function (): boolean {
  return process.env.LOGGER_DELETE_TOKEN_REQUIRED === 'true'
})

export const HTTP2 = memoize(function (): boolean {
  return process.env.LOGGER_HTTP2 === 'true'
})

export const JSON_VALIDATION = memoize(function (): boolean {
  return process.env.LOGGER_JSON_VALIDATION === 'true'
})

export const DEFAULT_JSON_SCHEMA = memoize(function (): string | undefined {
  return process.env.LOGGER_DEFAULT_JSON_SCHEMA
})

export const JSON_PAYLOAD_ONLY = memoize(function (): boolean {
  return process.env.LOGGER_JSON_PAYLOAD_ONLY === 'true'
})

export const CI = memoize(function (): boolean {
  return process.env.CI === 'true'
})

export const PAYLOAD_LIMIT = memoize(function (): number {
  if (process.env.LOGGER_PAYLOAD_LIMIT) {
    return Number(process.env.LOGGER_PAYLOAD_LIMIT)
  } else {
    return 1048576
  }
})

export const WRITE_PAYLOAD_LIMIT = memoize(function (): number {
  if (process.env.LOGGER_WRITE_PAYLOAD_LIMIT) {
    return Number(process.env.LOGGER_WRITE_PAYLOAD_LIMIT)
  } else {
    return PAYLOAD_LIMIT()
  }
})

export const LOGGER_LOGS_TIME_TO_LIVE = memoize(function (): number {
  if (process.env.LOGGER_LOGS_TIME_TO_LIVE) {
    return Number(process.env.LOGGER_LOGS_TIME_TO_LIVE)
  } else {
    return 0
  }
})

export const LOGGER_LOGS_LIMIT = memoize(function (): number {
  if (process.env.LOGGER_LOGS_LIMIT) {
    return Number(process.env.LOGGER_LOGS_LIMIT)
  } else {
    return 0
  }
})
