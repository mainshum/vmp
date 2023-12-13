-- CreateEnum
CREATE TYPE "JobSubProfile" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'MOBILE');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "subProfile" "JobSubProfile" NOT NULL DEFAULT 'FULLSTACK';
