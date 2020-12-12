import { Emitter } from './emitter'

let emitter = createPubSubEmitter()

export function getPubSubEmitter(): Emitter<unknown> {
  return emitter
}

export function rebuildPubSubEmitter(): void {
  emitter = createPubSubEmitter()
}

function createPubSubEmitter(): Emitter<unknown> {
  return new Emitter<unknown>()
}
