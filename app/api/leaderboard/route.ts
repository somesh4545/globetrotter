import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaderboard = await prisma.gameSession.groupBy({
      by: ["userId"], // Group by userId
      _sum: {
        points_scored: true,
        wrong_attempts: true,
      },
      orderBy: [
        { _sum: { points_scored: "desc" } },
        { _sum: { wrong_attempts: "asc" } },
      ],
    });

    const result = await Promise.all(
      leaderboard.map(async (entry) => {
        return {
          username: entry.userId,
          total_points: entry._sum.points_scored || 0,
          wrong_attempts: entry._sum.wrong_attempts || 0,
        };
      })
    );

    return NextResponse.json({ success: true, leaderboard: result });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching data" },
      { status: 500 }
    );
  }
}
