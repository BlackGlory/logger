import { closeDatabase, openDatabase, prepareDatabase } from '@src/database.js'
import { resetCache } from '@env/cache.js'
import { buildServer } from '@src/server.js'
import { startMaintainer } from '@src/maintainer.js'
import { UnpackedPromise } from 'hotypes'

let server: UnpackedPromise<ReturnType<typeof buildServer>>
let stopMaintainer: ReturnType<typeof startMaintainer> | undefined
let address: string

export function getAddress(): string {
  return address
}

export async function startService(
  { maintainer = true }: { maintainer?: boolean } = {}
): Promise<void> {
  await initializeDatabases()
  if (maintainer) stopMaintainer = startMaintainer()
  server = await buildServer()
  address = await server.listen()
}

export async function stopService(): Promise<void> {
  await server.close()
  stopMaintainer?.()
  clearDatabases()
  resetEnvironment()
}

export async function initializeDatabases(): Promise<void> {
  openDatabase()
  await prepareDatabase()
}

export function clearDatabases(): void {
  closeDatabase()
}

export function resetEnvironment(): void {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // see also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.LOGGER_DATA

  // reset memoize
  resetCache()
}
