import { getEmitter } from './emitter-instance'

export function publish(key: string, value: ILog): void {
  const emitter = getEmitter()
  emitter.emit(key, value)
}
