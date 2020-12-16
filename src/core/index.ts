import { isAdmin } from './admin'
import { stats } from './stats'
import * as Logger from './logger'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import * as PurgePolicy from './purge-policy'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, stats
, Logger
, PurgePolicy
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
