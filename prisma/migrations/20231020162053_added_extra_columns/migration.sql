/*
  Warnings:

  - Added the required column `availability` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundingGuaranteed` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hourlyRate` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noticePeriod` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pmExists` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobProfile" AS ENUM ('SOFTWARE_ENGINEER', 'DATA_SPECIALIST', 'DEVOPS', 'QUALITY_ASSURANCE');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "availability" INTEGER NOT NULL,
ADD COLUMN     "daysInOffice" INTEGER,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "domesticTravel" BOOLEAN,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fundingGuaranteed" BOOLEAN NOT NULL,
ADD COLUMN     "hourlyRate" INTEGER NOT NULL,
ADD COLUMN     "internationalTravel" BOOLEAN,
ADD COLUMN     "noticePeriod" INTEGER NOT NULL,
ADD COLUMN     "officeLocation" TEXT,
ADD COLUMN     "pmExists" BOOLEAN NOT NULL,
ADD COLUMN     "profile" "JobProfile" NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;
