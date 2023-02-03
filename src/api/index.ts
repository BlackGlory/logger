import { isAdmin } from './admin.js'
import * as Logger from './logger.js'
import * as PurgePolicy from './purge-policy.js'
import { IAPI } from './contract.js'

export const api: IAPI = {
  isAdmin
, Logger
, PurgePolicy
}
