/*
  Warnings:

  - You are about to drop the column `logistics` on the `OfferGrade` table. All the data in the column will be lost.
  - You are about to drop the column `rateFit` on the `OfferGrade` table. All the data in the column will be lost.
  - You are about to drop the column `seniorityFit` on the `OfferGrade` table. All the data in the column will be lost.
  - You are about to drop the column `technologyFit` on the `OfferGrade` table. All the data in the column will be lost.
  - You are about to drop the column `vendorScore` on the `OfferGrade` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OfferGrade" DROP COLUMN "logistics",
DROP COLUMN "rateFit",
DROP COLUMN "seniorityFit",
DROP COLUMN "technologyFit",
DROP COLUMN "vendorScore",
ADD COLUMN     "n_logistics" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "n_rateFit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "n_seniorityFit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "n_technologyFit" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "n_vendorScore" INTEGER NOT NULL DEFAULT 0;
