import { getDatabase } from '../database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT logger_id
      FROM logger_json_schema
  `).all()

  return result.map(x => x['logger_id'])
}

export function getJsonSchema(id: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema
      FROM logger_json_schema
     WHERE logger_id = $id;
  `).get({ id })

  return result ? result['json_schema'] : null
}

export function setJsonSchema({ id, schema }: { id: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO logger_json_schema (logger_id, json_schema)
    VALUES ($id, $schema)
        ON CONFLICT(logger_id)
        DO UPDATE SET json_schema = $schema;
  `).run({ id, schema })
}

export function removeJsonSchema(id: string): void {
  getDatabase().prepare(`
    DELETE FROM logger_json_schema
     WHERE logger_id = $id;
  `).run({ id })
}
