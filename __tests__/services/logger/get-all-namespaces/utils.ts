import { LoggerDAO } from '@dao'

export async function prepareLoggers(namespaces: string[]): Promise<void> {
  for (const namespace of namespaces) {
    await LoggerDAO.writeLog(namespace, 'payload')
  }
}
