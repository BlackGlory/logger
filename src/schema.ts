export const loggerIdSchema = {
  type: 'string'
, pattern: '^.{0,255}$'
}

export const logIdSchema = {
  type: 'string'
, pattern: '^\\d+-\\d+$'
}

export const logIdsSchema = {
  type: 'string'
, pattern: '^\\d+-\\d+(?:,\\d+-\\d+)*$'
}
