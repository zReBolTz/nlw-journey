-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "if_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
