/**
 * Telegram 绑定 API
 * 生成验证码供用户在 Telegram 中输入
 */

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { telegramBindings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cid'

/**
 * POST /api/telegram/bind
 * 生成 Telegram 绑定验证码
 */
export async function POST(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // 生成 6 位验证码
    const verificationToken = generateVerificationCode()
    const tokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 分钟有效期

    // 检查是否已有绑定记录
    const existingBinding = await db.query.telegramBindings.findFirst({
      where: eq(telegramBindings.userId, userId),
    })

    if (existingBinding) {
      // 更新验证码
      await db
        .update(telegramBindings)
        .set({
          verificationToken,
          tokenExpiresAt,
          isVerified: false, // 重置验证状态
        })
        .where(eq(telegramBindings.userId, userId))

      return Response.json({
        success: true,
        verificationToken,
        expiresAt: tokenExpiresAt.toISOString(),
        isExisting: true,
      })
    } else {
      // 创建新的绑定记录 (未完成状态)
      const newBinding = {
        id: createId(),
        userId,
        chatId: '', // 稍后在 webhook 中填入
        verificationToken,
        tokenExpiresAt,
        isVerified: false,
        notificationEnabled: true,
        createdAt: new Date(),
      }

      await db.insert(telegramBindings).values(newBinding)

      return Response.json({
        success: true,
        verificationToken,
        expiresAt: tokenExpiresAt.toISOString(),
        isExisting: false,
      })
    }
  } catch (error) {
    console.error('❌ 生成 Telegram 绑定验证码失败:', error)
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/telegram/bind
 * 获取当前绑定状态
 */
export async function GET(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // 查询绑定状态
    const binding = await db.query.telegramBindings.findFirst({
      where: eq(telegramBindings.userId, userId),
    })

    if (!binding) {
      return Response.json({
        isBound: false,
        binding: null,
      })
    }

    // 返回绑定信息 (隐藏敏感字段)
    return Response.json({
      isBound: binding.isVerified,
      binding: {
        username: binding.username,
        firstName: binding.firstName,
        lastName: binding.lastName,
        notificationEnabled: binding.notificationEnabled,
        createdAt: binding.createdAt,
      },
    })
  } catch (error) {
    console.error('❌ 获取 Telegram 绑定状态失败:', error)
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/telegram/bind
 * 解除 Telegram 绑定
 */
export async function DELETE(request: NextRequest) {
  try {
    // 获取当前用户
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // 删除绑定记录
    await db.delete(telegramBindings).where(eq(telegramBindings.userId, userId))

    return Response.json({
      success: true,
      message: 'Telegram 绑定已解除',
    })
  } catch (error) {
    console.error('❌ 解除 Telegram 绑定失败:', error)
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

/**
 * 生成 6 位数字验证码
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
