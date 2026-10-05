/*
  Warnings:

  - You are about to drop the column `postData` on the `BlogPost` table. All the data in the column will be lost.
  - Added the required column `postFile` to the `BlogPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "postData",
ADD COLUMN     "postFile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "credits" SET NOT NULL,
ALTER COLUMN "credits" SET DATA TYPE TEXT;
