import { parseLogId } from './parse-log-id'

export function parseFrom(parameters: ISlice) {
  return parameters.from ? parseLogId(parameters.from) : undefined
}
