/**
 * Telegram Webhook 接收端点
 * 处理来自 Telegram Bot 的消息和命令
 */

import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { telegramBindings } from '@/lib/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { sendTelegramMessage } from '@/lib/telegram/bot'
import {
  sendBindingSuccessNotification,
  sendWelcomeMessage,
} from '@/lib/telegram/notifications'

/**
 * POST /api/telegram/webhook
 * 接收 Telegram Bot 消息
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Telegram Update 对象结构
    const { message, callback_query } = body

    // 处理普通消息
    if (message) {
      await handleMessage(message)
    }

    // 处理回调查询 (按钮点击)
    if (callback_query) {
      await handleCallbackQuery(callback_query)
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('❌ Telegram webhook 处理失败:', error)
    return Response.json({ ok: false }, { status: 500 })
  }
}

/**
 * 处理 Telegram 消息
 */
async function handleMessage(message: any) {
  const chatId = message.chat.id.toString()
  const text = message.text || ''
  const from = message.from

  // 处理 /start 命令
  if (text.startsWith('/start')) {
    const parts = text.split(' ')

    // 有验证码: /start 123456
    if (parts.length > 1) {
      const verificationCode = parts[1]
      await handleVerification(chatId, verificationCode, from)
    } else {
      // 无验证码: 只是打开 bot
      await sendWelcomeMessage(chatId)
    }
    return
  }

  // 处理 /help 命令
  if (text === '/help') {
    await sendHelpMessage(chatId)
    return
  }

  // 处理 /status 命令
  if (text === '/status') {
    await sendStatusMessage(chatId)
    return
  }

  // 处理 /unbind 命令
  if (text === '/unbind') {
    await handleUnbind(chatId)
    return
  }

  // 处理纯数字 (可能是验证码)
  if (/^\d{6}$/.test(text.trim())) {
    await handleVerification(chatId, text.trim(), from)
    return
  }

  // 未知消息
  await sendTelegramMessage({
    chat_id: chatId,
    text: `😺 浮浮酱收到了你的消息喵~\n\n使用 /help 查看可用命令`,
    parse_mode: 'Markdown',
  })
}

/**
 * 处理验证码绑定
 */
async function handleVerification(
  chatId: string,
  verificationCode: string,
  from: any
) {
  try {
    // 查找匹配的待验证绑定记录
    const binding = await db.query.telegramBindings.findFirst({
      where: and(
        eq(telegramBindings.verificationToken, verificationCode),
        eq(telegramBindings.isVerified, false),
        gt(telegramBindings.tokenExpiresAt, new Date()) // 未过期
      ),
    })

    if (!binding) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: `❌ 验证码无效或已过期喵~\n\n请在网站上重新生成验证码`,
        parse_mode: 'Markdown',
      })
      return
    }

    // 检查这个 chatId 是否已被其他用户绑定
    const existingChatBinding = await db.query.telegramBindings.findFirst({
      where: and(
        eq(telegramBindings.chatId, chatId),
        eq(telegramBindings.isVerified, true)
      ),
    })

    if (existingChatBinding && existingChatBinding.userId !== binding.userId) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: `❌ 此 Telegram 账号已绑定其他用户喵~\n\n请先解除原绑定或使用其他账号`,
        parse_mode: 'Markdown',
      })
      return
    }

    // 更新绑定记录
    await db
      .update(telegramBindings)
      .set({
        chatId,
        username: from.username || null,
        firstName: from.first_name || null,
        lastName: from.last_name || null,
        isVerified: true,
        verificationToken: null, // 清除验证码
        tokenExpiresAt: null,
        lastActiveAt: new Date(),
      })
      .where(eq(telegramBindings.id, binding.id))

    // 发送绑定成功通知
    await sendBindingSuccessNotification(chatId, {
      firstName: from.first_name || 'User',
    })

    console.log(
      `✅ Telegram 绑定成功: userId=${binding.userId}, chatId=${chatId}`
    )
  } catch (error) {
    console.error('❌ 处理验证码失败:', error)
    await sendTelegramMessage({
      chat_id: chatId,
      text: `❌ 绑定失败喵~ 请稍后重试或联系客服`,
      parse_mode: 'Markdown',
    })
  }
}

/**
 * 处理解绑命令
 */
async function handleUnbind(chatId: string) {
  try {
    const binding = await db.query.telegramBindings.findFirst({
      where: and(
        eq(telegramBindings.chatId, chatId),
        eq(telegramBindings.isVerified, true)
      ),
    })

    if (!binding) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: `ℹ️ 你还没有绑定任何账号喵~`,
        parse_mode: 'Markdown',
      })
      return
    }

    // 删除绑定记录
    await db
      .delete(telegramBindings)
      .where(eq(telegramBindings.id, binding.id))

    await sendTelegramMessage({
      chat_id: chatId,
      text: `✅ 已解除绑定喵~\n\n你可以随时重新绑定账号`,
      parse_mode: 'Markdown',
    })

    console.log(`✅ Telegram 解绑成功: userId=${binding.userId}, chatId=${chatId}`)
  } catch (error) {
    console.error('❌ 解绑失败:', error)
    await sendTelegramMessage({
      chat_id: chatId,
      text: `❌ 解绑失败喵~ 请稍后重试`,
      parse_mode: 'Markdown',
    })
  }
}

/**
 * 发送帮助信息
 */
async function sendHelpMessage(chatId: string) {
  const helpText = `
📖 *PulseFeedX 帮助*

*可用命令:*
• \`/start <验证码>\` - 绑定账号
• \`/status\` - 查看绑定状态
• \`/unbind\` - 解除绑定
• \`/help\` - 显示此帮助

*如何绑定:*
1. 在网站上生成验证码
2. 发送 \`/start 你的验证码\`
3. 绑定成功后即可接收推送

*需要帮助?*
访问网站或联系客服喵~
  `.trim()

  await sendTelegramMessage({
    chat_id: chatId,
    text: helpText,
    parse_mode: 'Markdown',
  })
}

/**
 * 发送状态信息
 */
async function sendStatusMessage(chatId: string) {
  try {
    const binding = await db.query.telegramBindings.findFirst({
      where: and(
        eq(telegramBindings.chatId, chatId),
        eq(telegramBindings.isVerified, true)
      ),
    })

    if (!binding) {
      await sendTelegramMessage({
        chat_id: chatId,
        text: `❌ *未绑定*\n\n你还没有绑定账号喵~\n\n使用 \`/start <验证码>\` 进行绑定`,
        parse_mode: 'Markdown',
      })
      return
    }

    const statusText = `
✅ *已绑定*

👤 用户ID: \`${binding.userId}\`
🔔 通知状态: ${binding.notificationEnabled ? '✅ 已启用' : '❌ 已禁用'}
📅 绑定时间: ${binding.createdAt.toLocaleDateString('zh-CN')}
⏰ 最后活跃: ${binding.lastActiveAt ? binding.lastActiveAt.toLocaleDateString('zh-CN') : '未知'}

${binding.muteUntil && binding.muteUntil > new Date() ? `🔕 免打扰至: ${binding.muteUntil.toLocaleString('zh-CN')}` : ''}

_使用 /help 查看更多命令_
    `.trim()

    await sendTelegramMessage({
      chat_id: chatId,
      text: statusText,
      parse_mode: 'Markdown',
    })
  } catch (error) {
    console.error('❌ 获取状态失败:', error)
    await sendTelegramMessage({
      chat_id: chatId,
      text: `❌ 获取状态失败喵~ 请稍后重试`,
      parse_mode: 'Markdown',
    })
  }
}

/**
 * 处理回调查询 (按钮点击)
 */
async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id.toString()
  const data = callbackQuery.data

  // 处理不同的回调数据
  if (data === 'view_rules') {
    // 跳转到网站查看规则
    await sendTelegramMessage({
      chat_id: chatId,
      text: `🔍 请访问网站管理你的监控规则喵~`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🌐 打开网站',
              url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            },
          ],
        ],
      },
    })
  } else if (data === 'view_hit') {
    // 查看命中记录
    await sendTelegramMessage({
      chat_id: chatId,
      text: `📊 请访问网站查看完整的命中记录喵~`,
      parse_mode: 'Markdown',
    })
  }

  // 确认回调查询 (移除加载状态)
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQuery.id,
      }),
    }
  )
}
