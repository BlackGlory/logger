import { parseLogId } from './parse-log-id.js'

export function parseFrom(parameters: ISlice) {
  return parameters.from ? parseLogId(parameters.from) : undefined
}
