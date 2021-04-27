type IUnfollow = () => void
type CustomErrorConsturctor = import('@blackglory/errors').CustomErrorConstructor
type Json = import('justypes').Json

interface ILog {
  id: string
  payload: string
}

interface ICore {
  isAdmin(password: string): boolean

  Logger: {
    write(namespace: string, value: string): Promise<void>
    follow(namespace: string, listener: (log: ILog) => void): IUnfollow
    query(namespace: string, range: IRange): AsyncIterable<ILog>
    del(namespace: string, range: IRange): Promise<void>

    getAllNamespaces(): AsyncIterable<string>
  }

  PurgePolicy: {
    purge(namespace: string): Promise<void>

    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<{
      timeToLive: number | null
      limit: number | null
    }>

    setTimeToLive(namespace: string, timeToLive: number): Promise<void>
    unsetTimeToLive(namespace: string): Promise<void>

    setLimit(namespace: string, limit: number): Promise<void>
    unsetLimit(namespace: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConsturctor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(namespace: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(namespace: string): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(namespace: string): Promise<void>

    Forbidden: CustomErrorConsturctor
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllNamespaces(): Promise<string[]>
    get(namespace: string): Promise<string | null>
    set(namespace: string, schema: Json): Promise<void>
    remove(namespace: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(namespace: string, payload: string): Promise<void>

    InvalidPayload: CustomErrorConsturctor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(namespace: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(namespace: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConsturctor

    Token: {
      getAllNamespaces(): Promise<string[]>
      getAll(namespace: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
        delete: boolean
      }>>

      setWriteToken(namespace: string, token: string): Promise<void>
      unsetWriteToken(namespace: string, token: string): Promise<void>

      setReadToken(namespace: string, token: string): Promise<void>
      unsetReadToken(namespace: string, token: string): Promise<void>

      setDeleteToken(namespace: string, token: string): Promise<void>
      unsetDeleteToken(namespace: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllNamespaces(): Promise<string[]>
      get(namespace: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(namespace: string): Promise<void>

      setReadTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetReadTokenRequired(namespace: string): Promise<void>

      setDeleteTokenRequired(namespace: string, val: boolean): Promise<void>
      unsetDeleteTokenRequired(namespace: string): Promise<void>
    }
  }
}
