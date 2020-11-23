interface IPurgePolicyDAO {
  getAllIdsWithPurgePolicies(): Promise<string[]>
  getPurgePolicies(id: string): Promise<{
    timeToLive: number | null
    numberLimit: number | null
  }>
  setTimeToLive(id: string, timeToLive: number): Promise<void>
  unsetTimeToLive(id: string): Promise<void>
  setNumberLimit(id: string, numberLimit: number): Promise<void>
  unsetNumberLimit(id: string): Promise<void>
}
