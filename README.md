# Logger

一个受[patchbay]启发的Web友好的自托管ad-hoc微服务,
提供基于 HTTP 和 SSE 的日志功能,
带有基于token和名单的访问控制策略,
支持JSON Schema.

日志的写入性能受到所使用的数据库的限制.

所有URL都采用了反射性的CORS, 没有提供针对`Origin`的访问控制策略.

[patchbay]: https://patchbay.pub/

## Quickstart

- sse-cat: <https://github.com/BlackGlory/sse-cat>
- websocat: <https://github.com/vi/websocat>

```sh
# 运行
docker run --detach --log 8080:8080 blackglory/logger

# 打开第一个终端
sse-cat http://localhost:8080/logger/hello-world

# 打开第二个终端
websocat ws://localhost:8080/logger/hello-world

# 打开第三个终端
curl http://localhost:8080/logger/hello-world --data 'hello'
```

## Install & Run

### 从源代码运行

可以使用环境变量`LOGGER_HOST`和`LOGGER_PORT`决定服务器监听的地址和端口, 默认值为localhost和8080.

```sh
git clone https://github.com/BlackGlory/logger
cd log
yarn install
yarn build
yarn --silent start
```

### Docker

```sh
docker run \
  --detach \
  --log 8080:8080 \
  blackglory/logger
```

#### 从源代码构建

```sh
git clone https://github.com/BlackGlory/logger
cd logger
yarn install
yarn docker:build
```

#### Recipes

##### 公开服务器

docker-compose.yml
```yml
version: '3.8'

services:
  logger:
    image: 'blackglory/logger'
    restart: always
    environment:
      - LOGGER_HOST=0.0.0.0
    volumes:
      - 'logger-data:/data'
    ports:
      - '8080:8080'

volumes:
  logger-data:
```

##### 私人服务器

docker-compose.yml
```yml
version: '3.8'

services:
  logger:
    image: 'blackglory/logger'
    restart: always
    environment:
      - LOGGER_HOST=0.0.0.0
      - LOGGER_ADMIN_PASSWORD=password
      - LOGGER_TOKEN_BASED_ACCESS_CONTROL=true
      - LOGGER_DISABLE_NO_TOKENS=true
    volumes:
      - 'logger-data:/data'
    ports:
      - '8080:8080'

volumes:
  logger-data:
```

## Usage

对id的要求: `^[a-zA-Z0-9\.\-_]{1,256}$`
提供基于日志数量或淘汰时间的自动删除机制.
日志的id格式为`Unix秒时间戳-从0开始的计数器`,
使用计数器是为了防止在同一秒添加多条日志出现重复.
同一秒里的计数器数字不会被重用.
由于日志有可能被删除, 因此不应假设计数器的数字是连续的.

### log

`POST /logger/<id>`

往特定记录器记录日志, 所有订阅此记录器的客户端都会收到日志.
id用于标识记录器.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有write权限的token:
`POST /logger/<id>?token=<token>`

#### Example

curl
```sh
curl \
  --data 'message' \
  "http://localhost:8080/logger/$id"
```

JavaScript
```js
fetch(`http://localhost:8080/logger/${id}`, {
  method: 'POST'
, body: 'message'
})
```

### follow via Server-Sent Events(SSE)

`GET /logger/<id>`
`GET /logger/<id>?since=<logId>`

从特定记录器跟随日志.
id用于标识记录器.
可用`since=<logId>`在订阅前先接收特定日志(logId)之后的日志.

接收到的日志格式如下:
```ts
{
  id: string
  payload: string
}
```

SSE的`Last-Event-Id`请求头(值等同于logId)可用于断开后的重新连接(在浏览器里会自动重连),
Logger将按顺序发送自Last-Event-Id之后的所有日志.
需要注意的是, 如果Logger从未发回过日志, 则客户端将无法获得Last-Event-Id, 因此会错过重新连接之前的日志.
如果同时存在`since`和`Last-Event-Id`, 会优先使用`Last-Event-Id`.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有read权限的token:
`/logger/<id>?token=<token>`

#### Example

sse-cat
```sh
sse-cat "http://localhost:8080/logger/$id"
```

JavaScript
```js
const es = new EventSource(`http://localhost:8080/logger/$id`)
es.addEventListener('message', event => {
  console.log(event.data)
})
```

### follow via WebSocket

`WS /logger/<id>`
`WS /logger/<id>?since=<logId>`

从特定记录器跟随日志.
id用于标识记录器.
可用`since=<logId>`在订阅前先接收特定日志(logId)之后的日志.

接收到的日志格式如下:
```ts
{
  id: string
  payload: string
}
```

如果开启基于token的访问控制, 则可能需要在Querystring提供具有read权限的token:
`/logger/<id>?token=<token>`

注: 如果可以通过SSE订阅, 则推荐使用SSE订阅.
SSE在HTTP/2协议下可以多路复用, 而WebSocket会给每个连接单独开启新的连接.
SSE具有包括发送中断期间数据的自动重连功能, 而WebSocket只能开启新连接实现手动重连.

#### Example

websocat
```sh
websocat "ws://localhost:8080/pubsub/$id"
```

JavaScript
```js
const ws = new WebSocket('ws://localhost:8080')
ws.addEventListener('message', event => {
    console.log(event.data);
})
```

### query

`GET /logger/<id>/query`

操作符head, tail, from, to可以组合使用, 一个查询不能同时有head和tail.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有read权限的token:
`/logger/<id>/query?token=<token>`

- `GET /logger/<id>/query?head=<number>` 取开头number个记录.
- `GET /logger/<id>/query?tail=<number>` 取结尾number个记录.
- `GET /logger/<id>/query?from=<logId>` 从特定logId开始.
- `GET /logger/<id>/query?to=<logId>` 至特定logId结束.

from和to操作符可以使用实际并不存在的logId, 程序会自动匹配至最近的记录.
省略from相当于从最早的记录开始.
省略to相当于至最晚的记录结束.

返回结果为JSON数组:
```ts
Array<{
  id: string
  payload: string
}>
```

#### Example

curl
```sh
curl "http://localhost:8080/$id/query"
```

JavaScript
```js
await fetch(`http://localhost:8080/${id}/query`).then(res => res.json())
```

### delete

`DELETE /logger/<id>?token=<token>` 清空整个记录器
`DELETE /logger/<id>/query?token=<token>` 根据查询结果删除日志

清空必须通过具有delete权限的token实现.

#### Example

curl
```sh
curl \
  --request DELETE \
  "http://localhost:8080/$id"
```

JavaScript
```js
await fetch(`http://localhost:8080/${id}`)
```

## 为log添加JSON验证

通过设置环境变量`LOGGER_JSON_VALIDATION=true`可开启log的JSON Schema验证功能.
任何带有`Content-Type: application/json`的请求都会被验证,
即使没有设置JSON Schema, 也会拒绝不合法的JSON文本.
JSON验证仅用于验证, 不会重新序列化消息, 因此follow得到的消息会与log发送的消息相同.

在开启验证功能的情况下, 通过环境变量`LOGGER_DEFAULT_JSON_SCHEMA`可设置默认的JSON Schema,
该验证仅对带有`Content-Type: application/json`的请求有效.

通过设置环境变量`LOGGER_JSON_PAYLOAD_ONLY=true`,
可以强制enqueue只接受带有`Content-Type: application/json`的请求.
此设置在未开启JSON Schema验证的情况下也有效, 但在这种情况下服务器能够接受不合法的JSON.

### 为记录器单独设置JSON Schema

可单独为id设置JSON Schema, 被设置的id将仅接受`Content-Type: application/json`请求.

#### 获取所有具有JSON Schema的记录器id

`GET /api/logger-with-json-schema`

获取所有具有JSON Schema的记录器id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger-with-json-schema"
```

fetch
```js
await fetch('http://localhost:8080/api/logger-with-json-schema', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取JSON Schema

`GET /api/logger/<id>/json-schema`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/json-schema"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/json-schema`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 设置JSON Schema

`PUT /api/logger/<id>/json-schema`

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  --header "Content-Type: application/json" \
  --data "$JSON_SCHEMA" \
  "http://localhost:8080/api/logger/$id/jsonschema"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/json-schema`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(jsonSchema)
})
```

#### 移除JSON Schema

`DELETE /api/logger/<id>/json-schema`

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/json-schema"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/json-schema`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## 日志淘汰策略(elimination policies)

Logger同时实施两种日志淘汰策略:
- 基于生存时间(TTL, time-to-live)的淘汰策略, 如果日志过期, 则删除日志
- 基于数量限制(limit)的淘汰策略, 如果单个记录器的日志数量达到上限, 则删除旧日志

日志淘汰策略只会在写入新日志时得到执行,
因此当你查询日志时, 可能会得到已经过期的日志.

可用环境变量`LOGGER_TIME_TO_LIVE`设置日志默认的生存时间, 单位为秒,
0代表无限, 默认情况下为无限.

可用环境变量`LOGGER_LIMIT`设置单个记录器的日志数量限制, 单位为个,
0代表无限, 默认情况下为无限.

### 为记录器单独设置淘汰策略

为记录器单独设置的淘汰策略会覆盖由环境变量设置的同一种类的淘汰策略.

#### 获取所有具有淘汰策略的记录器id

`GET /api/logger-with-elimination-policies`

获取所有具有淘汰策略的记录器id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger-with-elimination-policies"
```

fetch
```js
await fetch('http://localhost:8080/api/logger-with-elimination-policies', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取淘汰策略

`GET /api/logger/<id>/elimination-policies`

返回JSON:
```ts
{
  timeToLive: number | null
  limit: number | null
}
```

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/elimination-policies"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/elimination-policies`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 设置淘汰策略

`PUT /api/logger/<id>/elimination-policies/time-to-live`
`PUT /api/logger/<id>/elimination-policies/limit`

Payload必须是一个非负整数

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  --header "Content-Type: application/json" \
  --data "$JSON_SCHEMA" \
  "http://localhost:8080/api/logger/$id/jsonschema"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/elimination-policies`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(jsonSchema)
})
```

#### 触发淘汰策略

`POST /api/logger/<id>/eliminate`

你总是可以在设置完淘汰策略后手动触发它们.

##### Example

curl
```sh
curl \
  --request POST \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/eliminate"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/eliminate`, {
  method: 'POST'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 移除淘汰策略

`DELETE /api/logger/<id>/elimination-policies/time-to-live`
`DELETE /api/logger/<id>/elimination-policies/limit`

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/elimination-policies"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/elimination-policies`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## 访问控制

Logger提供两种访问控制策略, 可以一并使用.

所有访问控制API都使用基于口令的Bearer Token Authentication.
口令需通过环境变量`LOGGER_ADMIN_PASSWORD`进行设置.

访问控制规则是通过[WAL模式]的SQLite3持久化的, 开启访问控制后,
服务器的吞吐量和响应速度会受到硬盘性能的影响.

已经存在的阻塞连接不会受到新的访问控制规则的影响.

[WAL模式]: https://www.sqlite.org/wal.html

### 基于名单的访问控制

通过设置环境变量`LOGGER_LIST_BASED_ACCESS_CONTROL`开启基于名单的访问控制:
- `whitelist`
  启用基于记录器白名单的访问控制, 只有在名单内的记录器允许被访问.
- `blacklist`
  启用基于记录器黑名单的访问控制, 只有在名单外的记录器允许被访问.

#### 黑名单

##### 获取黑名单

`GET /api/blacklist`

获取位于黑名单中的所有记录器id, 返回JSON表示的字符串数组`string[]`.

###### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist"
```

fetch
```js
await fetch('http://localhost:8080/api/blacklist', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

##### 添加黑名单

`PUT /api/blacklist/<id>`

将特定记录器加入黑名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/blacklist/${id}`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

##### 移除黑名单

`DELETE /api/blacklist/<id>`

将特定记录器从黑名单中移除.

###### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/blacklist/${id}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 白名单

##### 获取白名单

`GET /api/whitelist`

获取位于黑名单中的所有记录器id, 返回JSON表示的字符串数组`string[]`.

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIM_PASSWORD" \
  "http://localhost:8080/api/whitelist"
```

fetch
```js
await fetch('http://localhost:8080/api/whitelist', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

##### 添加白名单

`PUT /api/whitelist/<id>`

将特定记录器加入白名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/whitelist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/whitelist/${id}`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

##### 移除白名单

`DELETE /api/whitelist/<id>`

将特定记录器从白名单中移除.

###### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/whitelist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/whitelist/${id}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

### 基于token的访问控制

对token的要求: `^[a-zA-Z0-9\.\-_]{1,256}$`

通过设置环境变量`LOGGER_TOKEN_BASED_ACCESS_CONTROL=true`开启基于token的访问控制.

基于token的访问控制将根据记录器具有的token决定其访问规则, 具体行为见下方表格.
一个记录器可以有多个token, 每个token可以单独设置read权限和read权限.
不同记录器的token不共用.

| 此记录器存在具有read权限的token | 此记录器存在具有read权限的token | 行为 |
| --- | --- | --- |
| YES | YES | 只有使用具有相关权限的token才能执行操作 |
| YES | NO | 无token可以follow, 只有具有read权限的token可以read |
| NO | YES | 无token可以read, 只有具有read权限的token可以follow |
| NO | NO | 无token可以follow和read |

在开启基于token的访问控制时,
可以通过将环境变量`LOGGER_DISABLE_NO_TOKENS`设置为`true`将无token的记录器禁用.

基于token的访问控制作出了如下假定, 因此不使用加密和消息验证码(MAC):
- token的传输过程是安全的
- token难以被猜测
- token的意外泄露可以被迅速处理

#### 获取所有具有token的记录器id

`GET /api/logger-with-tokens`

获取所有具有token的记录器id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger-with-tokens"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger-with-tokens`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取特定记录器的所有token信息

`GET /api/logger/<id>/tokens`

获取特定记录器的所有token信息, 返回JSON表示的token信息数组
`Array<{ token: string, write: boolean, read: boolean }>`.

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/tokens"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/tokens`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 为特定记录器的token设置write权限

`PUT /api/logger/<id>/tokens/<token>/write`

添加/更新token, 为token设置write权限.

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/tokens/$token/log"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/tokens/$token/log`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定记录器的token的write权限

`DELETE /api/logger/<id>/tokens/<token>/write`

取消token的read权限.

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/tokens/$token/write"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/tokens/${token}/write`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 为特定记录器的token设置read权限

`PUT /api/logger/<id>/tokens/<token>/read`

添加/更新token, 为token设置read权限.

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/tokens/$token/read"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/tokens/$token/read`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定记录器的token的read权限

`DELETE /api/logger/<id>/tokens/<token>/read`

取消token的read权限.

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/logger/$id/tokens/$token/read"
```

fetch
```js
await fetch(`http://localhost:8080/api/logger/${id}/tokens/${token}/read`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## HTTP/2

Logger支持HTTP/2, 以多路复用反向代理时的连接, 可通过设置环境变量`LOGGER_HTTP2=true`开启.

此HTTP/2支持不提供从HTTP/1.1自动升级的功能, 亦不提供HTTPS.
因此, 在本地curl里进行测试时, 需要开启`--http2-prior-knowledge`选项.

## 限制Payload大小

设置环境变量`LOGGER_PAYLOAD_LIMIT`可限制服务接受的单个Payload字节数, 默认值为1048576(1MB).

设置环境变量`LOGGER_LOG_PAYLOAD_LIMIT`可限制enqueue接受的单个Payload字节数, 默认值继承自`LOGGER_PAYLOAD_LIMIT`.

## 统计信息

`GET /stats`

输出JSON:
```ts
{
  memoryUsage: any // 与Node.js API保持一致
  cpuUsage: any // 与Node.js API保持一致
  resourceUsage: any // 与Node.js API保持一致
}
```
