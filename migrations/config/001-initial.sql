--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将BOOLEAN转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- logger资源本身是松散的, 没有自己的表

CREATE TABLE logger_json_schema (
  logger_id   VARCHAR(255) NOT NULL UNIQUE
, json_schema TEXT         NOT NULL
);

CREATE TABLE logger_blacklist (
  logger_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE logger_whitelist (
  logger_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE logger_tbac (
  token             VARCHAR(255) NOT NULL
, logger_id         VARCHAR(255) NOT NULL
, follow_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(follow_permission IN (0,1))
, log_permission    BOOLEAN      NOT NULL DEFAULT 0 CHECK(log_permission IN (0,1))
, delete_permission BOOLEAN      NOT NULL DEFAULT 0 CHECK(delete_permission IN (0,1))
, UNIQUE (token, logger_id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE logger_json_schema;
DROP TABLE logger_blacklist;
DROP TABLE logger_whitelist;
DROP TABLE logger_tbac;
