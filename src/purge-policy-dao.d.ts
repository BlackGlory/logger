interface IPurgePolicyDAO {
  getAllNamespacesWithPurgePolicies(): Promise<string[]>
  getPurgePolicies(namespace: string): Promise<{
    timeToLive: number | null
    numberLimit: number | null
  }>
  setTimeToLive(namespace: string, timeToLive: number): Promise<void>
  unsetTimeToLive(namespace: string): Promise<void>
  setNumberLimit(namespace: string, numberLimit: number): Promise<void>
  unsetNumberLimit(namespace: string): Promise<void>
}
