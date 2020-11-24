--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将DATETIME转换为NUMERIC, 使用这些数据类型是出于可读性考虑
-- logger资源本身是松散的, 没有自己的表

CREATE TABLE logger_log (
  logger_id VARCHAR(255) NOT NULL
, timestamp DATETIME     NOT NULL
, number    INTEGER      NOT NULL
, payload   TEXT         NOT NULL
, PRIMARY KEY (logger_id, timestamp, number)
);

CREATE TABLE logger_counter (
  logger_id VARCHAR(255) PRIMARY KEY
, timestamp DATETIME     NOT NULL
, count     INTEGER      NOT NULL
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

PRAGMA journal_mode = DELETE;

DROP TABLE logger_log;
DROP TABLE logger_counter;
