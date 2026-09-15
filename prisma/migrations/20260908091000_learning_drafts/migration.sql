-- CreateTable
CREATE TABLE "learning_drafts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "contentVersion" TEXT NOT NULL DEFAULT '1.0',
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_drafts_userId_lessonId_activityId_key" ON "learning_drafts"("userId", "lessonId", "activityId");

-- CreateIndex
CREATE INDEX "learning_drafts_userId_updatedAt_idx" ON "learning_drafts"("userId", "updatedAt");

-- AddForeignKey
ALTER TABLE "learning_drafts" ADD CONSTRAINT "learning_drafts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
