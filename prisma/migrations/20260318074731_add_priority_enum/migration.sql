/*
  Warnings:

  - You are about to drop the column `isPriority` on the `tasks` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'NORMAL', 'LOW');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "isPriority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'NORMAL';
