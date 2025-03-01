-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_id" TEXT,
    "userId" TEXT,
    "city" TEXT NOT NULL,
    "cluesGiven" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_GameSession" ("city", "cluesGiven", "id", "session_id", "userId") SELECT "city", "cluesGiven", "id", "session_id", "userId" FROM "GameSession";
DROP TABLE "GameSession";
ALTER TABLE "new_GameSession" RENAME TO "GameSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
