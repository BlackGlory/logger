--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE logger_blacklist
RENAME COLUMN logger_id TO namespace;

ALTER TABLE logger_whitelist
RENAME COLUMN logger_id TO namespace;

ALTER TABLE logger_token_policy
RENAME COLUMN logger_id TO namespace;

ALTER TABLE logger_token
RENAME COLUMN logger_id TO namespace;

ALTER TABLE logger_json_schema
RENAME COLUMN logger_id TO namespace;

ALTER TABLE logger_purge_policy
RENAME COLUMN logger_id TO namespace;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE logger_blacklist
RENAME COLUMN namespace TO logger_id;

ALTER TABLE logger_whitelist
RENAME COLUMN namespace TO logger_id;

ALTER TABLE logger_token_policy
RENAME COLUMN namespace TO logger_id;

ALTER TABLE logger_token
RENAME COLUMN namespace TO logger_id;

ALTER TABLE logger_json_schema
RENAME COLUMN namespace TO logger_id;

ALTER TABLE logger_purge_policy
RENAME COLUMN namespace TO logger_id;
