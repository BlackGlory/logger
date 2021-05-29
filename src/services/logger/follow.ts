import * as http from 'http'
import * as net from 'net'
import { go } from '@blackglory/go'
import { FastifyPluginAsync } from 'fastify'
import { namespaceSchema, tokenSchema } from '@src/schema'
import { waitForEventEmitter } from '@blackglory/wait-for'
import { sse } from 'extra-generator'
import { SSE_HEARTBEAT_INTERVAL, WS_HEARTBEAT_INTERVAL } from '@env'
import { setDynamicTimeoutLoop } from 'extra-timers'
import WebSocket from 'ws'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  const wss = new WebSocket.Server({ noServer: true })

  // WebSocket handler
  wss.on('connection', async (
    ws: WebSocket
  , req: http.IncomingMessage
  , params: { namespace: string }
  ) => {
    const namespace = params.namespace

    const unfollow = Core.Logger.follow(namespace, log => {
      const data = JSON.stringify(log)
      ws.send(data)
    })

    let cancelHeartbeatTimer: (() => void) | null = null
    if (WS_HEARTBEAT_INTERVAL() > 0) {
      cancelHeartbeatTimer = setDynamicTimeoutLoop(WS_HEARTBEAT_INTERVAL(), () => {
        ws.ping()
      })
    }

    ws.on('close', () => {
      if (cancelHeartbeatTimer) cancelHeartbeatTimer()
      unfollow()
    })
    ws.on('message', message => {
      if (message.toString() !== '') ws.close()
    })

    const since = parseQuerystring<{ since?: string }>(req.url!).since
    if (since) {
      const logs = await Core.Logger.query(namespace, { from: since })
      for await (const log of logs) {
        if (log.id === since) continue
        const data = JSON.stringify(log)
        ws.send(data)
      }
    }
  })

  // WebSocket upgrade handler
  server.server.on('upgrade', async (
    req: http.IncomingMessage
  , socket: net.Socket
  , head: Buffer
  ) => {
    const url = req.url!
    const pathnameRegExp = /^\/logger\/(?<namespace>[a-zA-Z0-9\.\-_]{1,256})$/
    const result = getPathname(url).match(pathnameRegExp)
    if (!result) {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
      return socket.destroy()
    }

    const namespace = result.groups!.namespace
    const token = parseQuerystring<{ token?: string }>(url).token

    try {
      await Core.Blacklist.check(namespace)
      await Core.Whitelist.check(namespace)
      await Core.TBAC.checkReadPermission(namespace, token)
    } catch (e) {
      if (e instanceof Core.Blacklist.Forbidden) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      }
      if (e instanceof Core.Whitelist.Forbidden) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n')
      }
      if (e instanceof Core.TBAC.Unauthorized) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
      }
      return socket.destroy()
    }

    wss.handleUpgrade(req, socket, head, async ws => {
      wss.emit('connection', ws, req, { namespace })

      // QUESTION: why stream?
      const connection = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' })
      ws.on('newListener', event => {
        if (event === 'message') connection.resume()
      })

      const GOING_AWAY = 1001
      // QUESTION: why close?
      ws.close(GOING_AWAY)
    })
  })

  server.get<{
    Params: { namespace: string }
    Querystring: { token?: string; since?: string }
    Headers: { 'Last-Event-ID'?: string }
  }>(
    '/logger/:namespace'
  , {
      schema: {
        params: { namespace: namespaceSchema }
      , querystring: { token: tokenSchema, since: namespaceSchema }
      , headers: { 'Last-Event-ID': namespaceSchema }
      }
    }
  // Server-Sent Events handler
  , (req, reply) => {
      go(async () => {
        const namespace = req.params.namespace
        const token = req.query.token
        const lastEventId = req.headers['Last-Event-ID']

        try {
          await Core.Blacklist.check(namespace)
          await Core.Whitelist.check(namespace)
          await Core.TBAC.checkReadPermission(namespace, token)
        } catch (e) {
          if (e instanceof Core.Blacklist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.Whitelist.Forbidden) return reply.status(403).send()
          if (e instanceof Core.TBAC.Unauthorized) return reply.status(401).send()
          throw e
        }

        reply.raw.setHeader('Content-Type','text/event-stream')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Cache-Control', 'no-store')
        if (req.headers.origin) {
          reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        }
        reply.raw.flushHeaders()

        const unfollow = Core.Logger.follow(namespace, async log => {
          const data = JSON.stringify(log)
          for (const line of sse({ id: log.id, data })) {
            if (!reply.raw.write(line)) {
              await waitForEventEmitter(reply.raw, 'drain')
            }
          }
        })

        let cancelHeartbeatTimer: (() => void) | null = null
        const heartbeatInterval = SSE_HEARTBEAT_INTERVAL()
        if (heartbeatInterval > 0) {
          cancelHeartbeatTimer = setDynamicTimeoutLoop(heartbeatInterval, async () => {
            for (const line of sse({ event: 'heartbeat', data: '' })) {
              if (!reply.raw.write(line)) {
                await waitForEventEmitter(reply.raw, 'drain')
              }
            }
          })
        }
        req.raw.on('close', () => {
          if (cancelHeartbeatTimer) cancelHeartbeatTimer()
          unfollow()
        })

        const since = lastEventId ?? req.query.since
        if (since) {
          const logs = await Core.Logger.query(namespace, { from: since })
          for await (const log of logs) {
            if (log.id === req.query.since) continue
            const data = JSON.stringify(log)
            for (const line of sse({ data })) {
              if (!reply.raw.write(line)) {
                await waitForEventEmitter(reply.raw, 'drain')
              }
            }
          }
        }
      })
    }
  )
}

function getPathname(url: string): string {
  const urlObject = new URL(url, 'http://localhost/')
  return urlObject.pathname
}

function parseQuerystring<T extends NodeJS.Dict<string | string[]>>(url: string): T {
  const urlObject = new URL(url, 'http://localhost/')
  const result = Object.fromEntries(urlObject.searchParams.entries()) as T
  return result
}
