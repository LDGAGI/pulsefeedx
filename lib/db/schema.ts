import { pgTable, text, timestamp, boolean, integer, varchar, index } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  // total available credits for the user
  credits: integer("credits").default(0).notNull(),
  // user role: 'admin' | 'user'
  role: text("role").default("user").notNull(),
  // current subscription plan
  planKey: text("plan_key").default("free"),
  // ban status
  banned: boolean("banned").default(false).notNull(),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Payment records (one-time purchases and subscription renewals)
export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  provider: varchar("provider", { length: 32 }).default("creem").notNull(),
  providerPaymentId: text("provider_payment_id").notNull().unique(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 8 }).default("usd").notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  type: varchar("type", { length: 32 }).notNull(), // 'one_time' | 'subscription'
  planKey: varchar("plan_key", { length: 64 }),
  creditsGranted: integer("credits_granted").default(0).notNull(),
  raw: text("raw"), // store provider payload as JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Active subscriptions
export const subscription = pgTable("subscription", {
  id: text("id").primaryKey(),
  provider: varchar("provider", { length: 32 }).default("creem").notNull(),
  providerSubId: text("provider_sub_id").notNull().unique(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  planKey: varchar("plan_key", { length: 64 }).notNull(),
  status: varchar("status", { length: 32 }).notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  raw: text("raw"), // store provider payload as JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Credit ledger for auditability
export const creditLedger = pgTable("credit_ledger", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  delta: integer("delta").notNull(),
  reason: varchar("reason", { length: 64 }).notNull(), // 'subscription_cycle' | 'one_time_pack' | 'adjustment' | 'chat_usage' | ...
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptionCreditSchedule = pgTable(
  "subscription_credit_schedule",
  {
    id: text("id").primaryKey(),
    subscriptionId: text("subscription_id")
      .notNull()
      .references(() => subscription.id, { onDelete: "cascade" })
      .unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    planKey: varchar("plan_key", { length: 64 }).notNull(),
    creditsPerGrant: integer("credits_per_grant").notNull(),
    intervalMonths: integer("interval_months").notNull(),
    grantsRemaining: integer("grants_remaining").notNull(),
    totalCreditsRemaining: integer("total_credits_remaining").notNull(),
    nextGrantAt: timestamp("next_grant_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => ({
    nextGrantIdx: index("subscription_credit_schedule_next_grant_idx").on(table.nextGrantAt),
  }),
);

// Chat sessions
export const chatSession = pgTable("chat_session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  model: varchar("model", { length: 48 }).default("doubao-1-5-thinking-pro-250415").notNull(),
  totalMessages: integer("total_messages").default(0).notNull(),
  totalCreditsUsed: integer("total_credits_used").default(0).notNull(),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Chat messages
export const chatMessage = pgTable("chat_message", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => chatSession.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 16 }).notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  creditsUsed: integer("credits_used").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Generation history for images and videos
export const generationHistory = pgTable("generation_history", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 16 }).notNull(), // 'image' | 'video'
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url"), // For image-to-video generation
  resultUrl: text("result_url"), // Final result URL
  taskId: text("task_id"), // For async video generation tracking
  status: varchar("status", { length: 16 }).notNull().default("pending"), // pending, processing, completed, failed
  creditsUsed: integer("credits_used").default(0).notNull(),
  metadata: text("metadata"), // JSON string for additional data
  error: text("error"), // Error message if failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// Password reset tokens
export const passwordResetToken = pgTable("password_reset_token", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Newsletter subscriptions
export const newsletterSubscription = pgTable("newsletter_subscription", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  status: varchar("status", { length: 16 }).notNull().default("active"), // active, unsubscribed
  unsubscribeToken: text("unsubscribe_token").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

// ====================================
// PulseFeedX - Twitter 监控系统
// ====================================

// Monitor rules - 监控规则表
export const monitorRules = pgTable(
  "monitor_rules",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // 规则配置
    type: varchar("type", { length: 16 }).notNull(), // 'keyword' | 'account' | 'advanced'
    value: text("value").notNull(), // 关键词、账号名或高级查询语法
    name: text("name"), // 用户自定义规则名称
    description: text("description"), // 规则描述

    // 检查配置
    isActive: boolean("is_active").default(true).notNull(),
    checkInterval: integer("check_interval").default(300).notNull(), // 秒，默认5分钟
    lastCheckedAt: timestamp("last_checked_at"), // 上次检查时间

    // 积分配置
    creditsPerCheck: integer("credits_per_check").default(1).notNull(),

    // 高级过滤 (可选)
    minFollowers: integer("min_followers"), // 最小粉丝数过滤
    includeReplies: boolean("include_replies").default(false), // 是否包含回复

    // 时间戳
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("monitor_rules_user_id_idx").on(table.userId),
    activeIdx: index("monitor_rules_active_idx").on(table.isActive, table.lastCheckedAt),
  })
);

// Monitor hits - 命中记录表
export const monitorHits = pgTable(
  "monitor_hits",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ruleId: text("rule_id")
      .notNull()
      .references(() => monitorRules.id, { onDelete: "cascade" }),

    // 推文信息
    tweetId: text("tweet_id").notNull().unique(), // 防止重复记录
    tweetText: text("tweet_text").notNull(),
    tweetAuthor: text("tweet_author").notNull(),
    tweetAuthorId: text("tweet_author_id"),
    tweetUrl: text("tweet_url").notNull(),
    tweetCreatedAt: timestamp("tweet_created_at"),

    // 推文统计
    likeCount: integer("like_count").default(0),
    retweetCount: integer("retweet_count").default(0),
    replyCount: integer("reply_count").default(0),

    // 匹配信息
    matchedKeyword: text("matched_keyword"), // 实际匹配的关键词
    matchedAt: timestamp("matched_at").defaultNow().notNull(),

    // 通知状态
    notifiedAt: timestamp("notified_at"),
    notificationStatus: varchar("notification_status", { length: 16 })
      .default("pending")
      .notNull(), // 'pending' | 'sent' | 'failed'
    notificationError: text("notification_error"), // 失败原因
  },
  (table) => ({
    userIdIdx: index("monitor_hits_user_id_idx").on(table.userId),
    ruleIdIdx: index("monitor_hits_rule_id_idx").on(table.ruleId),
    tweetIdIdx: index("monitor_hits_tweet_id_idx").on(table.tweetId),
    matchedAtIdx: index("monitor_hits_matched_at_idx").on(table.matchedAt),
  })
);

// Telegram bindings - Telegram 绑定表
export const telegramBindings = pgTable("telegram_bindings", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  // Telegram 信息
  chatId: text("chat_id").notNull().unique(),
  username: text("username"), // Telegram 用户名 (可选)
  firstName: text("first_name"),
  lastName: text("last_name"),

  // 绑定状态
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: text("verification_token"), // 6位验证码
  tokenExpiresAt: timestamp("token_expires_at"),

  // 通知偏好
  muteUntil: timestamp("mute_until"), // 静音到某个时间
  notificationEnabled: boolean("notification_enabled").default(true).notNull(),

  // 时间戳
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at"),
});
