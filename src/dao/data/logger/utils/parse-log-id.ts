export function parseLogId(logId: string): {
  timestamp: number
  number: number
} {
  const [timestamp, number] = logId.split('-')
  return {
    timestamp: Number.parseInt(timestamp)
  , number: Number.parseInt(number)
  }
}
