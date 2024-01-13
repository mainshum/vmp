/*
  Warnings:

  - Made the column `offerGradeId` on table `Offer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "offerGradeId" SET NOT NULL;
