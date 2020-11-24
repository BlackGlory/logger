--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- logger资源本身是松散的, 没有自己的表

CREATE TABLE logger_blacklist (
  logger_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE logger_whitelist (
  logger_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE logger_token_policy (
  logger_id             VARCHAR(255) NOT NULL UNIQUE
, write_token_required  BOOLEAN
, read_token_required   BOOLEAN
, delete_token_required BOOLEAN
);

CREATE TABLE logger_token (
  logger_id         VARCHAR(255) NOT NULL
, token             VARCHAR(255) NOT NULL
, read_permission   BOOLEAN      NOT NULL DEFAULT 0 CHECK(read_permission IN (0,1))
, write_permission  BOOLEAN      NOT NULL DEFAULT 0 CHECK(write_permission IN (0,1))
, delete_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(delete_permission IN (0,1))
, UNIQUE (token, logger_id)
);

CREATE TABLE logger_json_schema (
  logger_id   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE logger_purge_policy (
  logger_id    VARCHAR(255) NOT NULL UNIQUE
, time_to_live INTEGER
, number_limit INTEGER
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE logger_blacklist;
DROP TABLE logger_whitelist;
DROP TABLE logger_token_policy;
DROP TABLE logger_token;
DROP TABLE logger_json_schema;
DROP TABLE logger_purge_policy;
