interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(id: string): Promise<boolean>
  addBlacklistItem(id: string): Promise<void>
  removeBlacklistItem(id: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(id: string): Promise<boolean>
  addWhitelistItem(id: string): Promise<void>
  removeWhitelistItem(id: string): Promise<void>
}

interface IJsonSchemaDAO {
  getAllIdsWithJsonSchema(): Promise<string[]>
  getJsonSchema(id: string): Promise<string | null>
  setJsonSchema(props: { id: string; schema: string }): Promise<void>
  removeJsonSchema(id: string): Promise<void>
}

interface ITokenBasedAccessControlDAO {
  getAllIdsWithTokens(): Promise<string[]>
  getAllTokens(id: string): Promise<Array<{
    token: string
    log: boolean
    follow: boolean
  }>>

  hasLogTokens(id: string): Promise<boolean>
  matchLogToken(props: { token: string; id: string }): Promise<boolean>
  setLogToken(props: { token: string; id: string }): Promise<void>
  unsetLogToken(props: { token: string; id: string }): Promise<void>

  hasFollowTokens(id: string): Promise<boolean>
  matchFollowToken(props: { token: string; id: string }): Promise<boolean>
  setFollowToken(props: { token: string; id: string }): Promise<void>
  unsetFollowToken(props: { token: string; id: string }): Promise<void>
}

interface IDataAccessObject extends IBlacklistDAO
                                  , IWhitelistDAO
                                  , IJsonSchemaDAO
                                  , ITokenBasedAccessControlDAO {}
