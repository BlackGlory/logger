import { ILoggerConfiguration } from '@src/contract.js'
import { getLoggerConfiguration } from '@dao/get-logger-configuration.js'

export function getLogger(loggerId: string): ILoggerConfiguration | null {
  return getLoggerConfiguration(loggerId)
}
