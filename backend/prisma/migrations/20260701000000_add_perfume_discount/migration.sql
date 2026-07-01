ALTER TABLE "Perfume"
ADD COLUMN "discountPercent" DECIMAL(5,2);

ALTER TABLE "Perfume"
ADD CONSTRAINT "Perfume_discountPercent_check"
CHECK ("discountPercent" IS NULL OR ("discountPercent" >= 0 AND "discountPercent" <= 100));
