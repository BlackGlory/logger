import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import * as TokenBasedAccessControl from './token-based-access-control'

const BlacklistDAO: IBlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: IWhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const JsonSchemaDAO: IJsonSchemaDAO = {
  getAllIdsWithJsonSchema: asyncify(JsonSchema.getAllIdsWithJsonSchema)
, getJsonSchema: asyncify(JsonSchema.getJsonSchema)
, removeJsonSchema: asyncify(JsonSchema.removeJsonSchema)
, setJsonSchema: asyncify(JsonSchema.setJsonSchema)
}

const TokenBasedAccessControlDAO: ITokenBasedAccessControlDAO = {
  getAllIdsWithTokens: asyncify(TokenBasedAccessControl.getAllIdsWithTokens)
, getAllTokens: asyncify(TokenBasedAccessControl.getAllTokens)

, hasLogTokens: asyncify(TokenBasedAccessControl.hasLogTokens)
, matchLogToken: asyncify(TokenBasedAccessControl.matchLogToken)
, setLogToken: asyncify(TokenBasedAccessControl.setLogToken)
, unsetLogToken: asyncify(TokenBasedAccessControl.unsetLogToken)

, hasFollowTokens: asyncify(TokenBasedAccessControl.hasFollowTokens)
, matchFollowToken: asyncify(TokenBasedAccessControl.matchFollowToken)
, setFollowToken: asyncify(TokenBasedAccessControl.setFollowToken)
, unsetFollowToken: asyncify(TokenBasedAccessControl.unsetFollowToken)

, matchDeleteToken: asyncify(TokenBasedAccessControl.matchDeleteToken)
, setDeleteToken: asyncify(TokenBasedAccessControl.setDeleteToken)
, unsetDeleteToken: asyncify(TokenBasedAccessControl.unsetDeleteToken)
}

export const DAO: IDataAccessObject = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...JsonSchemaDAO
, ...TokenBasedAccessControlDAO
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
