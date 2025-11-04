/**
 * Twitter 搜索逻辑
 * 根据监控规则搜索推文
 */

import { twitterClient, TwitterTweet } from './client'

export interface MonitorRule {
  id: string
  type: 'keyword' | 'account' | 'advanced'
  value: string
  minFollowers?: number | null
  includeReplies?: boolean
  lastCheckedAt?: Date | null
}

/**
 * 根据监控规则搜索推文
 */
export async function searchTweetsByRule(
  rule: MonitorRule,
  sinceTime?: Date
): Promise<TwitterTweet[]> {
  try {
    switch (rule.type) {
      case 'keyword':
        return await searchByKeyword(rule.value, sinceTime, rule.minFollowers)

      case 'account':
        return await searchByAccount(rule.value, sinceTime, rule.includeReplies)

      case 'advanced':
        return await searchAdvanced(rule.value, sinceTime)

      default:
        throw new Error(`未知的规则类型: ${rule.type}`)
    }
  } catch (error) {
    console.error('❌ 搜索推文失败:', {
      ruleId: rule.id,
      ruleType: rule.type,
      error,
    })
    throw error
  }
}

/**
 * 按关键词搜索
 */
async function searchByKeyword(
  keyword: string,
  sinceTime?: Date,
  minFollowers?: number | null
): Promise<TwitterTweet[]> {
  // 构建搜索查询
  let query = keyword

  // 添加时间过滤
  if (sinceTime) {
    query += ` since:${formatTwitterDate(sinceTime)}`
  }

  // 添加粉丝数过滤
  if (minFollowers && minFollowers > 0) {
    query += ` min_faves:${minFollowers}`
  }

  console.log('🔍 关键词搜索:', query)

  const result = await twitterClient.advancedSearch({
    query,
    queryType: 'Latest',
  })

  return result.tweets || []
}

/**
 * 按账号搜索
 */
async function searchByAccount(
  userName: string,
  sinceTime?: Date,
  includeReplies?: boolean
): Promise<TwitterTweet[]> {
  // 移除 @ 符号 (如果有)
  const cleanUserName = userName.replace('@', '')

  console.log('🔍 账号搜索:', cleanUserName)

  const result = await twitterClient.getUserLastTweets({
    userName: cleanUserName,
    includeReplies: includeReplies || false,
  })

  let tweets = result.tweets || []

  // 过滤时间
  if (sinceTime) {
    tweets = tweets.filter((tweet) => {
      const tweetTime = new Date(tweet.createdAt)
      return tweetTime > sinceTime
    })
  }

  return tweets
}

/**
 * 高级搜索
 */
async function searchAdvanced(query: string, sinceTime?: Date): Promise<TwitterTweet[]> {
  // 如果查询中已经包含时间过滤,不再添加
  let fullQuery = query

  if (sinceTime && !query.includes('since:')) {
    fullQuery += ` since:${formatTwitterDate(sinceTime)}`
  }

  console.log('🔍 高级搜索:', fullQuery)

  const result = await twitterClient.advancedSearch({
    query: fullQuery,
    queryType: 'Latest',
  })

  return result.tweets || []
}

/**
 * 格式化日期为 Twitter 搜索格式
 * 格式: YYYY-MM-DD_HH:MM:SS_UTC
 */
function formatTwitterDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}_UTC`
}

/**
 * 补全推文 URL (如果缺失)
 */
export function ensureTweetUrl(tweet: TwitterTweet): string {
  if (tweet.url) {
    return tweet.url
  }

  return `https://twitter.com/${tweet.author.userName}/status/${tweet.id}`
}

/**
 * 过滤重复推文
 */
export function deduplicateTweets(tweets: TwitterTweet[]): TwitterTweet[] {
  const seen = new Set<string>()
  return tweets.filter((tweet) => {
    if (seen.has(tweet.id)) {
      return false
    }
    seen.add(tweet.id)
    return true
  })
}
