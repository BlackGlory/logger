import { Observable } from 'rxjs'
import { ILog, IUnsubscribe } from './contract.js'
import { getEmitter } from './emitter-instance.js'

export function subscribe(
  namespace: string
, listener: (value: ILog) => void
): IUnsubscribe {
  const emitter = getEmitter()
  const observable = new Observable<ILog>(observer => {
    const removeListener = emitter.on(
      namespace
    , (value: ILog) => observer.next(value)
    )
    return () => removeListener()
  })
  const subscription = observable.subscribe(listener)
  return () => subscription.unsubscribe()
}
