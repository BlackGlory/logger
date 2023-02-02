import { ISlice } from '../contract.js'
import { parseLogId } from './parse-log-id.js'

export function parseTo(parameters: ISlice):
| {
    timestamp: number
    number: number
  }
| undefined {
  return parameters.to ? parseLogId(parameters.to) : undefined
}
