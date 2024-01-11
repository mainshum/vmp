/*
  Warnings:

  - You are about to drop the column `matchingGrade` on the `Offer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[offerGradeId]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `offerGradeId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "matchingGrade",
ADD COLUMN     "offerGradeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OfferGrade" (
    "id" TEXT NOT NULL,
    "technologyFit" INTEGER DEFAULT 0,
    "seniorityFit" INTEGER DEFAULT 0,
    "rateFit" INTEGER DEFAULT 0,
    "logistics" INTEGER DEFAULT 0,
    "vendorScore" INTEGER DEFAULT 0,

    CONSTRAINT "OfferGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_offerGradeId_key" ON "Offer"("offerGradeId");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_offerGradeId_fkey" FOREIGN KEY ("offerGradeId") REFERENCES "OfferGrade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
