import { parseLogId } from './parse-log-id'

export function parseFrom(parameters: SliceParameters) {
  return parameters.from ? parseLogId(parameters.from) : undefined
}
