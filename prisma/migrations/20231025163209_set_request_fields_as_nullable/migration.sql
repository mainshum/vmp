-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "workType" DROP NOT NULL,
ALTER COLUMN "projectStage" DROP NOT NULL,
ALTER COLUMN "projectDuration" DROP NOT NULL,
ALTER COLUMN "projectMethodology" DROP NOT NULL,
ALTER COLUMN "availability" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "fundingGuaranteed" DROP NOT NULL,
ALTER COLUMN "hourlyRate" DROP NOT NULL,
ALTER COLUMN "noticePeriod" DROP NOT NULL,
ALTER COLUMN "pmExists" DROP NOT NULL,
ALTER COLUMN "profile" DROP NOT NULL,
ALTER COLUMN "startDate" DROP NOT NULL;
