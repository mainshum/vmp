/*
  Warnings:

  - Made the column `validUntil` on table `Offer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `creationDate` on table `Offer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "validUntil" SET NOT NULL,
ALTER COLUMN "creationDate" SET NOT NULL;
