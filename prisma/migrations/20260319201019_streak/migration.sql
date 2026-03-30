/*
  Warnings:

  - You are about to drop the `streak` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "streak";

-- CreateTable
CREATE TABLE "streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "streaks_userId_key" ON "streaks"("userId");
