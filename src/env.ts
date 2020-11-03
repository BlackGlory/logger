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

export function NODE_ENV(): NodeEnv | undefined {
  switch (process.env.NODE_ENV) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
}

export function PORT(): number {
  if (process.env.LOGGER_PORT) {
    return Number(process.env.LOGGER_PORT)
  } else {
    return 8080
  }
}

export function HOST(): string {
  return process.env.LOGGER_HOST || 'localhost'
}

export function ADMIN_PASSWORD(): string | undefined {
  return process.env.LOGGER_ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL(): ListBasedAccessControl {
  switch (process.env.LOGGER_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL(): boolean {
  return process.env.LOGGER_TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function WRITE_TOKEN_REQUIRED(): boolean {
  return process.env.LOGGER_WRITE_TOKEN_REQUIRED === 'true'
}

export function READ_TOKEN_REQUIRED(): boolean {
  return process.env.LOGGER_READ_TOKEN_REQUIRED === 'true'
}

export function DELETE_TOKEN_REQUIRED(): boolean {
  return process.env.LOGGER_DELETE_TOKEN_REQUIRED === 'true'
}

export function HTTP2(): boolean {
  return process.env.LOGGER_HTTP2 === 'true'
}

export function JSON_VALIDATION(): boolean {
  return process.env.LOGGER_JSON_VALIDATION === 'true'
}

export function DEFAULT_JSON_SCHEMA(): string | undefined {
  return process.env.LOGGER_DEFAULT_JSON_SCHEMA
}

export function JSON_PAYLOAD_ONLY(): boolean {
  return process.env.LOGGER_JSON_PAYLOAD_ONLY === 'true'
}

export function CI(): boolean {
  return process.env.CI === 'true'
}

export function PAYLOAD_LIMIT(): number {
  if (process.env.LOGGER_PAYLOAD_LIMIT) {
    return Number(process.env.LOGGER_PAYLOAD_LIMIT)
  } else {
    return 1048576
  }
}

export function WRITE_PAYLOAD_LIMIT(): number {
  if (process.env.LOGGER_WRITE_PAYLOAD_LIMIT) {
    return Number(process.env.LOGGER_WRITE_PAYLOAD_LIMIT)
  } else {
    return PAYLOAD_LIMIT()
  }
}

export function LOGGER_LOGS_TIME_TO_LIVE(): number {
  if (process.env.LOGGER_LOGS_TIME_TO_LIVE) {
    return Number(process.env.LOGGER_LOGS_TIME_TO_LIVE)
  } else {
    return 0
  }
}

export function LOGGER_LOGS_LIMIT(): number {
  if (process.env.LOGGER_LOGS_LIMIT) {
    return Number(process.env.LOGGER_LOGS_LIMIT)
  } else {
    return 0
  }
}
