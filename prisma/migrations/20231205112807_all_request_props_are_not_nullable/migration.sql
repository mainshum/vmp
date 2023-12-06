/*
  Warnings:

  - Made the column `name` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `validUntil` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `creationDate` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workType` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectStage` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectDuration` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectMethodology` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `availability` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `daysInOffice` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `domesticTravel` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endDate` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fundingGuaranteed` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hourlyRate` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `internationalTravel` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `noticePeriod` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `officeLocation` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pmExists` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profile` on table `Request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startDate` on table `Request` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "validUntil" SET NOT NULL,
ALTER COLUMN "creationDate" SET NOT NULL,
ALTER COLUMN "workType" SET NOT NULL,
ALTER COLUMN "projectStage" SET NOT NULL,
ALTER COLUMN "projectDuration" SET NOT NULL,
ALTER COLUMN "projectMethodology" SET NOT NULL,
ALTER COLUMN "availability" SET NOT NULL,
ALTER COLUMN "daysInOffice" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "domesticTravel" SET NOT NULL,
ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "fundingGuaranteed" SET NOT NULL,
ALTER COLUMN "hourlyRate" SET NOT NULL,
ALTER COLUMN "internationalTravel" SET NOT NULL,
ALTER COLUMN "noticePeriod" SET NOT NULL,
ALTER COLUMN "officeLocation" SET NOT NULL,
ALTER COLUMN "pmExists" SET NOT NULL,
ALTER COLUMN "profile" SET NOT NULL,
ALTER COLUMN "startDate" SET NOT NULL;
