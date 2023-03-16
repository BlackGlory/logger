import { FastifyPluginAsync } from 'fastify'
import { loggerIdSchema, logIdSchema } from '@src/schema.js'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { sse } from 'extra-generator'
import { SSE_HEARTBEAT_INTERVAL } from '@env/index.js'
import { setDynamicTimeoutLoop } from 'extra-timers'
import { IAPI, Order, LogId, LoggerNotFound } from '@src/contract.js'
import { go } from '@blackglory/prelude'
import { SyncDestructor } from 'extra-defer'

export const routes: FastifyPluginAsync<{ API: IAPI }> = async (server, { API }) => {
  server.get<{
    Params: { id: string }
    Querystring: { since?: LogId }
    Headers: { 'last-event-id'?: LogId }
  }>(
    '/loggers/:id/follow'
  , {
      schema: {
        params: { id: loggerIdSchema }
      , querystring: { since: logIdSchema }
      , headers: { 'last-event-id': logIdSchema }
      }
    }
    // Server-Sent Events handler
  , async (req, reply) => {
      const loggerId = req.params.id
      const lastEventId = req.headers['last-event-id'] ?? req.query.since

      const destructor = new SyncDestructor()
      let isConnectionClosed = false
      req.raw.on('close', () => {
        isConnectionClosed = true

        destructor.execute()
      })

      reply.raw.setHeader('Content-Type','text/event-stream')
      reply.raw.setHeader('Connection', 'keep-alive')
      reply.raw.setHeader('Cache-Control', 'no-store')
      if (req.headers.origin) {
        reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      }

      if (API.getLogger(loggerId)) {
        reply.raw.flushHeaders()
      } else {
        reply.statusCode = 404
        reply.raw.end()
        return
      }

      const cancelHeartbeatTimer: (() => void) | undefined = go(() => {
        const heartbeatInterval = SSE_HEARTBEAT_INTERVAL()
        if (heartbeatInterval > 0) {
          return setDynamicTimeoutLoop(heartbeatInterval, async () => {
            for (const line of sse({ event: 'heartbeat', data: '' })) {
              if (isConnectionClosed) {
                break
              }

              if (!reply.raw.write(line)) {
                await waitForEventEmitter(reply.raw, 'drain')
              }
            }
          })
        }
      })
      if (cancelHeartbeatTimer) {
        destructor.defer(cancelHeartbeatTimer)
      }

      if (lastEventId) {
        let lastLogId = lastEventId
        while (!isConnectionClosed) {
          const logs = API
            .queryLogs(loggerId, {
              order: Order.Asc
            , from: lastLogId
            })
            ?.filter(x => x.id !== lastLogId)

          if (logs) {
            if (logs.length) {
              for (const log of logs) {
                const data = JSON.stringify(log)
                for (const line of sse({ id: log.id, data })) {
                  if (!reply.raw.write(line)) {
                    await waitForEventEmitter(reply.raw, 'drain')
                  }
                }
              }

              lastLogId = logs[logs.length - 1].id
            } else {
              break
            }
          } else {
            reply.raw.end()
            return
          }
        }
      }

      if (isConnectionClosed) return

      try {
        const subscription = API
          .follow(loggerId)
          .subscribe({
            async next(log) {
              const data = JSON.stringify(log)
              for (const line of sse({ id: log.id, data })) {
                if (!reply.raw.write(line)) {
                  await waitForEventEmitter(reply.raw, 'drain')
                }
              }
            }
          , complete() {
              destructor.execute()
              reply.raw.end()
            }
          })
        destructor.defer(() => subscription.unsubscribe())
      } catch (e) {
        if (e instanceof LoggerNotFound) {
          reply.raw.end()
          return
        }

        throw e
      }
    }
  )
}
