export interface IPurgePolicyDAO {
  getAllNamespacesWithPurgePolicies(): string[]
  getPurgePolicies(namespace: string): {
    timeToLive: number | null
    numberLimit: number | null
  }
  setTimeToLive(namespace: string, timeToLive: number): void
  unsetTimeToLive(namespace: string): void
  setNumberLimit(namespace: string, numberLimit: number): void
  unsetNumberLimit(namespace: string): void
}
