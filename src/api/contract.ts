import { CustomErrorConstructor } from '@blackglory/errors'
import { JSONValue } from 'justypes'

type IUnfollow = () => void

export interface ISlice {
  from?: string
  to?: string
}

export interface ITail {
  tail: number
}

export interface IHead {
  head: number
}

export type IRange =
| ISlice
| (ISlice & IHead)
| (ISlice & ITail)

export interface ILog {
  id: string
  payload: string
}

export interface IAPI {
  isAdmin(password: string): boolean

  Logger: {
    write(namespace: string, value: string): void
    follow(namespace: string, listener: (log: ILog) => void): IUnfollow
    query(namespace: string, range: IRange): Iterable<ILog>
    del(namespace: string, range: IRange): void

    getAllNamespaces(): Iterable<string>
  }

  PurgePolicy: {
    purge(namespace: string): void

    getAllNamespaces(): string[]
    get(namespace: string): {
      timeToLive: number | null
      limit: number | null
    }

    setTimeToLive(namespace: string, timeToLive: number): void
    unsetTimeToLive(namespace: string): void

    setLimit(namespace: string, limit: number): void
    unsetLimit(namespace: string): void
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): boolean
    getAll(): string[]
    add(namespace: string): void
    remove(namespace: string): void

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): void

    Forbidden: CustomErrorConstructor
  }

  JSONSchema: {
    isEnabled(): boolean
    getAllNamespaces(): string[]
    get(namespace: string): string | null
    set(namespace: string, schema: JSONValue): void
    remove(namespace: string): void

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: string): void

    InvalidPayload: CustomErrorConstructor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(namespace: string, token?: string): void

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(namespace: string, token?: string): void

    Unauthorized: CustomErrorConstructor

    Token: {
      getAllNamespaces(): string[]
      getAll(namespace: string): Array<{
        token: string
        write: boolean
        read: boolean
        delete: boolean
      }>

      setWriteToken(namespace: string, token: string): void
      unsetWriteToken(namespace: string, token: string): void

      setReadToken(namespace: string, token: string): void
      unsetReadToken(namespace: string, token: string): void

      setDeleteToken(namespace: string, token: string): void
      unsetDeleteToken(namespace: string, token: string): void
    }

    TokenPolicy: {
      getAllNamespaces(): string[]
      get(namespace: string): {
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }

      setWriteTokenRequired(namespace: string, val: boolean): void
      unsetWriteTokenRequired(namespace: string): void

      setReadTokenRequired(namespace: string, val: boolean): void
      unsetReadTokenRequired(namespace: string): void

      setDeleteTokenRequired(namespace: string, val: boolean): void
      unsetDeleteTokenRequired(namespace: string): void
    }
  }
}
