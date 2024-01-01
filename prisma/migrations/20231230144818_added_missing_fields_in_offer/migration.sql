/*
  Warnings:

  - Added the required column `cv` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seniority` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subProfile` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "cv" TEXT NOT NULL,
ADD COLUMN     "profile" "JobProfile" NOT NULL,
ADD COLUMN     "seniority" "Seniority" NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "subProfile" "JobSubProfile" NOT NULL,
ALTER COLUMN "matchingGrade" DROP NOT NULL,
ALTER COLUMN "offerStatus" DROP NOT NULL;
