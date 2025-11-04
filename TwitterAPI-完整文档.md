# TwitterAPI.io 完整 API 调用文档

## 目录

- [简介](#简介)
- [认证方式](#认证方式)
- [定价说明](#定价说明)
- [User Endpoint (用户端点)](#user-endpoint-用户端点)
- [Tweet Endpoint (推文端点)](#tweet-endpoint-推文端点)
- [List Endpoint (列表端点)](#list-endpoint-列表端点)
- [Communities Endpoint (社区端点)](#communities-endpoint-社区端点)
- [Trend Endpoint (趋势端点)](#trend-endpoint-趋势端点)
- [My Endpoint (我的账户端点)](#my-endpoint-我的账户端点)
- [Webhook/Websocket Filter Rule (Webhook规则端点)](#webhookwebsocket-filter-rule-webhook规则端点)
- [Stream Endpoint (流式监控端点)](#stream-endpoint-流式监控端点)

---

## 简介

TwitterAPI.io 是一个第三方 Twitter API 服务，提供可靠、高性能且经济实惠的 Twitter 数据访问接口。

### 核心特性

- **稳定性**: 已处理超过 100 万次 API 调用
- **性能**: 平均响应时间 700ms
- **高并发**: 支持每个客户端最多 200 QPS
- **易用性**: RESTful API 设计，遵循标准 OpenAPI 规范
- **经济实惠**:
  - $0.15/1k 推文
  - $0.18/1k 用户资料
  - $0.15/1k 粉丝
  - 最低费用: 每次请求 $0.00015

### 基础信息

- **基础 URL**: `https://api.twitterapi.io`
- **文档网站**: `https://docs.twitterapi.io`
- **支持联系**: [Telegram](https://t.me/kaitoeasyapivip)

---

## 认证方式

### API 密钥获取

1. 登录到 [TwitterAPI.io Dashboard](https://twitterapi.io/dashboard)
2. 在仪表板首页找到您的 API 密钥

### 使用 API 密钥

所有 API 请求必须在 HTTP 请求头中包含 `X-API-Key` 进行认证。

**请求头格式:**
```
X-API-Key: YOUR_API_KEY
```

**cURL 示例:**
```bash
curl --location 'https://api.twitterapi.io/twitter/user/info?userName=KaitoEasyAPI' \
  --header 'X-API-Key: YOUR_API_KEY'
```

**Python 示例:**
```python
import requests

url = 'https://api.twitterapi.io/twitter/user/info?userName=KaitoEasyAPI'
headers = {'X-API-Key': 'YOUR_API_KEY'}
response = requests.get(url, headers=headers)
print(response.json())
```

**Java 示例:**
```java
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

OkHttpClient client = new OkHttpClient();
Request request = new Request.Builder()
    .url("https://api.twitterapi.io/twitter/user/info?userName=KaitoEasyAPI")
    .addHeader("X-API-Key", "YOUR_API_KEY")
    .build();

try (Response response = client.newCall(request).execute()) {
    System.out.println(response.body().string());
} catch (Exception e) {
    e.printStackTrace();
}
```

---

## 定价说明

### 通用定价
- **用户资料**: $0.18 per 1000 users
- **推文数据**: $0.15 per 1000 tweets
- **粉丝列表**: $0.15 per 1000 followers
- **最低收费**: $0.00015 per request (即使无数据返回)

### 特殊定价
- **批量用户查询 (100+ users)**: 10 积分/用户
- **单个用户查询**: 18 积分/用户
- **文章获取**: 100 积分/文章
- **社区信息**: 20 积分/调用
- **关注关系检查**: 100 积分/调用
- **认证粉丝**: $0.3 per 1000 followers

---

## User Endpoint (用户端点)

### 1. 批量获取用户信息

**端点名称**: Batch Get User Info By UserIds
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/batch_info_by_ids`

**描述**: 通过用户 ID 批量获取用户信息

**定价**:
- 单个用户请求: 18 积分/用户
- 批量请求 (100+ 用户): 10 积分/用户

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| userIds | string | ✓ | 用户 ID 列表，用逗号分隔。例如: 1234567890,1234567891,1234567892 |

**响应格式** (200):
```json
{
  "users": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "following": 123,
      "isBlueVerified": true,
      "profilePicture": "string",
      "description": "string",
      "location": "string"
    }
  ],
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/batch_info_by_ids?userIds=1234567890,1234567891,1234567892" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 2. 获取用户信息

**端点名称**: Get User Info
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/info`

**描述**: 通过用户名获取用户详细信息

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| userName | string | ✓ | 用户的屏幕名称 (Twitter handle) |

**响应格式** (200):
```json
{
  "data": {
    "type": "user",
    "userName": "string",
    "id": "string",
    "name": "string",
    "followers": 123,
    "following": 123,
    "isBlueVerified": true,
    "profilePicture": "string",
    "description": "string",
    "location": "string",
    "createdAt": "string",
    "url": "string"
  },
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/info?userName=elonmusk" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 3. 获取用户最新推文

**端点名称**: Get User Last Tweets
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/last_tweets`

**描述**: 获取指定用户的最新推文，按创建时间降序排列，每页最多返回 20 条推文

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| userId | string | ✗ | 用户 ID（推荐使用，更稳定快速） |
| userName | string | ✗ | 用户名（userId 和 userName 二选一） |
| cursor | string | ✗ | 分页游标，首页为空字符串 |
| includeReplies | boolean | ✗ | 是否包含回复（默认 false） |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "createdAt": "string",
      "author": {
        "userName": "string",
        "followers": 123
      },
      "retweetCount": 123,
      "replyCount": 123,
      "likeCount": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/last_tweets?userName=elonmusk&cursor=&includeReplies=false" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 4. 获取用户粉丝

**端点名称**: Get User Followers
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/followers`

**描述**: 获取用户粉丝列表，按关注日期逆序排列（最新优先），每页返回 200 个粉丝

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| userName | string | ✓ | 用户的屏幕名称 |
| cursor | string | ✗ | 分页游标，首页为空字符串 |
| pageSize | integer | ✗ | 每页返回数量（默认 200，范围 20-200） |

**响应格式** (200):
```json
{
  "followers": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "following": 123,
      "isBlueVerified": true
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/followers?userName=elonmusk&cursor=&pageSize=200" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带分页的请求示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/followers?userName=elonmusk&cursor=next_cursor_value&pageSize=100" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 5. 获取用户关注列表

**端点名称**: Get User Followings
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/followings`

**描述**: 获取用户关注列表，每页返回 200 条关注记录，按关注日期排序（最近的关注在前）

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| userName | string | ✓ | 用户的屏幕名称 |
| cursor | string | ✗ | 分页游标，首页为空字符串 |
| pageSize | integer | ✗ | 每页返回的关注数，默认 200（范围 20-200） |

**响应格式** (200):
```json
{
  "followings": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "following": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/followings?userName=elonmusk&cursor=&pageSize=200" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 6. 获取用户提及

**端点名称**: Get User Mentions
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/mentions`

**描述**: 获取提及指定用户的推文，每页返回 20 条，按提及时间降序排列

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| userName | string | ✓ | 用户的屏幕名称，例如: kaitoEasyApi |
| sinceTime | integer | ✗ | Unix 时间戳（秒），返回此时间之后的提及 |
| untilTime | integer | ✗ | Unix 时间戳（秒），返回此时间之前的提及 |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "createdAt": "string",
      "likeCount": 123,
      "retweetCount": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/mentions?userName=kaitoEasyApi&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

**含时间范围的示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/mentions?userName=kaitoEasyApi&sinceTime=1700000000&untilTime=1700100000&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 7. 检查关注关系

**端点名称**: Check Follow Relationship
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/check_follow_relationship`

**描述**: 检查源用户是否关注目标用户，以及是否被目标用户关注

**定价**: 100 积分/调用

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| source_user_name | string | ✓ | 源用户的账户名 |
| target_user_name | string | ✗ | 目标用户的账户名 |

**响应格式** (200):
```json
{
  "data": {
    "following": true,
    "followed_by": false
  },
  "status": "success",
  "message": "string"
}
```

**字段说明**:
- `following`: 源用户是否关注目标用户
- `followed_by`: 源用户是否被目标用户关注

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/check_follow_relationship?source_user_name=user1&target_user_name=user2" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 8. 搜索用户

**端点名称**: Search user by keyword
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/search`

**描述**: 通过关键词搜索 Twitter 用户

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| query | string | ✓ | 搜索关键词 |

**响应格式** (200):
```json
{
  "users": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "isBlueVerified": true,
      "description": "string"
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/search?query=developer" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 9. 获取用户认证粉丝

**端点名称**: Get User Verified Followers
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/user/verifiedFollowers`

**描述**: 获取用户的认证（蓝V）粉丝，按时间倒序排列（最新优先），每页返回 20 个已认证粉丝

**定价**: $0.3 per 1000 followers

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| user_id | string | ✓ | 用户的 user_id |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "followers": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "isBlueVerified": true,
      "followers": 123,
      "profilePicture": "string",
      "description": "string"
    }
  ],
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/user/verifiedFollowers?user_id=YOUR_USER_ID&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## Tweet Endpoint (推文端点)

### 1. 通过 ID 获取推文

**端点名称**: Get Tweets by IDs
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/tweets`

**描述**: 通过推文 ID 批量获取推文详情

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tweet_ids | string | ✓ | 推文 ID 列表，使用逗号分隔多个 ID。例如: 1846987139428634858,1866332309399781537 |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "url": "string",
      "text": "string",
      "source": "string",
      "retweetCount": 123,
      "replyCount": 123,
      "likeCount": 123,
      "createdAt": "string",
      "author": {
        "type": "user",
        "userName": "string",
        "followers": 123
      }
    }
  ],
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweets?tweet_ids=1846987139428634858,1866332309399781537" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 2. 获取推文回复

**端点名称**: Get Tweet Replies
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/tweet/replies`

**描述**: 获取指定推文的回复，每页最多返回 20 条回复（可能少于 20 条，因为会过滤广告等内容），按回复时间降序排列

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tweetId | string | ✓ | 必须是原始推文（不是对另一条推文的回复）且应为线程中的第一条推文 |
| sinceTime | integer | ✗ | Unix 时间戳（秒），返回此时间之后的回复 |
| untilTime | integer | ✗ | Unix 时间戳（秒），返回此时间之前的回复 |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "replies": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "createdAt": "string",
      "author": {
        "userName": "string"
      },
      "likeCount": 123,
      "replyCount": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/replies?tweetId=1846987139428634858&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带时间范围的请求**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/replies?tweetId=1846987139428634858&sinceTime=1702000000&untilTime=1702100000&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 3. 获取推文引用

**端点名称**: Get Tweet Quotations
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/tweet/quotes`

**描述**: 获取指定推文的引用推文，每页返回 20 条，支持分页

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tweetId | string | ✓ | 推文 ID，例如: 1846987139428634858 |
| sinceTime | integer | ✗ | Unix 时间戳（秒），包含该时间之后的结果 |
| untilTime | integer | ✗ | Unix 时间戳（秒），返回该时间之前的结果 |
| includeReplies | boolean | ✗ | 是否包含回复，默认 true |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "createdAt": "string"
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/quotes?tweetId=1846987139428634858&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 4. 获取推文转发者

**端点名称**: Get Tweet Retweeters
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/tweet/retweeters`

**描述**: 获取转发指定推文的用户列表，每页约返回 100 个转发者，按转发时间降序排列

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tweetId | string | ✓ | 推文 ID，例如: 1846987139428634858 |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "users": [
    {
      "type": "user",
      "userName": "string",
      "url": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "following": 123,
      "description": "string"
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/retweeters?tweetId=1846987139428634858&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

**分页请求示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/retweeters?tweetId=1846987139428634858&cursor=NEXT_CURSOR_VALUE" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 5. 获取推文线程上下文

**端点名称**: Get Tweet Thread Context
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/tweet/thread_context`

**描述**: 检索包含原始推文、所有回复及其子回复的完整推文线程

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tweetId | string | ✓ | 推文 ID，可以是回复推文或原始推文 |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "replies": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "likeCount": 123,
      "replyCount": 45,
      "author": {
        "type": "user",
        "userName": "string",
        "name": "string"
      }
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/thread_context?tweetId=1234567890" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带分页的请求**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/thread_context?tweetId=1234567890&cursor=next_page_cursor" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 6. 获取文章

**端点名称**: Get Article
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/article`

**描述**: 通过推文 ID 获取 Twitter 文章内容

**定价**: 100 积分/文章

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tweet_id | string | ✓ | 文章对应推文的 ID，例如: 1905545699552375179 |

**响应格式** (200):
```json
{
  "article": {
    "author": {},
    "replyCount": 123,
    "likeCount": 123,
    "quoteCount": 123,
    "viewCount": 123,
    "publishedAt": "string",
    "title": "string",
    "previewText": "string",
    "coverImageUrl": "string",
    "content": []
  },
  "status": "success",
  "message": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/article?tweet_id=1905545699552375179" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 7. 高级搜索

**端点名称**: Advanced Search
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/tweet/advanced_search`

**描述**: 高级推文搜索，每页最多返回 20 条推文

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| query | string | ✓ | 搜索查询，例如: 'AI' OR 'Twitter' from:elonmusk since:2021-12-31_23:59:59_UTC |
| queryType | enum | ✓ | 搜索类型: Latest（最新）或 Top（热门），默认: Latest |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "createdAt": "string",
      "author": {
        "userName": "string",
        "followers": 123
      },
      "retweetCount": 123,
      "likeCount": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/advanced_search?query=AI&queryType=Latest" \
  -H "X-API-Key: YOUR_API_KEY"
```

**分页示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/tweet/advanced_search?query=AI&queryType=Latest&cursor=NEXT_CURSOR_VALUE" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## List Endpoint (列表端点)

### 1. 获取列表粉丝

**端点名称**: Get List Followers
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/list/followers`

**描述**: 获取 Twitter 列表的粉丝，每页返回 20 个粉丝

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| list_id | string | ✓ | 列表 ID |
| cursor | string | ✗ | 分页游标 |

**响应格式** (200):
```json
{
  "followers": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "following": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/list/followers?list_id=YOUR_LIST_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带分页的请求**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/list/followers?list_id=YOUR_LIST_ID&cursor=NEXT_CURSOR" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 2. 获取列表成员

**端点名称**: Get List Members
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/list/members`

**描述**: 获取 Twitter 列表的成员，每页返回 20 个成员

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| list_id | string | ✓ | 列表 ID |
| cursor | string | ✗ | 分页游标 |

**响应格式** (200):
```json
{
  "members": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string",
      "followers": 123,
      "following": 123
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/list/members?list_id=YOUR_LIST_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带分页的请求**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/list/members?list_id=YOUR_LIST_ID&cursor=CURSOR_VALUE" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## Communities Endpoint (社区端点)

### 1. 获取社区信息

**端点名称**: Get Community Info By Id
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/community/info`

**描述**: 通过社区 ID 获取社区详细信息

**定价**: 20 积分/调用

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| community_id | string | ✓ | 社区 ID |

**响应格式** (200):
```json
{
  "community_info": {
    "id": "string",
    "name": "string",
    "description": "string",
    "question": "string",
    "member_count": 123,
    "moderator_count": 123,
    "created_at": "string",
    "join_policy": "string",
    "invites_policy": "string",
    "is_nsfw": false,
    "is_pinned": false,
    "role": "string",
    "banner_url": "string",
    "primary_topic": {
      "id": "string",
      "name": "string"
    },
    "search_tags": ["string"],
    "rules": [
      {
        "id": "string",
        "name": "string",
        "description": "string"
      }
    ],
    "creator": {},
    "admin": {},
    "members_preview": []
  },
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/info?community_id=YOUR_COMMUNITY_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 2. 获取社区成员

**端点名称**: Get Community Members
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/community/members`

**描述**: 获取社区成员列表，每页返回 20 个成员

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| community_id | string | ✓ | 社区 ID |
| cursor | string | ✗ | 分页游标 |

**响应格式** (200):
```json
{
  "members": [
    {
      "type": "user",
      "userName": "string",
      "url": "string",
      "id": "string",
      "name": "string",
      "isBlueVerified": true,
      "followers": 123,
      "following": 123,
      "createdAt": "string",
      "profilePicture": "string"
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/members?community_id=YOUR_COMMUNITY_ID&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带分页的请求**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/members?community_id=abc123&cursor=next_page_cursor" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 3. 获取社区版主

**端点名称**: Get Community Moderators
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/community/moderators`

**描述**: 获取社区的版主列表，每页返回 20 个版主

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| community_id | string | ✓ | 社区 ID |
| cursor | string | ✗ | 分页游标 |

**响应格式** (200):
```json
{
  "members": [
    {
      "type": "user",
      "userName": "string",
      "id": "string",
      "name": "string"
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/moderators?community_id=YOUR_COMMUNITY_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

**分页请求示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/moderators?community_id=YOUR_COMMUNITY_ID&cursor=NEXT_CURSOR" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 4. 获取社区推文

**端点名称**: Get Community Tweets
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/community/tweets`

**描述**: 获取社区的推文，每页返回 20 条推文，按创建时间降序排列

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| community_id | string | ✓ | 社区 ID |
| cursor | string | ✗ | 分页游标 |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "text": "string",
      "createdAt": "string"
    }
  ],
  "has_next_page": true,
  "next_cursor": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/tweets?community_id=YOUR_COMMUNITY_ID" \
  -H "X-API-Key: YOUR_API_KEY"
```

**带分页示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/tweets?community_id=YOUR_COMMUNITY_ID&cursor=NEXT_CURSOR" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 5. 搜索所有社区推文

**端点名称**: Search Tweets From All Community
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/community/get_tweets_from_all_community`

**描述**: 从所有社区搜索推文，每页最多返回 20 条推文

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| query | string | ✓ | 搜索关键词（仅支持关键词搜索） |
| queryType | enum | ✓ | Latest（最新）或 Top（热门），默认值: Latest |
| cursor | string | ✗ | 分页游标，首页为空字符串 |

**响应格式** (200):
```json
{
  "tweets": [
    {
      "type": "tweet",
      "id": "string",
      "url": "string",
      "text": "string",
      "createdAt": "string",
      "likeCount": 123,
      "retweetCount": 123,
      "replyCount": 123,
      "author": {
        "type": "user",
        "userName": "string",
        "id": "string",
        "followers": 123
      }
    }
  ],
  "has_next_page": true,
  "next_cursor": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/community/get_tweets_from_all_community?query=python&queryType=Latest&cursor=" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## Trend Endpoint (趋势端点)

### 获取趋势

**端点名称**: Get Trends
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/twitter/trends`

**描述**: 按地区代码获取 Twitter 趋势话题

**请求参数**:

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| woeid | integer | ✓ | 地区代码，例如 2418046（美国）。参考列表可在指定的 gist 中查找 |
| count | integer | ✗ | 返回趋势数量，默认 30，最小值 30 |

**响应格式** (200):
```json
{
  "trends": [
    {
      "name": "string",
      "target": {
        "query": "string"
      },
      "rank": 123,
      "meta_description": "string"
    }
  ],
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/twitter/trends?woeid=2418046&count=30" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## My Endpoint (我的账户端点)

### 获取我的账户信息

**端点名称**: Get My Account Info
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/oapi/my/info`

**描述**: 获取当前 API 账户的剩余积分信息

**请求参数**: 无查询参数

**响应格式** (200):
```json
{
  "recharge_credits": 123
}
```

**字段说明**:
- `recharge_credits`: 剩余积分数

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/oapi/my/info" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

## Webhook/Websocket Filter Rule (Webhook规则端点)

### 1. 添加推文过滤规则

**端点名称**: Add Webhook/Websocket Tweet Filter Rule
**HTTP方法**: `POST`
**URL**: `https://api.twitterapi.io/oapi/tweet_filter/add_rule`

**描述**: 添加推文过滤规则。默认规则不激活，必须调用 update_rule 来激活规则

**请求体参数** (application/json):

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| tag | string | ✓ | 自定义标签用于识别规则，最大长度 255 |
| value | string | ✓ | 过滤规则，例如: from:elonmusk OR from:kaitoeasyapi，最大长度 255 |
| interval_seconds | number | ✓ | 检查推文的间隔时间，最小值 100，最大值 86400 |

**响应格式** (200):
```json
{
  "rule_id": "string",
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X POST https://api.twitterapi.io/oapi/tweet_filter/add_rule \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "my_filter",
    "value": "from:elonmusk OR from:twitter",
    "interval_seconds": 3600
  }'
```

---

### 2. 获取所有过滤规则

**端点名称**: Get ALL test Webhook/Websocket Tweet Filter Rules
**HTTP方法**: `GET`
**URL**: `https://api.twitterapi.io/oapi/tweet_filter/get_rules`

**描述**: 获取所有推文过滤规则，可用于 webhook 和 websocket

**请求参数**: 无查询参数

**响应格式** (200):
```json
{
  "rules": [
    {
      "rule_id": "string",
      "tag": "string",
      "value": "string",
      "interval_seconds": 123
    }
  ],
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X GET "https://api.twitterapi.io/oapi/tweet_filter/get_rules" \
  -H "X-API-Key: YOUR_API_KEY"
```

---

### 3. 更新推文过滤规则

**端点名称**: Update Webhook/Websocket Tweet Filter Rule
**HTTP方法**: `POST`
**URL**: `https://api.twitterapi.io/oapi/tweet_filter/update_rule`

**描述**: 更新推文过滤规则，必须设置所有参数

**请求体参数** (application/json):

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| rule_id | string | ✓ | 要更新的规则 ID，必须设置 |
| tag | string | ✓ | 自定义标签用于识别规则，最长 255 字符 |
| value | string | ✓ | 过滤规则，例如: from:elonmusk OR from:kaitoeasyapi |
| interval_seconds | number | ✓ | 检查推文的时间间隔，范围 0.1-86400 秒 |
| is_effect | integer | ✓ | 规则是否有效（1=有效，0=无效） |

**响应格式** (200):
```json
{
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X POST https://api.twitterapi.io/oapi/tweet_filter/update_rule \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rule_id": "rule123",
    "tag": "my_filter",
    "value": "from:elonmusk OR from:kaitoeasyapi",
    "interval_seconds": 300,
    "is_effect": 1
  }'
```

---

### 4. 删除推文过滤规则

**端点名称**: Delete Webhook/Websocket Tweet Filter Rule
**HTTP方法**: `DELETE`
**URL**: `https://api.twitterapi.io/oapi/tweet_filter/delete_rule`

**描述**: 删除推文过滤规则

**请求体参数** (application/json):

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| rule_id | string | ✓ | 要删除的规则 ID，必须设置 |

**响应格式** (200):
```json
{
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X DELETE https://api.twitterapi.io/oapi/tweet_filter/delete_rule \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "rule_id": "your_rule_id_here"
  }'
```

---

## Stream Endpoint (流式监控端点)

### 1. 添加用户监控

**端点名称**: Add a twitter user to monitor his tweets
**HTTP方法**: `POST`
**URL**: `https://api.twitterapi.io/oapi/x_user_stream/add_user_to_monitor_tweet`

**描述**: 监控指定账户的推文，包括直接发送的推文、引用推文、回复推文和转推

**请求体参数** (application/json):

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| x_user_name | string | ✓ | 要监控的 Twitter 用户名，必须设置 |

**响应格式** (200):
```json
{
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X POST https://api.twitterapi.io/oapi/x_user_stream/add_user_to_monitor_tweet \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "x_user_name": "target_handle"
  }'
```

---

### 2. 移除用户监控

**端点名称**: Remove a user from monitor list
**HTTP方法**: `POST`
**URL**: `https://api.twitterapi.io/oapi/x_user_stream/remove_user_to_monitor_tweet`

**描述**: 从监控列表中移除用户，停止实时推文监控

**请求体参数** (application/json):

| 参数名 | 类型 | 必需 | 描述 |
|--------|------|------|------|
| id_for_user | string | ✓ | 从 get_user_to_monitor_tweet API 获取的 ID |

**响应格式** (200):
```json
{
  "status": "success",
  "msg": "string"
}
```

**cURL 示例**:
```bash
curl -X POST https://api.twitterapi.io/oapi/x_user_stream/remove_user_to_monitor_tweet \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id_for_user": "user_id_value"
  }'
```

---

## 附录

### 常见响应字段说明

#### UserInfo 对象
```json
{
  "type": "user",
  "userName": "string",        // Twitter 用户名
  "id": "string",              // 用户 ID
  "name": "string",            // 显示名称
  "followers": 123,            // 粉丝数
  "following": 123,            // 关注数
  "isBlueVerified": true,      // 是否蓝V认证
  "profilePicture": "string",  // 头像 URL
  "description": "string",     // 个人简介
  "location": "string",        // 位置
  "createdAt": "string",       // 账户创建时间
  "url": "string"              // 个人资料 URL
}
```

#### Tweet 对象
```json
{
  "type": "tweet",
  "id": "string",              // 推文 ID
  "url": "string",             // 推文 URL
  "text": "string",            // 推文内容
  "createdAt": "string",       // 创建时间
  "source": "string",          // 发布来源
  "retweetCount": 123,         // 转推数
  "replyCount": 123,           // 回复数
  "likeCount": 123,            // 点赞数
  "quoteCount": 123,           // 引用数
  "viewCount": 123,            // 浏览数
  "author": {                  // 作者信息（UserInfo 对象）
    "userName": "string",
    "followers": 123
  }
}
```

### 错误响应格式

所有端点在出错时返回以下格式的 400 错误响应：

```json
{
  "error": 123,              // 错误代码
  "message": "string"        // 错误描述
}
```

### 分页说明

- 大多数端点支持游标分页
- 首页请求时 `cursor` 参数为空字符串或不传
- 响应中的 `has_next_page` 指示是否有下一页
- 使用响应中的 `next_cursor` 获取下一页数据
- 页面大小根据不同端点固定（通常为 20 或 200）

### 时间格式

- Unix 时间戳使用秒为单位（不是毫秒）
- 日期时间字符串通常为 ISO 8601 格式
- 高级搜索支持的时间格式: `YYYY-MM-DD_HH:MM:SS_UTC`

---

## 支持与反馈

- **官网**: [https://twitterapi.io](https://twitterapi.io)
- **文档**: [https://docs.twitterapi.io](https://docs.twitterapi.io)
- **技术支持**: [Telegram](https://t.me/kaitoeasyapivip)
- **Dashboard**: [https://twitterapi.io/dashboard](https://twitterapi.io/dashboard)

---

**文档版本**: v1.0
**最后更新**: 2025年
**文档生成**: 幽浮喵 ฅ'ω'ฅ

