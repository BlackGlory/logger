export interface IJSONSchemaDAO {
  getAllNamespacesWithJSONSchema(): string[]
  getJSONSchema(id: string): string | null
  setJSONSchema(props: {
    namespace: string
    schema: string
  }): void
  removeJSONSchema(id: string): void
}
