-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "referred_by" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSession" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "userId" TEXT,
    "city" TEXT NOT NULL,
    "cluesGiven" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL,
    "wrong_attempts" INTEGER NOT NULL DEFAULT 0,
    "points_scored" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GameSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
