--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE logger_log
RENAME COLUMN logger_id TO namespace;

ALTER TABLE logger_counter
RENAME COLUMN logger_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE logger_log
RENAME COLUMN namespace TO logger_id;

ALTER TABLE logger_counter
RENAME COLUMN namespace TO logger_id;
