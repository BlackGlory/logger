import { Observable } from 'rxjs'
import { getEmitter } from './emitter-instance'

export function subscribe(key: string, listener: (value: ILog) => void): IUnsubscribe {
  const emitter = getEmitter()
  const observable = new Observable<ILog>(observer => {
    const listener = (value: ILog) => observer.next(value)
    emitter.on(key, listener)
    return () => emitter.off(key, listener)
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
