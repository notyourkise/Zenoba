-- CreateTable
CREATE TABLE "lesson_bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_bookmarks_userId_lessonId_key" ON "lesson_bookmarks"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "lesson_bookmarks_userId_createdAt_idx" ON "lesson_bookmarks"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "lesson_bookmarks" ADD CONSTRAINT "lesson_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
