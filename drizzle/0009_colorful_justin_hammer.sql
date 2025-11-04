CREATE TABLE "monitor_hits" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"rule_id" text NOT NULL,
	"tweet_id" text NOT NULL,
	"tweet_text" text NOT NULL,
	"tweet_author" text NOT NULL,
	"tweet_author_id" text,
	"tweet_url" text NOT NULL,
	"tweet_created_at" timestamp,
	"like_count" integer DEFAULT 0,
	"retweet_count" integer DEFAULT 0,
	"reply_count" integer DEFAULT 0,
	"matched_keyword" text,
	"matched_at" timestamp DEFAULT now() NOT NULL,
	"notified_at" timestamp,
	"notification_status" varchar(16) DEFAULT 'pending' NOT NULL,
	"notification_error" text,
	CONSTRAINT "monitor_hits_tweet_id_unique" UNIQUE("tweet_id")
);
--> statement-breakpoint
CREATE TABLE "monitor_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" varchar(16) NOT NULL,
	"value" text NOT NULL,
	"name" text,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"check_interval" integer DEFAULT 300 NOT NULL,
	"last_checked_at" timestamp,
	"credits_per_check" integer DEFAULT 1 NOT NULL,
	"min_followers" integer,
	"include_replies" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_bindings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chat_id" text NOT NULL,
	"username" text,
	"first_name" text,
	"last_name" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_token" text,
	"token_expires_at" timestamp,
	"mute_until" timestamp,
	"notification_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_active_at" timestamp,
	CONSTRAINT "telegram_bindings_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "telegram_bindings_chat_id_unique" UNIQUE("chat_id")
);
--> statement-breakpoint
ALTER TABLE "monitor_hits" ADD CONSTRAINT "monitor_hits_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_hits" ADD CONSTRAINT "monitor_hits_rule_id_monitor_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."monitor_rules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_rules" ADD CONSTRAINT "monitor_rules_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telegram_bindings" ADD CONSTRAINT "telegram_bindings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "monitor_hits_user_id_idx" ON "monitor_hits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monitor_hits_rule_id_idx" ON "monitor_hits" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "monitor_hits_tweet_id_idx" ON "monitor_hits" USING btree ("tweet_id");--> statement-breakpoint
CREATE INDEX "monitor_hits_matched_at_idx" ON "monitor_hits" USING btree ("matched_at");--> statement-breakpoint
CREATE INDEX "monitor_rules_user_id_idx" ON "monitor_rules" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monitor_rules_active_idx" ON "monitor_rules" USING btree ("is_active","last_checked_at");