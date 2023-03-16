import { IAPI } from '@src/contract.js'
import { getAllLoggerIds } from './get-all-logger-ids.js'
import { setLogger } from './set-logger.js'
import { getLogger } from './get-logger.js'
import { removeLogger } from './remove-logger.js'
import { log } from './log.js'
import { follow } from './follow.js'
import { getLogs } from './get-logs.js'
import { removeLogs } from './remove-logs.js'
import { queryLogs } from './query-logs.js'
import { clearLogs } from './clear-logs.js'

export const API: IAPI = {
  getAllLoggerIds
, setLogger
, getLogger
, removeLogger
, log
, follow
, getLogs
, removeLogs
, queryLogs
, clearLogs
}
