import { LoggerDAO } from '@dao'

export async function prepareLoggers(loggerIds: string[]): Promise<void> {
  for (const loggerId of loggerIds) {
    await LoggerDAO.writeLog(loggerId, 'payload')
  }
}
