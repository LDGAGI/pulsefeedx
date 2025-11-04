/**
 * 设置 Telegram Webhook
 * 运行此脚本来配置 Telegram Bot 的 Webhook URL
 *
 * 用法:
 * - 开发环境: pnpm tsx scripts/setup-telegram-webhook.ts
 * - 生产环境: pnpm tsx scripts/setup-telegram-webhook.ts --production
 */

import * as dotenv from 'dotenv'
import {
  setWebhook,
  deleteWebhook,
  getWebhookInfo,
  getBotInfo,
} from '../lib/telegram/bot'

// 加载环境变量
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const isProduction = process.argv.includes('--production')
const shouldDelete = process.argv.includes('--delete')

async function main() {
  console.log('🤖 Telegram Webhook 设置工具\n')

  // 检查环境变量
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ 错误: TELEGRAM_BOT_TOKEN 环境变量未设置')
    process.exit(1)
  }

  // 获取 Bot 信息
  console.log('📡 获取 Bot 信息...')
  const botInfo = await getBotInfo()
  if (botInfo) {
    console.log(`✅ Bot: @${botInfo.username}`)
    console.log(`   ID: ${botInfo.id}`)
    console.log(`   名称: ${botInfo.first_name}\n`)
  }

  // 删除 Webhook
  if (shouldDelete) {
    console.log('🗑️  删除现有 Webhook...')
    const deleted = await deleteWebhook()
    if (deleted) {
      console.log('✅ Webhook 已删除')
      console.log('💡 提示: Bot 现在处于轮询模式,适合本地调试\n')
    }
    return
  }

  // 确定 Webhook URL
  let webhookUrl: string

  if (isProduction) {
    // 生产环境: 使用配置的应用 URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) {
      console.error('❌ 错误: NEXT_PUBLIC_APP_URL 环境变量未设置')
      process.exit(1)
    }
    webhookUrl = `${appUrl}/api/telegram/webhook`
  } else {
    // 开发环境: 使用 ngrok 或其他隧道服务
    console.log('⚠️  开发环境模式')
    console.log('💡 你需要使用隧道服务 (如 ngrok) 来暴露本地服务器\n')
    console.log('示例:')
    console.log('  1. 运行: ngrok http 3000')
    console.log('  2. 复制 ngrok 提供的 HTTPS URL')
    console.log('  3. 设置环境变量: TELEGRAM_WEBHOOK_URL="https://xxxxx.ngrok.io"\n')

    webhookUrl =
      process.env.TELEGRAM_WEBHOOK_URL ||
      process.env.NEXT_PUBLIC_APP_URL + '/api/telegram/webhook'

    if (!webhookUrl.startsWith('https://')) {
      console.error('❌ 错误: Webhook URL 必须是 HTTPS')
      console.log(
        '💡 提示: 请使用 ngrok 或其他隧道服务,并设置 TELEGRAM_WEBHOOK_URL 环境变量'
      )
      process.exit(1)
    }
  }

  console.log(`🔗 Webhook URL: ${webhookUrl}`)

  // 设置 Webhook
  console.log('\n📤 设置 Webhook...')
  const success = await setWebhook(webhookUrl)

  if (success) {
    console.log('✅ Webhook 设置成功!\n')

    // 验证 Webhook 状态
    console.log('🔍 验证 Webhook 状态...')
    const info = await getWebhookInfo()
    if (info) {
      console.log(`✅ Webhook URL: ${info.url}`)
      console.log(`   待处理消息: ${info.pending_update_count}`)
      if (info.last_error_date) {
        console.log(`   ⚠️  上次错误时间: ${new Date(info.last_error_date * 1000).toLocaleString()}`)
        console.log(`   ⚠️  错误信息: ${info.last_error_message}`)
      }
    }

    console.log('\n🎉 完成! 现在 Telegram Bot 已配置完成')
    console.log('💡 下一步:')
    console.log('   1. 在 Telegram 中搜索你的 Bot')
    console.log('   2. 发送 /start 测试连接')
    console.log('   3. 在网站上生成验证码并完成绑定\n')
  } else {
    console.error('❌ Webhook 设置失败')
    console.log('💡 请检查:')
    console.log('   1. TELEGRAM_BOT_TOKEN 是否正确')
    console.log('   2. Webhook URL 是否可访问 (必须是 HTTPS)')
    console.log('   3. 服务器是否正在运行\n')
    process.exit(1)
  }
}

// 错误处理
main().catch((error) => {
  console.error('\n❌ 发生错误:', error.message)
  process.exit(1)
})
