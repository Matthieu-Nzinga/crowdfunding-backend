/*
  Warnings:

  - You are about to drop the column `amount` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "amount",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "goal" DOUBLE PRECISION,
ADD COLUMN     "image" TEXT;
