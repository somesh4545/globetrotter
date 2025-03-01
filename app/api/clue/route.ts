import { PrismaClient } from "@prisma/client";
import cities from "../data.json";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { session_id } = body;

  try {
    if (session_id) {
      const session = await prisma.gameSession.findFirst({
        where: { session_id: session_id, isActive: true },
      });

      if (!session) {
        return NextResponse.json(
          { message: "Invalid session ID." },
          { status: 400 }
        );
      }

      if (session.cluesGiven >= 2) {
        return NextResponse.json(
          {
            message: "Maximum clues given, Try next challenge",
            type: "NO_CLUES_AVAILBLE",
          },
          { status: 400 }
        );
      }
      const city = cities.find((item) => item.city === session.city);
      if (city) {
        await prisma.gameSession.updateMany({
          where: { session_id: session_id as string, city: city.city },
          data: { cluesGiven: session.cluesGiven + 1 },
        });

        return NextResponse.json(
          {
            message: "Next clue!",
            session_id: session.session_id,
            clues: [...city.clues],
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json({ message: "No session ID." }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
  }
}
