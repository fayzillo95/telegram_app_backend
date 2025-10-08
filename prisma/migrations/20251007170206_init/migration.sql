-- CreateEnum
CREATE TYPE "public"."ChatType" AS ENUM ('user', 'group', 'channel', 'bot');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "lastActivaty" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "bio" TEXT,
    "public_url" TEXT,
    "private_url" TEXT,
    "userId" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "type" "public"."ChatType" NOT NULL DEFAULT 'group',
    "title" TEXT,
    "description" TEXT,
    "public_url" TEXT,
    "private_url" TEXT,
    "subscritions_count" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."channel" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "subscritions_count" BIGINT NOT NULL DEFAULT 0,
    "type" "public"."ChatType" NOT NULL DEFAULT 'channel',
    "title" TEXT,
    "description" TEXT,
    "public_url" TEXT,
    "private_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "user_1_id" TEXT NOT NULL,
    "user_2_id" TEXT NOT NULL,
    "type" "public"."ChatType" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages_channel" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "sender_id" TEXT NOT NULL,
    "text" TEXT,
    "images" JSONB,
    "videos" JSONB,
    "docs" JSONB,
    "files" JSONB,
    "stikers" JSONB,
    "is_updated" BOOLEAN NOT NULL DEFAULT false,
    "is_reading" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages_group" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "sender_id" TEXT NOT NULL,
    "text" TEXT,
    "images" JSONB,
    "videos" JSONB,
    "docs" JSONB,
    "files" JSONB,
    "stikers" JSONB,
    "is_updated" BOOLEAN NOT NULL DEFAULT false,
    "is_reading" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages_user" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "sender_id" TEXT NOT NULL,
    "text" TEXT,
    "images" JSONB,
    "videos" JSONB,
    "docs" JSONB,
    "files" JSONB,
    "stikers" JSONB,
    "is_updated" BOOLEAN NOT NULL DEFAULT false,
    "is_reading" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bot_detailes" (
    "id" TEXT NOT NULL,
    "parrent_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "bot_detailes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."channel_subscribtions" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,
    "isWrite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "channel_subscribtions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_subscribtions" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,

    CONSTRAINT "group_subscribtions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bot_subscribtions" (
    "id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "subscriber_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bot_subscribtions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_is_bot_idx" ON "public"."users"("is_bot");

-- CreateIndex
CREATE INDEX "group_owner_id_idx" ON "public"."group"("owner_id");

-- CreateIndex
CREATE INDEX "group_type_idx" ON "public"."group"("type");

-- CreateIndex
CREATE INDEX "group_created_at_idx" ON "public"."group"("created_at");

-- CreateIndex
CREATE INDEX "group_title_idx" ON "public"."group"("title");

-- CreateIndex
CREATE INDEX "channel_owner_id_idx" ON "public"."channel"("owner_id");

-- CreateIndex
CREATE INDEX "channel_type_idx" ON "public"."channel"("type");

-- CreateIndex
CREATE INDEX "channel_created_at_idx" ON "public"."channel"("created_at");

-- CreateIndex
CREATE INDEX "channel_title_idx" ON "public"."channel"("title");

-- CreateIndex
CREATE INDEX "user_user_1_id_idx" ON "public"."user"("user_1_id");

-- CreateIndex
CREATE INDEX "user_user_2_id_idx" ON "public"."user"("user_2_id");

-- CreateIndex
CREATE INDEX "user_user_1_id_user_2_id_idx" ON "public"."user"("user_1_id", "user_2_id");

-- CreateIndex
CREATE INDEX "user_type_idx" ON "public"."user"("type");

-- CreateIndex
CREATE INDEX "messages_channel_chat_id_idx" ON "public"."messages_channel"("chat_id");

-- CreateIndex
CREATE INDEX "messages_channel_replay_id_idx" ON "public"."messages_channel"("replay_id");

-- CreateIndex
CREATE INDEX "messages_channel_sender_id_idx" ON "public"."messages_channel"("sender_id");

-- CreateIndex
CREATE INDEX "messages_group_chat_id_idx" ON "public"."messages_group"("chat_id");

-- CreateIndex
CREATE INDEX "messages_group_replay_id_idx" ON "public"."messages_group"("replay_id");

-- CreateIndex
CREATE INDEX "messages_group_sender_id_idx" ON "public"."messages_group"("sender_id");

-- CreateIndex
CREATE INDEX "messages_user_chat_id_idx" ON "public"."messages_user"("chat_id");

-- CreateIndex
CREATE INDEX "messages_user_replay_id_idx" ON "public"."messages_user"("replay_id");

-- CreateIndex
CREATE INDEX "messages_user_sender_id_idx" ON "public"."messages_user"("sender_id");

-- CreateIndex
CREATE INDEX "channel_subscribtions_chat_id_idx" ON "public"."channel_subscribtions"("chat_id");

-- CreateIndex
CREATE INDEX "channel_subscribtions_subscriber_id_idx" ON "public"."channel_subscribtions"("subscriber_id");

-- CreateIndex
CREATE INDEX "channel_subscribtions_chat_id_subscriber_id_idx" ON "public"."channel_subscribtions"("chat_id", "subscriber_id");

-- CreateIndex
CREATE INDEX "group_subscribtions_chat_id_idx" ON "public"."group_subscribtions"("chat_id");

-- CreateIndex
CREATE INDEX "group_subscribtions_subscriber_id_idx" ON "public"."group_subscribtions"("subscriber_id");

-- CreateIndex
CREATE INDEX "group_subscribtions_chat_id_subscriber_id_idx" ON "public"."group_subscribtions"("chat_id", "subscriber_id");

-- CreateIndex
CREATE INDEX "bot_subscribtions_bot_id_idx" ON "public"."bot_subscribtions"("bot_id");

-- CreateIndex
CREATE INDEX "bot_subscribtions_subscriber_id_idx" ON "public"."bot_subscribtions"("subscriber_id");

-- CreateIndex
CREATE INDEX "bot_subscribtions_bot_id_subscriber_id_idx" ON "public"."bot_subscribtions"("bot_id", "subscriber_id");

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group" ADD CONSTRAINT "group_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel" ADD CONSTRAINT "channel_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_user_1_id_fkey" FOREIGN KEY ("user_1_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_user_2_id_fkey" FOREIGN KEY ("user_2_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_channel" ADD CONSTRAINT "messages_channel_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_channel" ADD CONSTRAINT "messages_channel_replay_id_fkey" FOREIGN KEY ("replay_id") REFERENCES "public"."messages_channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_channel" ADD CONSTRAINT "messages_channel_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_group" ADD CONSTRAINT "messages_group_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_group" ADD CONSTRAINT "messages_group_replay_id_fkey" FOREIGN KEY ("replay_id") REFERENCES "public"."messages_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_group" ADD CONSTRAINT "messages_group_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_user" ADD CONSTRAINT "messages_user_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_user" ADD CONSTRAINT "messages_user_replay_id_fkey" FOREIGN KEY ("replay_id") REFERENCES "public"."messages_user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_user" ADD CONSTRAINT "messages_user_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bot_detailes" ADD CONSTRAINT "bot_detailes_parrent_id_fkey" FOREIGN KEY ("parrent_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bot_detailes" ADD CONSTRAINT "bot_detailes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_subscribtions" ADD CONSTRAINT "channel_subscribtions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_subscribtions" ADD CONSTRAINT "channel_subscribtions_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_subscribtions" ADD CONSTRAINT "group_subscribtions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_subscribtions" ADD CONSTRAINT "group_subscribtions_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bot_subscribtions" ADD CONSTRAINT "bot_subscribtions_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
