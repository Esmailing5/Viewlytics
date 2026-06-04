-- CreateTable
CREATE TABLE "creator_impacts" (
    "id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "snapshot_date" DATE NOT NULL,
    "views_videos_30d" BIGINT NOT NULL DEFAULT 0,
    "views_shorts_30d" BIGINT NOT NULL DEFAULT 0,
    "impact_total_30d" BIGINT NOT NULL DEFAULT 0,
    "videos_30d" INTEGER NOT NULL DEFAULT 0,
    "shorts_30d" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creator_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "creator_impacts_impact_total_30d_idx" ON "creator_impacts"("impact_total_30d" DESC);

-- CreateIndex
CREATE INDEX "creator_impacts_views_videos_30d_idx" ON "creator_impacts"("views_videos_30d" DESC);

-- CreateIndex
CREATE INDEX "creator_impacts_views_shorts_30d_idx" ON "creator_impacts"("views_shorts_30d" DESC);

-- CreateIndex
CREATE INDEX "creator_impacts_snapshot_date_idx" ON "creator_impacts"("snapshot_date");

-- CreateIndex
CREATE UNIQUE INDEX "creator_impacts_creator_id_snapshot_date_key" ON "creator_impacts"("creator_id", "snapshot_date");

-- AddForeignKey
ALTER TABLE "creator_impacts" ADD CONSTRAINT "creator_impacts_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "creators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
