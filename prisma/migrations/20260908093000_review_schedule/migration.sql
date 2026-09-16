-- CreateTable
CREATE TABLE "review_schedules" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outcomeId" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "consecutiveSuccesses" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "review_schedules_userId_outcomeId_key" ON "review_schedules"("userId", "outcomeId");

-- CreateIndex
CREATE INDEX "review_schedules_userId_dueAt_idx" ON "review_schedules"("userId", "dueAt");

-- AddForeignKey
ALTER TABLE "review_schedules" ADD CONSTRAINT "review_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
