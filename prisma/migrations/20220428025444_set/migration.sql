/*
  Warnings:

  - You are about to drop the column `termId` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the `terms` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `term` to the `disciplines` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "disciplines" DROP CONSTRAINT "disciplines_termId_fkey";

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "termId",
ADD COLUMN     "term" TEXT NOT NULL;

-- DropTable
DROP TABLE "terms";
