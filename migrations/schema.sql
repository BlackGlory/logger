-- 在WAL模式下, better-sqlite3可充分发挥性能
PRAGMA journal_mode = WAL;

-- SQLite 会将VARCHAR(255)转换为TEXT, 将DATETIME转换为NUMERIC, 使用这些数据类型是出于可读性考虑

CREATE TABLE logger (
  id             VARCHAR(255) NOT NULL UNIQUE
, time_to_live   INTEGER
, quantity_limit INTEGER
);

CREATE TABLE log (
  logger_id VARCHAR(255) NOT NULL
, timestamp DATETIME     NOT NULL
, number    INTEGER      NOT NULL
, value     TEXT         NOT NULL
, PRIMARY KEY (logger_id, timestamp, number)
, FOREIGN KEY (logger_id) REFERENCES logger(id) ON DELETE CASCADE
);

-- 用于查找最后一个日志.
CREATE INDEX idx_log_logger_id_timestamp_number
          ON log(
               logger_id
             , timestamp DESC
             , number    DESC
             );
