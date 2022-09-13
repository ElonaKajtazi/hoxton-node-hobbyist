/*
  Warnings:

  - You are about to drop the column `active` on the `Hobby` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Hobby` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Hobby" ("id", "name") SELECT "id", "name" FROM "Hobby";
DROP TABLE "Hobby";
ALTER TABLE "new_Hobby" RENAME TO "Hobby";
CREATE UNIQUE INDEX "Hobby_name_key" ON "Hobby"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
