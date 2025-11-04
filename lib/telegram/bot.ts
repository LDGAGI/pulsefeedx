/**
 * Telegram Bot 核心服务
 * 用于发送消息、设置 Webhook 等基础操作
 */

const TELEGRAM_API = 'https://api.telegram.org/bot'

/**
 * 获取 Bot Token (延迟获取以支持动态环境变量)
 */
function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error('Telegram Bot Token 未配置')
  }
  return token
}

export interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: 'Markdown' | 'HTML' | 'MarkdownV2'
  disable_web_page_preview?: boolean
  reply_markup?: {
    inline_keyboard?: Array<Array<{
      text: string
      url?: string
      callback_data?: string
    }>>
  }
}

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

/**
 * 发送 Telegram 消息
 */
export async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  const BOT_TOKEN = getBotToken()

  try {
    const response = await fetch(`${TELEGRAM_API}${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ Telegram API 错误:', error)
      throw new Error(`Telegram API error: ${error.description || '未知错误'}`)
    }

    return true
  } catch (error) {
    console.error('❌ 发送 Telegram 消息失败:', error)
    throw error
  }
}

/**
 * 设置 Webhook
 * @param webhookUrl 完整的 webhook URL
 */
export async function setWebhook(webhookUrl: string) {
  const BOT_TOKEN = getBotToken()

  const response = await fetch(`${TELEGRAM_API}${BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true, // 清除待处理的更新
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`设置 Webhook 失败: ${error.description}`)
  }

  const result = await response.json()
  return result.result
}

/**
 * 删除 Webhook
 */
export async function deleteWebhook() {
  const BOT_TOKEN = getBotToken()

  const response = await fetch(`${TELEGRAM_API}${BOT_TOKEN}/deleteWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      drop_pending_updates: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`删除 Webhook 失败: ${error.description}`)
  }

  const result = await response.json()
  return result.result
}

/**
 * 获取 Webhook 信息
 */
export async function getWebhookInfo() {
  const BOT_TOKEN = getBotToken()

  const response = await fetch(`${TELEGRAM_API}${BOT_TOKEN}/getWebhookInfo`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`获取 Webhook 信息失败: ${error.description}`)
  }

  const result = await response.json()
  return result.result
}

/**
 * 获取 Bot 信息
 */
export async function getBotInfo() {
  const BOT_TOKEN = getBotToken()

  const response = await fetch(`${TELEGRAM_API}${BOT_TOKEN}/getMe`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`获取 Bot 信息失败: ${error.description}`)
  }

  const result = await response.json()
  return result.result
}
