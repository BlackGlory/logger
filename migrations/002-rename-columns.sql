--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

ALTER TABLE log
RENAME COLUMN payload TO value;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

ALTER TABLE log
RENAME COLUMN value TO payload;
