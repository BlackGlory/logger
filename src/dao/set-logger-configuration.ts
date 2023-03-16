import { getDatabase } from '@src/database.js'
import { withLazyStatic, lazyStatic } from 'extra-lazy'
import { ILoggerConfiguration } from '@src/contract.js'

export const setLoggerConfiguration = withLazyStatic((
  id: string
, config: ILoggerConfiguration
): void => {
  lazyStatic(() => getDatabase().prepare(`
    INSERT INTO logger (id, time_to_live, quantity_limit)
    VALUES ($id, $timeToLive, $quantityLimit)
        ON CONFLICT(id)
        DO UPDATE SET time_to_live = $timeToLive
                    , quantity_limit = $quantityLimit;
  `), [getDatabase()])
    .run({
      id
    , timeToLive: config.timeToLive
    , quantityLimit: config.limit
    })
})
