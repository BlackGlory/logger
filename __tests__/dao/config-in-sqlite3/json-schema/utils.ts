import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  logger_id: string
  json_schema: string
}

export function setRawJsonSchema(item: IRawJsonSchema): IRawJsonSchema {
  getDatabase().prepare(`
    INSERT INTO logger_json_schema (logger_id, json_schema)
    VALUES ($logger_id, $json_schema);
  `).run(item)

  return item
}

export function hasRawJsonSchema(id: string): boolean {
  return !!getRawJsonSchema(id)
}

export function getRawJsonSchema(id: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM logger_json_schema
     WHERE logger_id = $id;
  `).get({ id })
}
