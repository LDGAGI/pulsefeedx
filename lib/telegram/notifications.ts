/**
 * Telegram 通知消息格式化
 * 用于生成各种类型的通知消息
 */

import { sendTelegramMessage } from './bot'

export interface HitNotificationData {
  tweetText: string
  tweetAuthor: string
  tweetUrl: string
  matchedKeyword: string
  matchedAt: Date
  likeCount?: number
  retweetCount?: number
  replyCount?: number
}

/**
 * 发送推文命中通知
 */
export async function sendHitNotification(
  chatId: string,
  hit: HitNotificationData
): Promise<boolean> {
  // 格式化相对时间
  const timeAgo = formatRelativeTime(hit.matchedAt)

  // 构建消息文本
  const message = `
🚨 *高信号提醒*

📌 关键词: \`${escapeMarkdown(hit.matchedKeyword)}\`
👤 来自: [@${escapeMarkdown(hit.tweetAuthor)}](https://twitter.com/${hit.tweetAuthor})
🕐 时间: ${timeAgo}

${escapeMarkdown(hit.tweetText)}

${formatStats(hit)}

_⚡️ PulseFeedX 雷达 · 比别人快 10 秒看见未来_
  `.trim()

  return sendTelegramMessage({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
    disable_web_page_preview: false,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🔗 查看推文',
            url: hit.tweetUrl,
          },
          {
            text: '📊 查看更多',
            url: `${process.env.NEXT_PUBLIC_APP_URL}/monitor/hits`,
          },
        ],
      ],
    },
  })
}

/**
 * 发送绑定成功通知
 */
export async function sendBindingSuccessNotification(
  chatId: string,
  userName?: string
): Promise<boolean> {
  const greeting = userName ? `Hi ${escapeMarkdown(userName)}!` : 'Hi!'

  const message = `
✅ *绑定成功!*

${greeting}

你的 Telegram 账号已成功绑定到 PulseFeedX。

现在你可以:
1️⃣ 在网页端添加监控规则
2️⃣ 实时接收推文命中提醒
3️⃣ 比别人更快发现重要信息

开始监控 👉 [点击这里](${process.env.NEXT_PUBLIC_APP_URL}/monitor)
  `.trim()

  return sendTelegramMessage({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  })
}

/**
 * 发送欢迎消息
 */
export async function sendWelcomeMessage(chatId: string): Promise<boolean> {
  const message = `
👋 *欢迎使用 PulseFeedX!*

我是你的 Twitter 信号雷达 🔍

*功能介绍:*
• 监控 Twitter 关键词和账号
• 有新推文立刻通知你
• 比别人快 10 秒发现重要信息

*如何开始:*
1. 前往网页端绑定账号
2. 添加监控规则
3. 等待实时提醒

🔗 开始使用: ${process.env.NEXT_PUBLIC_APP_URL}
  `.trim()

  return sendTelegramMessage({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  })
}

/**
 * 发送验证码消息
 */
export async function sendVerificationCode(
  chatId: string,
  code: string
): Promise<boolean> {
  const message = `
🔐 *验证码*

你的 PulseFeedX 验证码是:

\`${code}\`

请在 10 分钟内在网页端输入此验证码完成绑定。

⚠️ 如果这不是你的操作,请忽略此消息。
  `.trim()

  return sendTelegramMessage({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  })
}

/**
 * 发送积分不足通知
 */
export async function sendCreditsLowNotification(
  chatId: string,
  currentCredits: number
): Promise<boolean> {
  const message = `
⚠️ *积分不足提醒*

你的积分余额: ${currentCredits}

部分监控规则可能已暂停,请充值以继续使用。

💳 [立即充值](${process.env.NEXT_PUBLIC_APP_URL}/pricing)
  `.trim()

  return sendTelegramMessage({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  })
}

/**
 * 发送规则暂停通知
 */
export async function sendRulePausedNotification(
  chatId: string,
  ruleName: string,
  reason: string
): Promise<boolean> {
  const message = `
⏸️ *监控规则已暂停*

规则名称: ${escapeMarkdown(ruleName)}
暂停原因: ${escapeMarkdown(reason)}

请前往网页端查看详情并重新启用。

🔗 [查看规则](${process.env.NEXT_PUBLIC_APP_URL}/monitor)
  `.trim()

  return sendTelegramMessage({
    chat_id: chatId,
    text: message,
    parse_mode: 'Markdown',
  })
}

// ========== 辅助函数 ==========

/**
 * 格式化相对时间
 */
function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds}秒前`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}小时前`
  return `${Math.floor(seconds / 86400)}天前`
}

/**
 * 格式化推文统计信息
 */
function formatStats(hit: HitNotificationData): string {
  const parts = []

  if (hit.replyCount !== undefined) {
    parts.push(`💬 ${hit.replyCount}`)
  }
  if (hit.retweetCount !== undefined) {
    parts.push(`🔄 ${hit.retweetCount}`)
  }
  if (hit.likeCount !== undefined) {
    parts.push(`❤️ ${hit.likeCount}`)
  }

  return parts.length > 0 ? parts.join('  |  ') : ''
}

/**
 * 转义 Markdown 特殊字符
 * Telegram Markdown 需要转义: _ * [ ] ( ) ~ ` > # + - = | { } . !
 */
function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1')
}
