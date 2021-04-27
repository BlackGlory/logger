import { Observable } from 'rxjs'
import { getEmitter } from './emitter-instance'

export function subscribe(namespace: string, listener: (value: ILog) => void): IUnsubscribe {
  const emitter = getEmitter()
  const observable = new Observable<ILog>(observer => {
    const listener = (value: ILog) => observer.next(value)
    emitter.on(namespace, listener)
    return () => emitter.off(namespace, listener)
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
