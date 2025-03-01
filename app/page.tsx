"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="h-[100vh] relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg.webp')",
        backgroundColor: "rgba(43,40,38,.9)",
        backgroundBlendMode: "multiply",
      }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-opacity-50"></div>

      <main className="relative z-10 p-4 min-h-full flex flex-col items-center justify-center text-center">
        <h1 className="font-extrabold text-5xl text-white drop-shadow-lg font-mono tracking-wider">
          The Globetrotter Challenge
        </h1>
        <p className="text-white text-lg mt-4 max-w-lg font-mono leading-relaxed">
          Guess the city based on cryptic clues and explore fun facts about the
          world’s most iconic places!
        </p>

        <div className="mt-10 mb-5">
          <Button
            onClick={() => router.push("/game")}
            className="bg-yellow-400 text-black font-bold text-2xl px-6 py-4 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all duration-200 hover:bg-yellow-500 font-mono"
          >
            Play Now
          </Button>
        </div>

        <Button
          onClick={() => router.push("/leaderboard")}
          className=" bg-blue-500 text-white  text-2xl px-6 py-4 shadow-[4px_4px_0px_black] border-2 border-blue-500 hover:shadow-[6px_6px_0px_black] hover:bg-blue-600 transition-all duration-200 font-mono"
        >
          Leaderboard
        </Button>
      </main>
    </div>
  );
}
