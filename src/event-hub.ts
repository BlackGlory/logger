import { Emitter } from '@blackglory/structures'
import { ILog } from '@src/contract.js'

export enum Event {
  LoggerSet
, LoggerRemoved
, LogWritten
, LogRemoved
}

type EventToArgs = {
  [Event.LoggerSet]: []
  [Event.LoggerRemoved]: []
  [Event.LogWritten]: [log: ILog]
  [Event.LogRemoved]: []
}

type GlobalEventToArgs = {
  [Key in Event]: [loggerId: string, ...args: EventToArgs[Key]]
}

class EventHub {
  private loggerIdToEmitter: Map<string, Emitter<EventToArgs>> = new Map()
  private globalEmitter: Emitter<GlobalEventToArgs> = new Emitter()

  onLogger<T extends Event>(
    loggerId: string
  , event: T
  , listener: (...args: EventToArgs[T]) => void
  ): () => void {
    if (!this.loggerIdToEmitter.has(loggerId)) {
      this.loggerIdToEmitter.set(loggerId, new Emitter())
    }

    const emitter = this.loggerIdToEmitter.get(loggerId)!
    return emitter.on(event, listener)
  }

  onceLogger<T extends Event>(
    loggerId: string
  , event: T
  , listener: (...args: EventToArgs[T]) => void
  ) {
    if (!this.loggerIdToEmitter.has(loggerId)) {
      this.loggerIdToEmitter.set(loggerId, new Emitter())
    }

    const emitter = this.loggerIdToEmitter.get(loggerId)!
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
  , ...args: EventToArgs[T]
  ): void {
    this.loggerIdToEmitter.get(loggerId)?.emit(event, ...args)

    const globalArgs = [loggerId, ...args] as GlobalEventToArgs[T]
    this.globalEmitter.emit(event, ...globalArgs)
  }
}

export const eventHub = new EventHub()
