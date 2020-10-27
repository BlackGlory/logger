import { Emitter } from './emitter'
import { Observable } from 'rxjs'

export class Logger<T> implements ILogger<T> {
  #emitter = new Emitter<T>()

  async log(key: string, value: T) {
    this.#emitter.emit(key, value)
  }

  follow(key: string, listener: (value: T) => void) {
    const observable = new Observable<T>(observer => {
      const listener = (value: T) => observer.next(value)
      this.#emitter.on(key, listener)
      return () => this.#emitter.off(key, listener)
    })
    const subscription = observable.subscribe(listener)
    return () => subscription.unsubscribe()
  }

  async delete(key: string, parameters: IParameters) {
    return undefined
  }

  async query(key: string, parameters: IParameters) {
    return { id: 'id', payload: 'payload'}
  }
}
