import { ILoggerConfig } from '@src/contract.js'
import { getLoggerConfiguration } from '@dao/get-logger-configuration.js'

export function getLogger(loggerId: string): ILoggerConfig | null {
  return getLoggerConfiguration(loggerId)
}
