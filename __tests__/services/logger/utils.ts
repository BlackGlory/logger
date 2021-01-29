import { LoggerDAO } from '@dao/data-in-sqlite3/logger'

export function prepareLoggers() {
  LoggerDAO.writeLog('id', 'payload')
}
