/*
  Warnings:

  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `token` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "userId",
ADD COLUMN     "token" TEXT NOT NULL;
