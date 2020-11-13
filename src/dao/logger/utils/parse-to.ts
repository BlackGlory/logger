import { parseLogId } from './parse-log-id'

export function parseTo(parameters: ISlice) {
  return parameters.to ? parseLogId(parameters.to) : undefined
}
