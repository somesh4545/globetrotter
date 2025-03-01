import { PrismaClient } from "@prisma/client";
import cities from "../data.json";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  let { session_id, city_guess } = body;
  try {
    if (session_id) {
      let session = await prisma.gameSession.findFirst({
        where: { session_id: session_id, isActive: true },
      });

      if (!session) {
        return NextResponse.json(
          { message: "Invalid session ID." },
          {
            status: 400,
          }
        );
      }

      const city_detail = cities.find((item) => item.city == session.city);
      const random_fact =
        city_detail?.fun_fact[
          Math.floor(Math.random() * city_detail?.fun_fact.length)
        ];

      const stats = await prisma.gameSession.aggregate({
        where: { session_id: session_id },
        _sum: {
          points_scored: true,
          wrong_attempts: true,
        },
      });

      if (city_guess == session.city) {
        await prisma.gameSession.updateMany({
          where: {
            session_id: session_id as string,
            city: session.city,
            isActive: true,
          },
          data: { points_scored: 1 },
        });

        return NextResponse.json(
          {
            type: "CORRECT_GUESS",
            message: "You have guessed the city correctly",
            fun_fact: random_fact,
            stats: {
              points_scored: (stats._sum.points_scored || 0) + 1,
              wrong_attempts: stats._sum.wrong_attempts,
            },
          },
          { status: 200 }
        );
      } else {
        await prisma.gameSession.updateMany({
          where: {
            session_id: session_id as string,
            city: session.city,
            isActive: true,
          },
          data: { wrong_attempts: session.wrong_attempts + 1 },
        });
        return NextResponse.json(
          {
            type: "INCORRECT_GUESS",
            message: "Wrong guess please try again",
            fun_fact: random_fact,
            stats: {
              points_scored: stats._sum.points_scored,
              wrong_attempts: (stats._sum.wrong_attempts || 0) + 1,
            },
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
