/*
  Warnings:

  - You are about to drop the column `descrition` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projects" DROP COLUMN "descrition",
ADD COLUMN     "description" TEXT;
