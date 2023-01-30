import { isAdmin } from './admin.js'
import * as Logger from './logger.js'
import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as JsonSchema from './json-schema.js'
import * as PurgePolicy from './purge-policy.js'
import { TBAC } from './token-based-access-control/index.js'

export const Core: ICore = {
  isAdmin
, Logger
, PurgePolicy
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
