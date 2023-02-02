import { writeLog } from './write-log.js'
import { queryLogs } from './query-logs.js'
import { deleteLogs } from './delete-logs.js'
import { purgeByLimit, purgeByTimestamp } from './purge.js'
import { getAllNamespaces } from './get-all-namespaces.js'
import { ILoggerDAO } from './contract.js'

export const LoggerDAO: ILoggerDAO = {
  writeLog
, queryLogs
, deleteLogs

, getAllNamespaces

, purgeByTimestamp
, purgeByLimit
}
