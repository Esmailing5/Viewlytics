-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('searched', 'tracked', 'archived');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('dominican_republic', 'latin_america', 'usa', 'unknown');

-- CreateTable
CREATE TABLE "creators" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "username" TEXT,
    "display_name" TEXT NOT NULL,
    "description" TEXT,
    "avatar_url" TEXT,
    "banner_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "region" "Region" NOT NULL DEFAULT 'unknown',
    "category" TEXT,
    "tracking_status" "TrackingStatus" NOT NULL DEFAULT 'searched',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_snapshots" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "subscribers" BIGINT NOT NULL DEFAULT 0,
    "total_views" BIGINT NOT NULL DEFAULT 0,
    "total_videos" INTEGER NOT NULL DEFAULT 0,
    "avg_views" DOUBLE PRECISION DEFAULT 0,
    "engagement_rate" DOUBLE PRECISION DEFAULT 0,
    "snapshot_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creator_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_videos" (
    "id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "views" BIGINT NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT NOT NULL,

    CONSTRAINT "creator_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_rankings" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "ranking_type" TEXT NOT NULL,
    "ranking_position" INTEGER NOT NULL,
    "ranking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_rankings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creators_channel_id_key" ON "creators"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "creators_slug_key" ON "creators"("slug");

-- CreateIndex
CREATE INDEX "creators_slug_idx" ON "creators"("slug");

-- CreateIndex
CREATE INDEX "creators_platform_idx" ON "creators"("platform");

-- CreateIndex
CREATE INDEX "creators_tracking_status_idx" ON "creators"("tracking_status");

-- CreateIndex
CREATE INDEX "creators_region_idx" ON "creators"("region");

-- CreateIndex
CREATE INDEX "creator_snapshots_creator_id_snapshot_date_idx" ON "creator_snapshots"("creator_id", "snapshot_date");

-- CreateIndex
CREATE INDEX "creator_snapshots_snapshot_date_idx" ON "creator_snapshots"("snapshot_date");

-- CreateIndex
CREATE UNIQUE INDEX "creator_videos_video_id_key" ON "creator_videos"("video_id");

-- CreateIndex
CREATE INDEX "creator_videos_creator_id_published_at_idx" ON "creator_videos"("creator_id", "published_at");

-- CreateIndex
CREATE INDEX "daily_rankings_ranking_type_ranking_date_idx" ON "daily_rankings"("ranking_type", "ranking_date");

-- AddForeignKey
ALTER TABLE "creator_snapshots" ADD CONSTRAINT "creator_snapshots_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "creator_videos" ADD CONSTRAINT "creator_videos_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_rankings" ADD CONSTRAINT "daily_rankings_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
