-- CreateEnum
CREATE TYPE "Seniority" AS ENUM ('JUNIOR', 'MID', 'SENIOR', 'PRINCIPAL');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "seniority" "Seniority" NOT NULL DEFAULT 'JUNIOR';
