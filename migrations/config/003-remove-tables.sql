--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

DROP TABLE logger_blacklist;
DROP TABLE logger_whitelist;
DROP TABLE logger_token_policy;
DROP TABLE logger_token;
DROP TABLE logger_json_schema;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

CREATE TABLE logger_blacklist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE logger_whitelist (
  namespace VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE logger_token_policy (
  namespace             VARCHAR(255) NOT NULL UNIQUE
, write_token_required  BOOLEAN
, read_token_required   BOOLEAN
, delete_token_required BOOLEAN
);

CREATE TABLE logger_token (
  namespace         VARCHAR(255) NOT NULL
, token             VARCHAR(255) NOT NULL
, read_permission   BOOLEAN      NOT NULL DEFAULT 0 CHECK(read_permission IN (0,1))
, write_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, delete_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(delete_permission IN (0,1))
, UNIQUE (token, namespace)
);

CREATE TABLE logger_json_schema (
  namespace   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);
