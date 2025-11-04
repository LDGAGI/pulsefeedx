# PulseFeedX MVP 设置指南

> 本指南将帮助你完成 PulseFeedX MVP 的完整配置 🚀

---

## 📋 前置检查

在开始之前,请确保已完成:

- ✅ Node.js 18+ 已安装
- ✅ pnpm 已安装 (`npm install -g pnpm`)
- ✅ Git 已安装
- ✅ 有一个 Telegram 账号
- ✅ 准备 $10-20 用于测试 (TwitterAPI.io 充值)

---

## 🔧 Step 1: 注册并配置 Supabase

### 1.1 创建 Supabase 项目

1. 访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息:
   - **项目名称**: pulsefeedx-mvp (或自定义)
   - **数据库密码**: 生成并保存一个强密码 ⚠️
   - **区域**: 选择离你最近的区域 (推荐: Northeast Asia - Tokyo)

4. 等待项目创建完成 (约 2 分钟)

### 1.2 获取 Supabase 配置

项目创建完成后:

1. 在项目主页,点击左侧 "Project Settings" → "API"
2. 复制以下信息:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (保密!)

3. 将 Supabase 的数据库连接字符串设置为 `DATABASE_URL`:
   - 点击 "Project Settings" → "Database"
   - 复制 "Connection string" → "URI" (选择 "Session pooling")
   - 格式: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`

### 1.3 更新 .env.local

```bash
# 复制示例环境变量文件
cp .env.example .env.local

# 编辑 .env.local,填入 Supabase 配置
```

```env
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # 保密!
```

---

## 🤖 Step 2: 注册 Telegram Bot

### 2.1 创建 Bot

1. 在 Telegram 中搜索 `@BotFather`
2. 发送命令: `/newbot`
3. 按照提示设置:
   - **Bot 名称**: PulseFeedX MVP (或自定义)
   - **Bot 用户名**: pulsefeedx_mvp_bot (必须以 `_bot` 或 `Bot` 结尾)

4. 创建成功后,BotFather 会返回 **Bot Token**:
   ```
   ✅ Done! Your new bot is @pulsefeedx_mvp_bot

   Use this token to access the HTTP API:
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

   Keep your token secure and store it safely, it can be used by anyone to control your bot.
   ```

5. **复制并保存这个 Token** ⚠️

### 2.2 配置 Bot 信息 (可选)

继续在 BotFather 中配置:

```
/setdescription @pulsefeedx_mvp_bot
描述: 你的 Twitter 信号雷达 🔍 实时监控关键词和账号

/setabouttext @pulsefeedx_mvp_bot
关于: 比别人快 10 秒看见 Twitter 上的重要信息

/setuserpic @pulsefeedx_mvp_bot
(上传一张图标,可选)
```

### 2.3 更新环境变量

在 `.env.local` 中添加:

```env
TELEGRAM_BOT_TOKEN="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
```

---

## 🐦 Step 3: 注册 TwitterAPI.io

### 3.1 创建账号

1. 访问 [https://twitterapi.io](https://twitterapi.io)
2. 点击 "Sign Up" 注册账号
3. 验证邮箱

### 3.2 获取 API Key

1. 登录后,访问 [Dashboard](https://twitterapi.io/dashboard)
2. 在首页可以看到你的 **API Key**
3. 复制这个 Key

### 3.3 充值测试额度

1. 点击 "Recharge" 或 "Add Credits"
2. 推荐充值 **$10 - $20** 用于 MVP 测试
3. 支持的支付方式: 信用卡、PayPal、加密货币

**成本估算 (10个用户,每人2个规则,5分钟检查一次)**:
- 每天约 $1
- 每月约 $30
- $10 可以测试约 10 天

### 3.4 更新环境变量

在 `.env.local` 中添加:

```env
TWITTER_API_KEY="your-twitter-api-key-here"
```

---

## 🔑 Step 4: 配置其他必需环境变量

### 4.1 Better Auth Secret

生成一个随机密钥:

```bash
openssl rand -base64 32
```

在 `.env.local` 中设置:

```env
BETTER_AUTH_SECRET="生成的随机密钥"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4.2 Supabase Webhook Secret

生成另一个随机密钥:

```bash
openssl rand -base64 32
```

在 `.env.local` 中设置:

```env
SUPABASE_WEBHOOK_SECRET="生成的随机密钥"
```

### 4.3 应用 URL

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📦 Step 5: 安装依赖并初始化数据库

### 5.1 安装依赖

```bash
pnpm install
```

### 5.2 安装 Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows
scoop install supabase

# Linux
brew install supabase/tap/supabase
```

### 5.3 链接到 Supabase 项目

```bash
# 登录 Supabase
supabase login

# 链接项目
supabase link --project-ref xxxxx  # 你的项目 ID,在 Supabase Dashboard 的 URL 中
```

### 5.4 推送数据库 Schema

```bash
# 生成 Drizzle 迁移文件
pnpm db:generate

# 推送到 Supabase
pnpm db:push

# 或者使用 Supabase CLI
supabase db push
```

### 5.5 验证数据库

在 Supabase Dashboard 中:
1. 点击左侧 "Table Editor"
2. 应该能看到新创建的表:
   - `monitor_rules`
   - `monitor_hits`
   - `telegram_bindings`

---

## 🚀 Step 6: 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000),如果看到首页说明配置成功! ✅

---

## ✅ 环境变量检查清单

在 `.env.local` 中,确保以下变量都已配置:

```env
# ✅ 数据库
DATABASE_URL="postgresql://..."

# ✅ Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
SUPABASE_WEBHOOK_SECRET="xxx"

# ✅ Better Auth
BETTER_AUTH_SECRET="xxx"
BETTER_AUTH_URL="http://localhost:3000"

# ✅ Twitter API
TWITTER_API_KEY="your-twitter-api-key"

# ✅ Telegram Bot
TELEGRAM_BOT_TOKEN="1234567890:ABC..."

# ✅ 应用 URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ✅ 现有的必需变量 (保持不变)
RESEND_API_KEY="re_..."  # 用于邮件功能
RESEND_FROM_EMAIL="Your App <noreply@yourdomain.com>"
```

---

## 🐛 常见问题

### Q1: Supabase 连接失败?

**A:** 检查:
1. `DATABASE_URL` 是否正确 (使用 "Session pooling" 版本)
2. 数据库密码是否包含特殊字符 (需要 URL 编码)
3. 网络是否正常

### Q2: Telegram Bot 无法响应?

**A:** 检查:
1. `TELEGRAM_BOT_TOKEN` 是否正确
2. Token 前后是否有多余的空格
3. Bot 是否被 BotFather 禁用

### Q3: Twitter API 返回错误?

**A:** 检查:
1. `TWITTER_API_KEY` 是否正确
2. 账户余额是否充足
3. 是否有频率限制

### Q4: 数据库迁移失败?

**A:** 尝试:
```bash
# 删除旧的迁移
rm -rf drizzle

# 重新生成
pnpm db:generate

# 直接推送 Schema (开发环境)
pnpm db:push
```

---

## 📝 下一步

配置完成后,你可以:

1. ✅ [创建第一个管理员账户](./README.md#admin-setup)
2. ✅ [部署 Supabase Edge Function](./docs/edge-functions.md)
3. ✅ [配置 Database Webhooks](./docs/webhooks.md)
4. ✅ [开始开发前端页面](./docs/frontend.md)

---

## 💡 提示

- 🔐 **安全**: `.env.local` 文件已在 `.gitignore` 中,不会被提交
- 💰 **成本**: MVP 测试阶段,建议先充值 $10,够用 7-10 天
- 🐛 **调试**: 使用 `console.log` 查看环境变量是否正确加载
- 📊 **监控**: 在 Supabase Dashboard 可以实时查看数据库状态

---

需要帮助?
- 📧 提 Issue: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Telegram: @your_support_channel

---

**Happy Coding! 🎉**
