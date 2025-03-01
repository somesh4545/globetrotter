import { PrismaClient } from "@prisma/client";
import cities from "../data.json";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

function shuffleArray(array: string[]): string[] {
  return array.sort(() => Math.random() - 0.5);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { session_id } = body;
  const { username } = body;
  let session;
  let newCity = cities[Math.floor(Math.random() * cities.length)];
  try {
    if (session_id) {
      session = await prisma.gameSession.findFirst({
        where: { session_id: session_id },
      });

      if (!session) {
        session_id = [...Array(16)]
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join("");
      } else {
        await prisma.gameSession.updateMany({
          where: { session_id: session_id as string },
          data: { isActive: false },
        });

        do {
          newCity = cities[Math.floor(Math.random() * cities.length)];
        } while (
          await prisma.gameSession.findFirst({
            where: { city: newCity.city, id: session_id },
          })
        );
      }
    } else {
      session_id = [...Array(16)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
    }

    session = await prisma.gameSession.create({
      data: {
        session_id: session_id,
        userId: username || session?.userId,
        city: newCity.city,
        cluesGiven: 1,
        isActive: true,
      },
    });

    const incorrectOptions = cities
      .filter((city) => city.city !== newCity.city)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((city) => city.city);

    const options = shuffleArray([...incorrectOptions, newCity.city]);

    const stats = await prisma.gameSession.aggregate({
      where: { session_id: session_id },
      _sum: {
        points_scored: true,
        wrong_attempts: true,
      },
    });

    return NextResponse.json(
      {
        message: "Game started!",
        session_id: session_id,
        clues: [newCity.clues[0]],
        options,
        stats: {
          points_scored: stats._sum.points_scored,
          wrong_attempts: stats._sum.wrong_attempts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
  }
}
