-- CreateEnum
CREATE TYPE "VMPRole" AS ENUM ('NONE', 'CLIENT', 'VENDOR', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "VMPRole" NOT NULL DEFAULT 'NONE';
