import { memoize } from 'lodash'
import * as env from 'env-var'
import { Getter } from '@blackglory/types'

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

export const NODE_ENV: Getter<NodeEnv | undefined> = memoize(() => {
  const val = env.get('NODE_ENV')
                 .asEnum(['test', 'development', 'production'])

  switch (val) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
})

export const CI: Getter<boolean> = memoize(() =>
  env.get('CI')
     .default('false')
     .asBoolStrict()
)

export const HOST: Getter<string> = memoize(() =>
  env.get('LOGGER_HOST')
     .default('localhost')
     .asString()
)

export const PORT: Getter<number> = memoize(() =>
  env.get('LOGGER_PORT')
     .default(8080)
     .asPortNumber()
)

export const HTTP2: Getter<boolean> = memoize(() =>
  env.get('LOGGER_HTTP2')
     .default('false')
     .asBoolStrict()
)

export const PAYLOAD_LIMIT: Getter<number> = memoize(() =>
  env.get('LOGGER_PAYLOAD_LIMIT')
     .default(1048576)
     .asIntPositive()
)

export const WRITE_PAYLOAD_LIMIT: Getter<number> = memoize(() =>
  env.get('LOGGER_WRITE_PAYLOAD_LIMIT')
     .default(PAYLOAD_LIMIT())
     .asIntPositive()
)


export const ADMIN_PASSWORD: Getter<string | undefined> = memoize(() =>
  env.get('LOGGER_ADMIN_PASSWORD')
     .asString()
)

export const LIST_BASED_ACCESS_CONTROL: Getter<ListBasedAccessControl> = memoize(() => {
  const val = env.get('LOGGER_LIST_BASED_ACCESS_CONTROL')
                 .asEnum(['whitelist', 'blacklist'])

  switch (val) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
})

export const TOKEN_BASED_ACCESS_CONTROL: Getter<boolean> = memoize(() =>
  env.get('LOGGER_TOKEN_BASED_ACCESS_CONTROL')
     .default('false')
     .asBoolStrict()
)

export const WRITE_TOKEN_REQUIRED: Getter<boolean> = memoize(() =>
  env.get('LOGGER_WRITE_TOKEN_REQUIRED')
     .default('false')
     .asBoolStrict()
)

export const READ_TOKEN_REQUIRED: Getter<boolean> = memoize(() =>
  env.get('LOGGER_READ_TOKEN_REQUIRED')
     .default('false')
     .asBoolStrict()
)

export const DELETE_TOKEN_REQUIRED: Getter<boolean> = memoize(() =>
  env.get('LOGGER_DELETE_TOKEN_REQUIRED')
     .default('false')
     .asBoolStrict()
)

export const JSON_VALIDATION: Getter<boolean> = memoize(() =>
  env.get('LOGGER_JSON_VALIDATION')
     .default('false')
     .asBoolStrict()
)

export const DEFAULT_JSON_SCHEMA: Getter<object | undefined> = memoize(() =>
  env.get('LOGGER_DEFAULT_JSON_SCHEMA')
     .asJsonObject()
)

export const JSON_PAYLOAD_ONLY: Getter<boolean> = memoize(() =>
  env.get('LOGGER_JSON_PAYLOAD_ONLY')
     .default('false')
     .asBoolStrict()
)

export const LOGGER_LOGS_TIME_TO_LIVE: Getter<number> = memoize(() =>
  env.get('LOGGER_LOGS_TIME_TO_LIVE')
     .default(0)
     .asInt()
)

export const LOGGER_LOGS_LIMIT: Getter<number> = memoize(() =>
  env.get('LOGGER_LOGS_LIMIT')
     .default(0)
     .asInt()
)
