CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "is10MlEnabled" BOOLEAN NOT NULL DEFAULT true,
    "is30MlEnabled" BOOLEAN NOT NULL DEFAULT true,
    "is55MlEnabled" BOOLEAN NOT NULL DEFAULT true,
    "is100MlEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SiteSettings" ("id") VALUES (1);
