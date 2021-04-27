interface IJsonSchemaDAO {
  getAllNamespacesWithJsonSchema(): Promise<string[]>
  getJsonSchema(id: string): Promise<string | null>
  setJsonSchema(props: { namespace: string; schema: string }): Promise<void>
  removeJsonSchema(id: string): Promise<void>
}
