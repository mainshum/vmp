/*
  Warnings:

  - Added the required column `userId` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Made the column `matchingGrade` on table `Offer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_requestId_fkey";

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "matchingGrade" SET NOT NULL,
ALTER COLUMN "matchingGrade" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
