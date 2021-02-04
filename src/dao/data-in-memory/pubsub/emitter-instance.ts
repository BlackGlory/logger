import { Emitter } from '@blackglory/structures'

let emitter: Emitter<ILog> = createEmitter()

export function getEmitter(): Emitter<ILog> {
  return emitter
}

export function resetEmitter(): void {
  emitter = createEmitter()
}

function createEmitter(): Emitter<ILog> {
  return new Emitter<ILog>()
}
