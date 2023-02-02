import { ILog } from './contract.js'
import { getEmitter } from './emitter-instance.js'

export function publish(namespace: string, value: ILog): void {
  const emitter = getEmitter()
  emitter.emit(namespace, value)
}
