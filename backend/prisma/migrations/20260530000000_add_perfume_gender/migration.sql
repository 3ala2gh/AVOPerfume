-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- AlterTable
ALTER TABLE "Perfume"
ADD COLUMN "gender" "Gender" NOT NULL DEFAULT 'UNISEX';
