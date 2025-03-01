/*
  Warnings:

  - You are about to drop the column `isActve` on the `GameSession` table. All the data in the column will be lost.
  - Added the required column `isActive` to the `GameSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT NOT NULL,
    "userId" TEXT,
    "city" TEXT NOT NULL,
    "cluesGiven" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL,
    "wrong_attempts" INTEGER NOT NULL DEFAULT 0,
    "points_scored" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_GameSession" ("city", "cluesGiven", "id", "points_scored", "session_id", "userId", "wrong_attempts") SELECT "city", "cluesGiven", "id", "points_scored", "session_id", "userId", "wrong_attempts" FROM "GameSession";
DROP TABLE "GameSession";
ALTER TABLE "new_GameSession" RENAME TO "GameSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
