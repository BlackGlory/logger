import { parseLogId } from './parse-log-id.js'

export function parseTo(parameters: ISlice) {
  return parameters.to ? parseLogId(parameters.to) : undefined
}
