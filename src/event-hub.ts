import { Emitter } from '@blackglory/structures'
import { ILog } from '@src/contract.js'

export enum Event {
  LoggerSet
, LoggerRemoved
, LogWritten
, LogRemoved
}

type LoggerEventToArgs = {
  [Event.LoggerSet]: []
  [Event.LoggerRemoved]: []
  [Event.LogWritten]: [log: ILog]
  [Event.LogRemoved]: []
}

type GlobalEventToArgs = {
  [Key in Event]: [loggerId: string, ...args: LoggerEventToArgs[Key]]
}

class EventHub {
  private idToEmitter: Map<string, Emitter<LoggerEventToArgs>> = new Map()
  private globalEmitter: Emitter<GlobalEventToArgs> = new Emitter()

  onLogger<T extends Event>(
    id: string
  , event: T
  , listener: (...args: LoggerEventToArgs[T]) => void
  ): () => void {
    if (!this.idToEmitter.has(id)) {
      this.idToEmitter.set(id, new Emitter())
    }

    const emitter = this.idToEmitter.get(id)!
    return emitter.on(event, listener)
  }

  onceLogger<T extends Event>(
    id: string
  , event: T
  , listener: (...args: LoggerEventToArgs[T]) => void
  ) {
    if (!this.idToEmitter.has(id)) {
      this.idToEmitter.set(id, new Emitter())
    }

    const emitter = this.idToEmitter.get(id)!
    return emitter.once(event, listener)
  }

  onGlobal<T extends Event>(
    event: T
  , listener: (...args: GlobalEventToArgs[T]) => void
  ): () => void {
    return this.globalEmitter.on(event, listener)
  }

  emit<T extends Event>(
    loggerId: string
  , event: T
  , ...args: LoggerEventToArgs[T]
  ): void {
    this.idToEmitter.get(loggerId)?.emit(event, ...args)

    const globalArgs = [loggerId, ...args] as GlobalEventToArgs[T]
    this.globalEmitter.emit(event, ...globalArgs)
  }
}

export const eventHub = new EventHub()
