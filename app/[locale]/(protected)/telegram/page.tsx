/**
 * Telegram 绑定页面
 * 用户可以生成验证码并绑定 Telegram 账号
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

interface BindingInfo {
  username?: string
  firstName?: string
  lastName?: string
  notificationEnabled: boolean
  createdAt: string
}

interface BindingStatus {
  isBound: boolean
  binding: BindingInfo | null
}

export default function TelegramBindingPage() {
  const t = useTranslations()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [unbinding, setUnbinding] = useState(false)
  const [bindingStatus, setBindingStatus] = useState<BindingStatus>({
    isBound: false,
    binding: null,
  })
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)

  // 加载绑定状态
  useEffect(() => {
    loadBindingStatus()
  }, [])

  const loadBindingStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/telegram/bind')
      const data = await response.json()

      if (response.ok) {
        setBindingStatus(data)
      }
    } catch (error) {
      console.error('加载绑定状态失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateVerificationCode = async () => {
    try {
      setGenerating(true)
      const response = await fetch('/api/telegram/bind', {
        method: 'POST',
      })
      const data = await response.json()

      if (response.ok && data.success) {
        setVerificationCode(data.verificationToken)
        setExpiresAt(data.expiresAt)
      } else {
        alert('生成验证码失败: ' + (data.error || '未知错误'))
      }
    } catch (error) {
      console.error('生成验证码失败:', error)
      alert('生成验证码失败,请稍后重试')
    } finally {
      setGenerating(false)
    }
  }

  const unbindTelegram = async () => {
    if (!confirm('确定要解除 Telegram 绑定吗?')) {
      return
    }

    try {
      setUnbinding(true)
      const response = await fetch('/api/telegram/bind', {
        method: 'DELETE',
      })
      const data = await response.json()

      if (response.ok && data.success) {
        alert('已成功解除绑定')
        setVerificationCode(null)
        setExpiresAt(null)
        await loadBindingStatus()
      } else {
        alert('解除绑定失败: ' + (data.error || '未知错误'))
      }
    } catch (error) {
      console.error('解除绑定失败:', error)
      alert('解除绑定失败,请稍后重试')
    } finally {
      setUnbinding(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('已复制到剪贴板')
  }

  const getBotUsername = () => {
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
    if (!botToken) return 'your_bot'
    return botToken.split(':')[0] // 从 token 中提取 bot username (简化处理)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold">Telegram 通知</h1>
          <p className="text-muted-foreground mt-2">
            绑定 Telegram 账号,实时接收监控命中推送
          </p>
        </div>

        {/* 绑定状态卡片 */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">绑定状态</h2>
              {bindingStatus.isBound ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  ✅ 已绑定
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                  ❌ 未绑定
                </span>
              )}
            </div>

            {bindingStatus.isBound && bindingStatus.binding && (
              <div className="space-y-2 text-sm">
                {bindingStatus.binding.username && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">用户名:</span>
                    <span className="font-medium">
                      @{bindingStatus.binding.username}
                    </span>
                  </div>
                )}
                {bindingStatus.binding.firstName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">姓名:</span>
                    <span className="font-medium">
                      {bindingStatus.binding.firstName}{' '}
                      {bindingStatus.binding.lastName || ''}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">通知状态:</span>
                  <span className="font-medium">
                    {bindingStatus.binding.notificationEnabled
                      ? '✅ 已启用'
                      : '❌ 已禁用'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">绑定时间:</span>
                  <span className="font-medium">
                    {new Date(
                      bindingStatus.binding.createdAt
                    ).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 未绑定时显示绑定引导 */}
        {!bindingStatus.isBound && (
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">如何绑定?</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium">生成验证码</p>
                    <p className="text-muted-foreground">
                      点击下方按钮生成 6 位数字验证码
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium">打开 Telegram Bot</p>
                    <p className="text-muted-foreground">
                      在 Telegram 中搜索并打开我们的 Bot
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium">发送验证码</p>
                    <p className="text-muted-foreground">
                      发送 <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">/start 你的验证码</code> 或直接发送验证码
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-medium">完成绑定</p>
                    <p className="text-muted-foreground">
                      Bot 会确认绑定成功,之后你就能收到实时推送了!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  onClick={generateVerificationCode}
                  disabled={generating}
                  className="flex-1"
                >
                  {generating ? '生成中...' : '🔑 生成验证码'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    window.open('https://t.me/' + getBotUsername(), '_blank')
                  }
                >
                  📱 打开 Bot
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* 验证码显示卡片 */}
        {verificationCode && (
          <Card className="p-6 border-primary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">你的验证码</h2>
                <span className="text-xs text-muted-foreground">
                  ⏰ 10 分钟内有效
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold tracking-wider">
                    {verificationCode}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(verificationCode)}
                >
                  📋 复制
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  📝 下一步:
                </p>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>打开 Telegram 并找到我们的 Bot</li>
                  <li>发送 <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">/start {verificationCode}</code></li>
                  <li>或直接发送验证码 <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">{verificationCode}</code></li>
                  <li>等待 Bot 确认绑定成功</li>
                </ol>
              </div>
            </div>
          </Card>
        )}

        {/* 已绑定时显示管理选项 */}
        {bindingStatus.isBound && (
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">管理绑定</h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open('https://t.me/' + getBotUsername(), '_blank')
                  }
                  className="w-full"
                >
                  📱 打开 Telegram Bot
                </Button>

                <Button
                  variant="outline"
                  onClick={generateVerificationCode}
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? '生成中...' : '🔄 重新生成验证码'}
                </Button>

                <Button
                  variant="destructive"
                  onClick={unbindTelegram}
                  disabled={unbinding}
                  className="w-full"
                >
                  {unbinding ? '解绑中...' : '🗑️ 解除绑定'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                解除绑定后,你将不再收到 Telegram 推送通知
              </p>
            </div>
          </Card>
        )}

        {/* 帮助信息 */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-3">
            <h3 className="font-semibold">💡 常见问题</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <details>
                <summary className="cursor-pointer font-medium text-foreground">
                  验证码输入后没反应?
                </summary>
                <p className="mt-1 pl-4">
                  请确保验证码正确且未过期 (10 分钟有效期)。如果仍有问题,请重新生成验证码。
                </p>
              </details>

              <details>
                <summary className="cursor-pointer font-medium text-foreground">
                  收不到推送通知?
                </summary>
                <p className="mt-1 pl-4">
                  检查:
                  <br />
                  1. 绑定状态是否为"已绑定"
                  <br />
                  2. 通知状态是否为"已启用"
                  <br />
                  3. 你的监控规则是否已启用
                  <br />
                  4. 是否有足够的积分进行监控
                </p>
              </details>

              <details>
                <summary className="cursor-pointer font-medium text-foreground">
                  如何暂停推送?
                </summary>
                <p className="mt-1 pl-4">
                  在 Telegram 中向 Bot 发送 /mute 命令可以暂时关闭推送通知。发送 /unmute 恢复推送。
                </p>
              </details>

              <details>
                <summary className="cursor-pointer font-medium text-foreground">
                  一个 Telegram 账号可以绑定多个用户吗?
                </summary>
                <p className="mt-1 pl-4">
                  不可以。一个 Telegram 账号只能绑定一个用户账号,一个用户账号也只能绑定一个 Telegram 账号。
                </p>
              </details>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
