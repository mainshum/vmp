/*
  Warnings:

  - You are about to drop the column `opportunityId` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the `Opportunity` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `requestId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DRAFT', 'PENDING', 'NOOFFERS', 'WITHOFFERS', 'EXPIRED');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('FULLY_REMOTE', 'ONSITE', 'HYBRID');

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_opportunityId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "opportunityId",
ADD COLUMN     "requestId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Opportunity";

-- DropEnum
DROP TYPE "OpportunityStatus";

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3),
    "creationDate" TIMESTAMP(3),
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "workType" "WorkType" NOT NULL,
    "projectStage" "ProjectStage" NOT NULL,
    "projectDuration" "ProjectDuration" NOT NULL,
    "projectMethodology" "ProjectMethodology" NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
