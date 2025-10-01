-- CreateEnum
CREATE TYPE "public"."ChatType" AS ENUM ('user_chat', 'group_chat', 'channel_chat', 'bot_chat');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "bio" TEXT,
    "socketId" TEXT NOT NULL,
    "public_url" TEXT,
    "private_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."avatars" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "avatars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_files" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_files" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "group_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."channel_files" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "channel_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_chat_fiels" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "user_chat_fiels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_chat" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "type" "public"."ChatType" NOT NULL DEFAULT 'group_chat',
    "title" TEXT,
    "description" TEXT,
    "public_url" TEXT,
    "private_url" TEXT,
    "subscritions_count" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."channel_chat" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "subscritions_count" BIGINT NOT NULL DEFAULT 0,
    "type" "public"."ChatType" NOT NULL DEFAULT 'channel_chat',
    "title" TEXT,
    "description" TEXT,
    "public_url" TEXT,
    "private_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_chat" (
    "id" TEXT NOT NULL,
    "user_1_id" TEXT NOT NULL,
    "user_2_id" TEXT NOT NULL,
    "type" "public"."ChatType" NOT NULL DEFAULT 'user_chat',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages_channel" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "m_detailes_id" TEXT NOT NULL,
    "is_updated" BOOLEAN NOT NULL DEFAULT false,
    "is_reading" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages_group" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "m_detailes_id" TEXT NOT NULL,
    "is_updated" BOOLEAN NOT NULL DEFAULT false,
    "is_reading" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages_user_chat" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "replay_id" TEXT,
    "m_detailes_id" TEXT NOT NULL,
    "is_updated" BOOLEAN NOT NULL DEFAULT false,
    "is_reading" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_user_chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."message_detailes" (
    "id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "text" TEXT,
    "images" JSONB,
    "videos" JSONB,
    "docs" JSONB,
    "files" JSONB,
    "stikers" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_detailes_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "users_socketId_key" ON "public"."users"("socketId");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "users_is_bot_idx" ON "public"."users"("is_bot");

-- CreateIndex
CREATE INDEX "group_chat_owner_id_idx" ON "public"."group_chat"("owner_id");

-- CreateIndex
CREATE INDEX "group_chat_type_idx" ON "public"."group_chat"("type");

-- CreateIndex
CREATE INDEX "group_chat_created_at_idx" ON "public"."group_chat"("created_at");

-- CreateIndex
CREATE INDEX "group_chat_title_idx" ON "public"."group_chat"("title");

-- CreateIndex
CREATE INDEX "channel_chat_owner_id_idx" ON "public"."channel_chat"("owner_id");

-- CreateIndex
CREATE INDEX "channel_chat_type_idx" ON "public"."channel_chat"("type");

-- CreateIndex
CREATE INDEX "channel_chat_created_at_idx" ON "public"."channel_chat"("created_at");

-- CreateIndex
CREATE INDEX "channel_chat_title_idx" ON "public"."channel_chat"("title");

-- CreateIndex
CREATE INDEX "user_chat_user_1_id_idx" ON "public"."user_chat"("user_1_id");

-- CreateIndex
CREATE INDEX "user_chat_user_2_id_idx" ON "public"."user_chat"("user_2_id");

-- CreateIndex
CREATE INDEX "user_chat_user_1_id_user_2_id_idx" ON "public"."user_chat"("user_1_id", "user_2_id");

-- CreateIndex
CREATE INDEX "user_chat_type_idx" ON "public"."user_chat"("type");

-- CreateIndex
CREATE INDEX "messages_channel_chat_id_idx" ON "public"."messages_channel"("chat_id");

-- CreateIndex
CREATE INDEX "messages_channel_replay_id_idx" ON "public"."messages_channel"("replay_id");

-- CreateIndex
CREATE INDEX "messages_channel_m_detailes_id_idx" ON "public"."messages_channel"("m_detailes_id");

-- CreateIndex
CREATE INDEX "messages_channel_chat_id_m_detailes_id_idx" ON "public"."messages_channel"("chat_id", "m_detailes_id");

-- CreateIndex
CREATE INDEX "messages_group_chat_id_idx" ON "public"."messages_group"("chat_id");

-- CreateIndex
CREATE INDEX "messages_group_replay_id_idx" ON "public"."messages_group"("replay_id");

-- CreateIndex
CREATE INDEX "messages_group_m_detailes_id_idx" ON "public"."messages_group"("m_detailes_id");

-- CreateIndex
CREATE INDEX "messages_group_chat_id_m_detailes_id_idx" ON "public"."messages_group"("chat_id", "m_detailes_id");

-- CreateIndex
CREATE INDEX "messages_user_chat_chat_id_idx" ON "public"."messages_user_chat"("chat_id");

-- CreateIndex
CREATE INDEX "messages_user_chat_replay_id_idx" ON "public"."messages_user_chat"("replay_id");

-- CreateIndex
CREATE INDEX "messages_user_chat_m_detailes_id_idx" ON "public"."messages_user_chat"("m_detailes_id");

-- CreateIndex
CREATE INDEX "messages_user_chat_chat_id_m_detailes_id_idx" ON "public"."messages_user_chat"("chat_id", "m_detailes_id");

-- CreateIndex
CREATE INDEX "message_detailes_sender_id_idx" ON "public"."message_detailes"("sender_id");

-- CreateIndex
CREATE INDEX "message_detailes_created_at_idx" ON "public"."message_detailes"("created_at");

-- CreateIndex
CREATE INDEX "message_detailes_sender_id_created_at_idx" ON "public"."message_detailes"("sender_id", "created_at");

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
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."avatars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."avatars" ADD CONSTRAINT "avatars_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_files" ADD CONSTRAINT "group_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."chat_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_files" ADD CONSTRAINT "group_files_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_files" ADD CONSTRAINT "channel_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."chat_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_files" ADD CONSTRAINT "channel_files_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_chat_fiels" ADD CONSTRAINT "user_chat_fiels_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."chat_files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_chat_fiels" ADD CONSTRAINT "user_chat_fiels_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."messages_user_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_chat" ADD CONSTRAINT "group_chat_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_chat" ADD CONSTRAINT "channel_chat_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_chat" ADD CONSTRAINT "user_chat_user_1_id_fkey" FOREIGN KEY ("user_1_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_chat" ADD CONSTRAINT "user_chat_user_2_id_fkey" FOREIGN KEY ("user_2_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_channel" ADD CONSTRAINT "messages_channel_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."channel_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_channel" ADD CONSTRAINT "messages_channel_replay_id_fkey" FOREIGN KEY ("replay_id") REFERENCES "public"."messages_channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_channel" ADD CONSTRAINT "messages_channel_m_detailes_id_fkey" FOREIGN KEY ("m_detailes_id") REFERENCES "public"."message_detailes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_group" ADD CONSTRAINT "messages_group_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."group_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_group" ADD CONSTRAINT "messages_group_replay_id_fkey" FOREIGN KEY ("replay_id") REFERENCES "public"."messages_group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_group" ADD CONSTRAINT "messages_group_m_detailes_id_fkey" FOREIGN KEY ("m_detailes_id") REFERENCES "public"."message_detailes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_user_chat" ADD CONSTRAINT "messages_user_chat_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."user_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_user_chat" ADD CONSTRAINT "messages_user_chat_replay_id_fkey" FOREIGN KEY ("replay_id") REFERENCES "public"."messages_user_chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages_user_chat" ADD CONSTRAINT "messages_user_chat_m_detailes_id_fkey" FOREIGN KEY ("m_detailes_id") REFERENCES "public"."message_detailes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message_detailes" ADD CONSTRAINT "message_detailes_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bot_detailes" ADD CONSTRAINT "bot_detailes_parrent_id_fkey" FOREIGN KEY ("parrent_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bot_detailes" ADD CONSTRAINT "bot_detailes_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_subscribtions" ADD CONSTRAINT "channel_subscribtions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."channel_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."channel_subscribtions" ADD CONSTRAINT "channel_subscribtions_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_subscribtions" ADD CONSTRAINT "group_subscribtions_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."group_chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."group_subscribtions" ADD CONSTRAINT "group_subscribtions_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bot_subscribtions" ADD CONSTRAINT "bot_subscribtions_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
