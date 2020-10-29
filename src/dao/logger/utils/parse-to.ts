import { parseLogId } from './parse-log-id'

export function parseTo(parameters: SliceParameters) {
  return parameters.to ? parseLogId(parameters.to) : undefined
}
