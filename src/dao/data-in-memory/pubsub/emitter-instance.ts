import { Emitter } from '@blackglory/structures'

let emitter: Emitter<Record<string, [ILog]>> = createEmitter()

export function getEmitter(): Emitter<Record<string, [ILog]>> {
  return emitter
}

export function resetEmitter(): void {
  emitter = createEmitter()
}

function createEmitter(): Emitter<Record<string, [ILog]>> {
  return new Emitter<Record<string, [ILog]>>()
}
