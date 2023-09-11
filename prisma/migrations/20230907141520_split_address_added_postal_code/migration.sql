/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `projectType` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `addressLine1` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine2` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
DROP COLUMN "projectType",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ProjectType";
