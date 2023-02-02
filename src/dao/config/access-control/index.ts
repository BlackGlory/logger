import * as Blacklist from './blacklist.js'
import * as Whitelist from './whitelist.js'
import * as Token from './token.js'
import * as TokenPolicy from './token-policy.js'
import { IAccessControlDAO, IBlacklistDAO, ITokenDAO, ITokenPolicyDAO, IWhitelistDAO } from './contract.js'

const BlacklistDAO: IBlacklistDAO = Blacklist
const WhitelistDAO: IWhitelistDAO = Whitelist
const TokenDAO: ITokenDAO = Token
const TokenPolicyDAO: ITokenPolicyDAO = TokenPolicy

export const AccessControlDAO: IAccessControlDAO = {
  Blacklist: BlacklistDAO
, Whitelist: WhitelistDAO
, Token: TokenDAO
, TokenPolicy: TokenPolicyDAO
}
