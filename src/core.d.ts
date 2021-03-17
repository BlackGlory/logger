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
    write(key: string, value: string): Promise<void>
    follow(key: string, listener: (log: ILog) => void): IUnfollow
    query(id: string, range: IRange): AsyncIterable<ILog>
    del(id: string, range: IRange): Promise<void>

    getAllLoggerIds(): AsyncIterable<string>
  }

  PurgePolicy: {
    purge(id: string): Promise<void>

    getAllIds(): Promise<string[]>
    get(id: string): Promise<{
      timeToLive: number | null
      limit: number | null
    }>

    setTimeToLive(id: string, timeToLive: number): Promise<void>
    unsetTimeToLive(id: string): Promise<void>

    setLimit(id: string, limit: number): Promise<void>
    unsetLimit(id: string): Promise<void>
  }

  Blacklist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>

    Forbidden: CustomErrorConsturctor
  }

  Whitelist: {
    isEnabled(): boolean
    isBlocked(id: string): Promise<boolean>
    getAll(): Promise<string[]>
    add(id: string): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {Forbidden}
     */
    check(id: string): Promise<void>

    Forbidden: CustomErrorConsturctor
  }

  JsonSchema: {
    isEnabled(): boolean
    getAllIds(): Promise<string[]>
    get(id: string): Promise<string | null>
    set(id: string, schema: Json): Promise<void>
    remove(id: string): Promise<void>

    /**
     * @throws {InvalidPayload}
     */
    validate(id: string, payload: string): Promise<void>

    InvalidPayload: CustomErrorConsturctor
  }

  TBAC: {
    isEnabled(): boolean

    /**
     * @throws {Unauthorized}
     */
    checkWritePermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkReadPermission(id: string, token?: string): Promise<void>

    /**
     * @throws {Unauthorized}
     */
    checkDeletePermission(id: string, token?: string): Promise<void>

    Unauthorized: CustomErrorConsturctor

    Token: {
      getAllIds(): Promise<string[]>
      getAll(id: string): Promise<Array<{
        token: string
        write: boolean
        read: boolean
        delete: boolean
      }>>

      setWriteToken(id: string, token: string): Promise<void>
      unsetWriteToken(id: string, token: string): Promise<void>

      setReadToken(id: string, token: string): Promise<void>
      unsetReadToken(id: string, token: string): Promise<void>

      setDeleteToken(id: string, token: string): Promise<void>
      unsetDeleteToken(id: string, token: string): Promise<void>
    }

    TokenPolicy: {
      getAllIds(): Promise<string[]>
      get(id: string): Promise<{
        writeTokenRequired: boolean | null
        readTokenRequired: boolean | null
      }>

      setWriteTokenRequired(id: string, val: boolean): Promise<void>
      unsetWriteTokenRequired(id: string): Promise<void>

      setReadTokenRequired(id: string, val: boolean): Promise<void>
      unsetReadTokenRequired(id: string): Promise<void>

      setDeleteTokenRequired(id: string, val: boolean): Promise<void>
      unsetDeleteTokenRequired(id: string): Promise<void>
    }
  }
}
