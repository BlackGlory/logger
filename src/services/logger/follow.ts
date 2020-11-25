import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import websocket from 'fastify-websocket'
import { waitForEventEmitter } from '@blackglory/wait-for'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.register(websocket, {
    options: {
      // pain, see https://github.com/fastify/fastify-websocket/issues/70
      async verifyClient(info, next) {
        const url = info.req.url!
        const pathnameRegExp = /^\/logger\/(?<id>[a-zA-Z0-9\.\-_]{1,256})$/
        const result = getPathname(url).match(pathnameRegExp)
        if (!result) return next(false)

        const id = result.groups!.id
        const token = parseQuerystring<{ token?: string }>(url).token

        try {
          await Core.Blacklist.check(id)
          await Core.Whitelist.check(id)
          await Core.TBAC.checkReadPermission(id, token)
        } catch {
          return next(false)
        }
        return next(true)
      }
    }
  })

  server.route<{
    Params: { id: string }
    Querystring: { token?: string; since?: string }
    Headers: { 'Last-Event-ID'?: string }
  }>({
    method: 'GET'
  , url: '/logger/:id'
  , schema: {
      params: { id: idSchema }
    , querystring: { token: tokenSchema, since: idSchema }
    , headers: { 'Last-Event-ID': idSchema }
    }
  // Server-Sent Events
  , handler(req, reply) {
      ;(async () => {
        const id = req.params.id
        const token = req.query.token
        const lastEventId = req.headers['Last-Event-ID']

        try {
          await Core.Blacklist.check(id)
          await Core.Whitelist.check(id)
          await Core.TBAC.checkReadPermission(id, token)
        } catch (e) {
          if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
          if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
          if (e instanceof Error) return reply.status(400).send(e.message)
          throw e
        }

        reply.raw.setHeader('Content-Type','text/event-stream')
        reply.raw.setHeader('Connection', 'keep-alive')
        reply.raw.setHeader('Cache-Control', 'no-store')
        if (req.headers.origin) {
          reply.raw.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        }
        reply.raw.flushHeaders()

        const unfollow = Core.Logger.follow(id, async log => {
          const data = JSON.stringify(log)
          for (const message of generateSSEData(data)) {
            if (!reply.raw.write(message)) {
              await waitForEventEmitter(reply.raw, 'drain')
            }
          }
        })
        req.raw.on('close', () => unfollow())

        const since = lastEventId ?? req.query.since
        if (since) {
          const logs = await Core.Logger.query(id, { from: since })
          for await (const log of logs) {
            if (log.id === req.query.since) continue
            const data = JSON.stringify(log)
            for (const message of generateSSEData(data)) {
              if (!reply.raw.write(message)) {
                await waitForEventEmitter(reply.raw, 'drain')
              }
            }
          }
        }
      })()
    }
  // WebSocket
  // @ts-ignore Do not want to waste time to fight the terrible types of fastify.
  , async wsHandler(conn, req, params: Params) {
      // conn: WebSocketStream https://github.com/websockets/ws/blob/master/doc/ws.md#websocketcreatewebsocketstreamwebsocket-options
      // conn.socket: WebSocket.Server https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocketserver
      const id = params.id

      const unfollow = Core.Logger.follow(id, log => {
        const data = JSON.stringify(log)
        conn.socket.send(data)
      })
      conn.socket.on('close', () => unfollow())
      conn.socket.on('message', () => conn.socket.close())

      const since = parseQuerystring<{ since?: string }>(req.url!).since
      if (since) {
        const logs = await Core.Logger.query(id, { from: since })
        for await (const log of logs) {
          if (log.id === since) continue
          const data = JSON.stringify(log)
          if (!conn.write(data)) await waitForEventEmitter(conn, 'drain')
        }
      }
    }
  })
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

function lastIndex(arr: Array<unknown>): number {
  return arr.length - 1
}

function* generateSSEData(text: string): Iterable<string> {
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (i === lastIndex(lines)) {
      yield `data: ${line}\n\n`
    } else {
      yield `data: ${line}\n`
    }
  }
}
