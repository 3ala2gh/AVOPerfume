-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- Seed categories from existing perfume rows
INSERT INTO "Category" ("name")
SELECT DISTINCT "category"
FROM "Perfume"
WHERE "category" IS NOT NULL
  AND LENGTH(TRIM("category")) > 0
ON CONFLICT ("name") DO NOTHING;

-- Add category relation column
ALTER TABLE "Perfume" ADD COLUMN "categoryId" INTEGER;

-- Backfill relation
UPDATE "Perfume" p
SET "categoryId" = c."id"
FROM "Category" c
WHERE c."name" = p."category";

-- Ensure all rows have a category
INSERT INTO "Category" ("name")
SELECT 'Uncategorized'
WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "name" = 'Uncategorized');

UPDATE "Perfume"
SET "categoryId" = (SELECT "id" FROM "Category" WHERE "name" = 'Uncategorized')
WHERE "categoryId" IS NULL;

-- Make relation required
ALTER TABLE "Perfume" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Perfume" ADD CONSTRAINT "Perfume_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Remove old string column
ALTER TABLE "Perfume" DROP COLUMN "category";

