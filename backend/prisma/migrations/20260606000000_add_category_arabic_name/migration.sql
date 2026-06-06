ALTER TABLE "Category" ADD COLUMN "nameAr" TEXT;

UPDATE "Category"
SET "nameAr" = CASE LOWER("name")
  WHEN 'floral' THEN 'زهري'
  WHEN 'fresh' THEN 'منعش'
  WHEN 'oriental' THEN 'شرقي'
  WHEN 'uncategorized' THEN 'غير مصنف'
  WHEN 'wood' THEN 'خشبي'
  WHEN 'woody' THEN 'خشبي'
  ELSE "name"
END
WHERE "nameAr" IS NULL;

ALTER TABLE "Category" ALTER COLUMN "nameAr" SET NOT NULL;
