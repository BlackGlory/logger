import { ISlice } from '../contract.js'
import { parseLogId } from './parse-log-id.js'

export function parseFrom(parameters: ISlice):
| {
    timestamp: number
    number: number
  }
| undefined {
  return parameters.from ? parseLogId(parameters.from) : undefined
}
