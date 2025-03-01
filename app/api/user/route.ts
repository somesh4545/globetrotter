import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, username } = body;

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      await prisma.gameSession.updateMany({
        where: { session_id },
        data: { userId: username },
      });

      return NextResponse.json({
        success: true,
        message: "New user detected, session updated",
      });
    }

    return NextResponse.json({
      success: false,
      message: "User already exists",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
