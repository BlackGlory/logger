import { LoggerDAO } from '@dao'

export function prepareLoggers() {
  LoggerDAO.writeLog('id', 'payload')
}
