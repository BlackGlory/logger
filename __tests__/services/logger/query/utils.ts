import { LoggerDAO } from '@dao/index.js'

export function prepareLoggers(namespaces: string[]): void {
  for (const namespace of namespaces) {
    LoggerDAO.writeLog(namespace, 'payload')
  }
}
