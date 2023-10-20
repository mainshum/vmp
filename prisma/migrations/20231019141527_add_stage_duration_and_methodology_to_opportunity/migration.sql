/*
  Warnings:

  - Added the required column `projectDuration` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectMethodology` to the `Opportunity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectStage` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectDuration" AS ENUM ('SHORT', 'MEDIUM', 'MEDIUM_LONG', 'LONG');

-- CreateEnum
CREATE TYPE "ProjectMethodology" AS ENUM ('SCRUM', 'KANBAN', 'LEAN', 'WATERFALL');

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "projectDuration" "ProjectDuration" NOT NULL,
ADD COLUMN     "projectMethodology" "ProjectMethodology" NOT NULL,
ADD COLUMN     "projectStage" "ProjectStage" NOT NULL;
