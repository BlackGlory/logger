import { LoggerDAO } from '@dao/index.js'

export async function prepareLoggers(namespaces: string[]): Promise<void> {
  for (const namespace of namespaces) {
    await LoggerDAO.writeLog(namespace, 'payload')
  }
}
