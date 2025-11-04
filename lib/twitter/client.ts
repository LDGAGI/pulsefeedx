/**
 * TwitterAPI.io 客户端封装
 * 文档: https://docs.twitterapi.io
 */

const TWITTER_API_BASE = 'https://api.twitterapi.io'
const API_KEY = process.env.TWITTER_API_KEY

if (!API_KEY) {
  console.warn('⚠️ TWITTER_API_KEY 未配置，Twitter 监控功能将无法使用')
}

export interface TwitterTweet {
  id: string
  text: string
  createdAt: string
  url?: string
  author: {
    userName: string
    id?: string
    followers?: number
    name?: string
  }
  retweetCount?: number
  replyCount?: number
  likeCount?: number
  quoteCount?: number
  viewCount?: number
}

export interface TwitterSearchResponse {
  tweets: TwitterTweet[]
  has_next_page: boolean
  next_cursor?: string
  status: string
  message?: string
}

export interface TwitterUserTweetsResponse {
  tweets: TwitterTweet[]
  has_next_page: boolean
  next_cursor?: string
  status: string
  message?: string
}

export class TwitterAPIClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || API_KEY || ''
    if (!this.apiKey) {
      throw new Error('Twitter API Key 未配置')
    }
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    const url = new URL(`${TWITTER_API_BASE}${endpoint}`)

    // 添加查询参数
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value))
        }
      })
    }

    try {
      const response = await fetch(url.toString(), {
        headers: {
          'X-API-Key': this.apiKey,
        },
        // 添加超时控制
        signal: AbortSignal.timeout(30000), // 30 秒超时
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: response.status,
          message: response.statusText,
        }))

        console.error('❌ Twitter API 错误:', {
          endpoint,
          status: response.status,
          error,
        })

        throw new Error(
          `Twitter API error: ${error.message || error.error || '未知错误'}`
        )
      }

      const data = await response.json()

      // 检查 API 返回的状态
      if (data.status && data.status !== 'success') {
        throw new Error(`Twitter API 返回错误: ${data.msg || data.message || '未知错误'}`)
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        console.error('❌ Twitter API 请求失败:', {
          endpoint,
          error: error.message,
        })
      }
      throw error
    }
  }

  /**
   * 高级搜索推文
   * @param query 搜索查询，支持 Twitter 高级搜索语法
   * @param queryType Latest (最新) 或 Top (热门)
   * @param cursor 分页游标
   */
  async advancedSearch(params: {
    query: string
    queryType?: 'Latest' | 'Top'
    cursor?: string
  }): Promise<TwitterSearchResponse> {
    return this.request<TwitterSearchResponse>('/twitter/tweet/advanced_search', {
      query: params.query,
      queryType: params.queryType || 'Latest',
      cursor: params.cursor || '',
    })
  }

  /**
   * 获取用户最新推文
   * @param userId 用户 ID (推荐使用，更稳定)
   * @param userName 用户名 (userId 和 userName 二选一)
   * @param cursor 分页游标
   * @param includeReplies 是否包含回复
   */
  async getUserLastTweets(params: {
    userId?: string
    userName?: string
    cursor?: string
    includeReplies?: boolean
  }): Promise<TwitterUserTweetsResponse> {
    if (!params.userId && !params.userName) {
      throw new Error('userId 或 userName 必须提供一个')
    }

    return this.request<TwitterUserTweetsResponse>('/twitter/user/last_tweets', {
      user_id: params.userId,
      userName: params.userName,
      cursor: params.cursor || '',
      includeReplies: params.includeReplies || false,
    })
  }

  /**
   * 通过推文 ID 获取推文详情
   * @param tweetIds 推文 ID 数组或逗号分隔的字符串
   */
  async getTweetsByIds(tweetIds: string | string[]): Promise<{
    tweets: TwitterTweet[]
    status: string
    message?: string
  }> {
    const ids = Array.isArray(tweetIds) ? tweetIds.join(',') : tweetIds

    return this.request('/twitter/tweets', {
      tweet_ids: ids,
    })
  }

  /**
   * 获取用户信息
   * @param userName 用户名
   */
  async getUserInfo(userName: string): Promise<{
    data: {
      type: 'user'
      userName: string
      id: string
      name: string
      followers: number
      following: number
      isBlueVerified: boolean
      profilePicture?: string
      description?: string
      location?: string
      createdAt?: string
      url?: string
    }
    status: string
    msg?: string
  }> {
    return this.request('/twitter/user/info', {
      userName,
    })
  }

  /**
   * 搜索用户
   * @param query 搜索关键词
   */
  async searchUsers(query: string): Promise<{
    users: Array<{
      type: 'user'
      userName: string
      id: string
      name: string
      followers: number
      isBlueVerified: boolean
      description?: string
    }>
    has_next_page: boolean
    next_cursor?: string
    status: string
    msg?: string
  }> {
    return this.request('/twitter/user/search', {
      query,
    })
  }
}

/**
 * 默认导出客户端实例
 */
export const twitterClient = new TwitterAPIClient()
