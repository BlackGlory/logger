import { LogId } from '@src/contract.js'

export function parseLogId(logId: LogId): {
  timestamp: number
  number: number
} {
  const [timestamp, number] = logId.split('-')

  return {
    timestamp: Number.parseInt(timestamp, 10)
  , number: Number.parseInt(number, 10)
  }
}
