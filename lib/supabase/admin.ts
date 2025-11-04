/**
 * Supabase 管理员客户端
 * 用于服务端需要完全权限的操作 (Edge Functions, API Routes)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Supabase 管理员配置缺失')
}

/**
 * 创建 Supabase 管理员客户端
 * 警告: 此客户端拥有完全权限，绕过 RLS，仅用于服务端
 */
export function createAdminClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase 管理员配置缺失')
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// 默认导出管理员客户端实例
export const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey ? createAdminClient() : null
