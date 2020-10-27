import { Logger } from './logger'

export async function createLogger<T>() {
  return new Logger<T>()
}
