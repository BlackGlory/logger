import { Emitter } from './emitter'

let emitter = new Emitter<string>()

export function getLoggerEmitter(): Emitter<string> {
  return emitter
}

export function rebuildLoggerEmitter(): void {
  emitter = new Emitter<string>()
}
