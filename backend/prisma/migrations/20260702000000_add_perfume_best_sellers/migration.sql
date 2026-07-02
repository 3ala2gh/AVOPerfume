ALTER TABLE "Perfume"
ADD COLUMN "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "bestSellerRank" INTEGER;

CREATE UNIQUE INDEX "Perfume_bestSellerRank_key"
ON "Perfume"("bestSellerRank");

ALTER TABLE "Perfume"
ADD CONSTRAINT "Perfume_bestSellerRank_check"
CHECK (
  "bestSellerRank" IS NULL
  OR ("bestSellerRank" >= 1 AND "bestSellerRank" <= 6)
);
