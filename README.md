# Logger
提供以HTTP为通讯协议的日志服务.

## Install
### 从源代码运行
```sh
git clone https://github.com/BlackGlory/logger
cd log
yarn install
yarn build
yarn bundle
yarn --silent start
```

### 从源代码构建
```sh
git clone https://github.com/BlackGlory/logger
cd logger
yarn install
yarn docker:build
```

### Recipes
#### docker-compose.yml
```yaml
version: '3.8'

services:
  logger:
    image: 'blackglory/logger'
    restart: always
    volumes:
      - 'logger-data:/data'
    ports:
      - '8080:8080'

volumes:
  logger-data:
```

## API
- 记录器id需要满足此正则表达式: `^[a-zA-Z0-9\.\-_]{0,255}$`
- 日志id的格式为`Unix毫秒时间戳-从0开始的计数器`.
  由于日志可以被删除, 因此不应假设计数器的数字是连续的.

### get all logger ids
`GET /loggers`

返回JSON:
```ts
string[]
```

#### Example
##### curl
```sh
curl 'http://localhost:8080/loggers'
```

##### JavaScript
```js
await fetch('http://localhost:8080/loggers')
  .then(res => res.json())
```

### get logger
`GET /loggers/<id>`

获取记录器的信息.

如果记录器未启用, 返回HTTP状态码404.

返回JSON:
```ts
{
  timeToLive: number | null // null表示Infinity
  limit: number | null // null表示Infinity
}
```

#### Example
##### curl
```sh
curl "http://localhost:8080/loggers/$id"
```

##### fetch
```js
await fetch(`http://localhost:8080/loggers${id}`)
  .then(res => res.json())
```

### set logger
`PUT /loggers/<id>`

配置记录器.
如果记录器曾经被配置过, 则会应用新的设置, 记录器内的日志清理会立即发生.

发送JSON:
```ts
{
  // 一条日志自写入起开始计算的存活时间(毫秒).
  // null表示Infinity
  timeToLive: number | null

  // 记录器的日志数量限制, 当日志数量超出此值时, 较早的日志会被删除.
  // null表示Infinity, 配置为0通常没有意义
  limit: number | null
}
```

#### Example
##### curl
```sh
curl \
  --request PUT \
  --header "Content-Type: application/json" \
  --data "$payload" \
  "http://localhost:8080/loggers/$id"
```

##### fetch
```js
await fetch(`http://localhost:8080/loggers/${id}`, {
  method: 'PUT'
, headers: {
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(config)
})
```

### remove logger
`DELETE /loggers/<id>`

#### Example
##### curl
```sh
curl \
  --request DELETE \
  "http://localhost:8080/loggers/$id"
```

##### fetch
```js
await fetch(`http://localhost:8080/loggers/${id}`, {
  method: 'DELETE'
})
```

### log
`POST /loggers/<id>/log`

往特定记录器写入一条日志.

发送JSON:
```ts
JSONValue
```

#### Example
##### curl
```sh
curl \
  --request POST \
  --header "Content-Type: application/json" \
  --data "$payload" \
  "http://localhost:8080/loggers/$id/log"
```

##### JavaScript
```js
await fetch(`http://localhost:8080/loggers/${id}/log`, {
  method: 'POST'
, headers: {
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(content)
})
```

### follow
`GET /loggers/<id>/follow`

通过Server-Sent Events(SSE)订阅特定记录器.
如果记录器不存在, 服务器会返回404, `EventSource`会因此放弃重新连接.
如果记录器被删除, 服务器会结束响应, 然后`EventSource`会尝试重新连接一次,
由于这次重新连接会得到404, `EventSource`会因此放弃重新连接.

可用以下两种方式从从特定logId开始接收日志, 客户端总是可以捏造不存在的logId:
- SSE的请求头`Last-Event-Id`.
- URL参数`since=<logId>`.
  此方法存在是因为大部分`EventSource`无法自定义请求头`Last-Event-Id`.
  `since`参数的优先级低于`Last-Event-Id`.

日志的顺序受到强制保证, 若在接收完旧日志前就有新日志被写入, 则新日志会阻塞直至旧日志都传输结束.

收到的每条JSON:
```ts
{
  id: string
  value: JSONValue
}
```

#### Example
##### sse-cat
```sh
sse-cat "http://localhost:8080/loggers/$id/follow"
```

##### JavaScript
```js
const es = new EventSource(`http://localhost:8080/loggers/${id}`)
es.addEventListener('message', event => {
  const paylaod = event.data
  const log = JSON.parse(payload)
  console.log(log)
})
```

### get logs
`GET /loggers/<id>/logs/<logIds>`

多个logId用`,`隔开.
如果log不存在, 则对应位置会以`null`表示.

返回JSON:
```ts
Array<JSONValue | null>
```

#### Example
##### curl
```sh
curl "http://localhost:8080/loggers/$id/logs/$logIds"
```

##### JavaScript
```js
await fetch(`http://localhost:8080/loggers/${id}/logs/${logIds}`)
```

### delete logs
`DELETE /loggers/<id>/logs/<logIds>`

多个logId用`,`隔开.

#### Example
##### curl
```sh
curl \
  --request DELETE \
  "http://localhost:8080/loggers/$id/logs/$logIds"
```

##### JavaScript
```js
await fetch(`http://localhost:8080/loggers/${id}/logs/${logIds}`, {
  method: 'DELETE'
})
```

### query logs
`GET /loggers/<id>/logs`

按范围查询日志.
参数允许捏造不存在的`logId`.

参数:
- `order=<asc|desc>`: 必选, 排序方式, 返回结果的顺序也会受到影响.
- `from=<logId>`: 可选, 设定范围的起始点, 省略时指代最早的logId.
  `from`的logId需要小于或等于`to`的logId.
- `to=<logId>`: 可选, 设定范围的结束点, 省略时指代最晚的logId.
  `to`的logId需要大于或等于`from`的logId.
- `skip=<number>`: 可选, 跳过number个日志, 省略时意为`0`.
- `limit=<number>`: 可选, 限制返回结果的数量为number个, 省略时意为不限制.

返回JSON:
```ts
Array<{
  id: string
  value: string
}>
```

#### Example
##### curl
```sh
curl "http://localhost:8080/loggers/$id/logs?order=asc"
```

##### JavaScript
```js
await fetch(`http://localhost:8080/loggers/${id}/logs?order=asc`)
  .then(res => res.json())
```

### clear logs
`DELETE /loggers/<id>/logs`

按范围查询日志.
参数允许捏造不存在的`logId`.

参数:
- `order=<asc|desc>`: 当提供其他参数时必选, 排序方式.
- `from=<logId>`: 可选, 设定范围的起始点, 省略时指代最早的logId.
  `from`的logId需要小于或等于`to`的logId.
- `to=<logId>`: 可选, 设定范围的结束点, 省略时指代最晚的logId.
  `to`的logId需要大于或等于`from`的logId.
- `skip=<number>`: 可选, 跳过number个日志, 省略时意为`0`.
- `limit=<number>`: 可选, 限制返回结果的数量为number个, 省略时意为不限制.

#### Example
##### curl
```sh
curl \
  --request DELETE \
  "http://localhost:8080/loggers/$id/logs"
```

##### JavaScript
```js
await fetch(`http://localhost:8080/loggers/${id}/logs`, {
  method: 'DELETE'
})
```

## 环境变量
### `LOGGER_HOST`, `LOGGER_PORT`
通过环境变量`LOGGER_HOST`和`LOGGER_PORT`决定服务器监听的地址和端口,
默认值为`localhost`和`8080`.

### heartbeat
#### `LOGGER_SSE_HEARTBEAT_INTERVAL`
通过环境变量`LOGGER_SSE_HEARTBEAT_INTERVAL`可以设置SSE心跳包的发送间隔, 单位为毫秒.
在默认情况下, 服务不会发送SSE心跳包,
半开连接的检测依赖于服务端和客户端的运行平台的TCP Keepalive配置.

当`LOGGER_SSE_HEARTBEAT_INTERVAL`大于零时,
服务会通过SSE的heartbeat事件按指定间隔发送空白数据.
客户端若要实现半开连接检测, 则需要自行根据heartbeat事件设定计时器, 以判断连接是否正常.

## 客户端
- JavaScript/TypeScript(Node.js, Browser): <https://github.com/BlackGlory/logger-js>
