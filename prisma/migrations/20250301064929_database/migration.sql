/*
  Warnings:

  - You are about to drop the column `score` on the `User` table. All the data in the column will be lost.
  - Added the required column `isActve` to the `GameSession` table without a default value. This is not possible if the table is not empty.
  - Made the column `session_id` on table `GameSession` required. This step will fail if there are existing NULL values in that column.

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
    "isActve" BOOLEAN NOT NULL,
    "wrong_attempts" INTEGER NOT NULL DEFAULT 0,
    "points_scored" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_GameSession" ("city", "cluesGiven", "id", "session_id", "userId") SELECT "city", "cluesGiven", "id", "session_id", "userId" FROM "GameSession";
DROP TABLE "GameSession";
ALTER TABLE "new_GameSession" RENAME TO "GameSession";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "referred_by" TEXT
);
INSERT INTO "new_User" ("id", "referred_by", "username") SELECT "id", "referred_by", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
