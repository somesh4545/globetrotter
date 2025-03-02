"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Confetti from "react-confetti";
import Lottie from "lottie-react";
import animationData from "@/public/sad.json";
import dom2img from "dom-to-image";

export default function GamePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [showUsernameDialog, setshowUsernameDialog] = useState(false);
  const [username, setUserName] = useState<string>();
  const [clues, setClues] = useState([]);
  const [options, setOptions] = useState([]);
  const [node, setnode] = useState<HTMLElement | null>(null);
  const [dialogContent, setDialogContent] = useState<{
    type: string;
    message: string;
    fun_fact: string;
  }>();

  const dialogRef = useRef(null);
  const shareUIRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (dialogRef.current) {
      const { offsetWidth, offsetHeight } = dialogRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [showDialog]);

  const startNewGame = async () => {
    setIsLoading(true);
    setShowDialog(false);
    const session_id = localStorage.getItem("session_id");
    const username = localStorage.getItem("username");
    fetch("/api/start-game", {
      method: "POST",
      body: JSON.stringify({
        session_id: session_id,
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOptions(data.options);
        setClues(data.clues);
        localStorage.setItem("session_id", data.session_id);
        updateStats(data.stats);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      let n = document.getElementById("shareableComponent");
      console.log(isLoading, n);
      setnode(n);
    }
  }, [isLoading]);

  const getNewClue = async () => {
    const session_id = localStorage.getItem("session_id");
    const username = localStorage.getItem("username");
    fetch("/api/clue", {
      method: "POST",
      body: JSON.stringify({
        session_id: session_id,
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.type == "NO_CLUES_AVAILBLE") {
          alert("No new clues available");
          return;
        }
        setClues(data.clues);
      });
  };

  const handleGuess = (option: string) => {
    const session_id = localStorage.getItem("session_id");
    fetch("/api/submit-answer", {
      method: "POST",
      body: JSON.stringify({
        session_id: session_id,
        city_guess: option,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDialogContent(data);
        updateStats(data.stats);
        setShowDialog(true);
      });
  };

  const updateStats = (data: any) => {
    setPoints(data.points_scored);
    setIncorrectAttempts(data.wrong_attempts);
  };

  const shareGame = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setshowUsernameDialog(true);
    } else {
      // Convert UI to image
      if (node) {
        dom2img
          .toBlob(node)
          .then(async function (blob) {
            if (!blob) return;

            const file = new File([blob], "shared-image.png", {
              type: "image/png",
            });

            const shareText = `🚀 I just scored ${points} points in this game! Think you can beat me? 😏🔥 Give it a shot and try to score more! Link: ${window.location.href} 🎮💯`;
            navigator.clipboard.writeText(shareText);
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  text: shareText,
                  files: [file],
                });
              } catch (error) {
                console.error("Error sharing:", error);
              }
            } else {
              console.log("Web Share API not supported or cannot share files.");
            }
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      }
    }
  };

  const checkIfUsernameExists = async () => {
    if (!username) {
      alert("Please enter username");
    } else {
      const session_id = localStorage.getItem("session_id");
      fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          session_id: session_id,
          username: username,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setshowUsernameDialog(false);
            localStorage.setItem("username", username);
            shareGame();
          } else {
            alert("Username already taken");
            setUserName("");
          }
        });
    }
  };

  return (
    <div
      className="h-screen w-full bg-[#121212] text-white flex flex-col items-center relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg.webp')",
        backgroundColor: "rgba(43,40,38,1)",
        backgroundBlendMode: "multiply",
      }}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-center p-4 bg-[#222222] border-b border-yellow-400">
        <div>
          {!isLoading && (
            <Button
              onClick={shareGame}
              className="bg-yellow-400 text-black font-bold text-base md:text-lg px-6 py-4 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all duration-200 hover:bg-yellow-500 font-mono"
            >
              Challenge a Friend
            </Button>
          )}
        </div>
        {/* <span>You may experience delay in responses</span> */}
        <div className="flex gap-4 items-center mr-4">
          <span className="text-xl font-bold text-yellow-400">
            Points: {points}
          </span>
          <span className="text-gray-400 hidden md:flex">
            Incorrect Attempts: {incorrectAttempts}
          </span>
        </div>
      </div>

      {!isLoading ? (
        <div
          id="shareableComponent"
          ref={shareUIRef}
          className="flex items-center justify-center flex-col p-4"
        >
          <div className="mb-4 text-center">
            <h1 className="font-extrabold text-4xl text-yellow-400 drop-shadow-lg">
              Guess the City!
            </h1>
            {clues.map((clue, i) => {
              return (
                <p
                  key={i}
                  className=" text-lg mt-4 max-w-lg text-gray-300 bg-[#333333] p-4 rounded-lg"
                >
                  {clue}
                </p>
              );
            })}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mt-8">
            {options.map((option) => (
              <Button
                key={option}
                className="cursor-pointer bg-yellow-400 text-black  text-2xl px-8 py-4 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all duration-200 hover:bg-yellow-500 font-mono"
                onClick={() => handleGuess(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <Button
            onClick={getNewClue}
            className="mt-10  bg-blue-500 text-white  text-2xl px-6 py-4 shadow-[4px_4px_0px_black] border-2 border-blue-500 hover:shadow-[6px_6px_0px_black] hover:bg-blue-600 transition-all duration-200 font-mono"
          >
            Get Next Clue
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center mt-4">
          <h1 className="text-white font-bold text-2xl">Loading...</h1>
        </div>
      )}
      <span className="">
        The API response may be delayed as it is hosted on a free tier.
      </span>

      <Dialog open={showUsernameDialog} onOpenChange={setshowUsernameDialog}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <DialogTitle></DialogTitle>
          <DialogContent className="bg-[#222222] border-4 border-yellow-400 p-6 rounded-lg shadow-lg text-center">
            <h2 className={`text-3xl font-bold ${"text-green-400"}`}>
              Enter your username
            </h2>
            <Input
              type="text"
              placeholder="somesh4545"
              value={username || ""}
              className="text-white"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
            <Button
              className="mt-6 flex flex-1 bg-yellow-400 text-black font-bold  px-6 py-4 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all duration-200 hover:bg-yellow-500 font-mono"
              onClick={() => checkIfUsernameExists()}
            >
              Sign Up
            </Button>
          </DialogContent>
        </DialogOverlay>
      </Dialog>

      {/* Retro Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <DialogTitle></DialogTitle>
          <DialogContent
            ref={dialogRef}
            className="bg-[#222222] border-4 border-yellow-400 p-6 rounded-lg shadow-lg text-center"
          >
            <div className="flex flex-row items-center justify-center">
              {dialogContent?.type !== "CORRECT_GUESS" && (
                <div className="w-[40px] h-[40px] mr-2 ">
                  <Lottie animationData={animationData} loop={false} />
                </div>
              )}
              <h2
                className={`text-3xl font-bold ${
                  dialogContent?.type === "CORRECT_GUESS"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {dialogContent?.type === "CORRECT_GUESS"
                  ? "Correct!"
                  : "Wrong!"}
              </h2>
            </div>
            {dialogContent?.type === "CORRECT_GUESS" && (
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <Confetti
                  width={dimensions.width}
                  height={dimensions.height}
                  recycle={false}
                  numberOfPieces={150}
                  gravity={0.3}
                />
              </div>
            )}

            <p className="text-gray-300 mt-2">
              {dialogContent?.type === "CORRECT_GUESS"
                ? "You guessed it right!"
                : "Try again next time."}
            </p>
            <p className="text-gray-400 mt-2 text-bold">
              {dialogContent?.fun_fact}
            </p>
            <div className="flex flex-col w-full md:flex-row space-x-4 space-y-4">
              {dialogContent?.type !== "CORRECT_GUESS" && (
                <Button
                  onClick={() => {
                    setShowDialog(false);
                  }}
                  className="flex flex-1 bg-blue-500 text-white  px-6 py-3 shadow-[4px_4px_0px_black] border-2 border-blue-500 hover:shadow-[6px_6px_0px_black] hover:bg-blue-600 transition-all duration-200 font-mono"
                >
                  Try again
                </Button>
              )}
              <Button
                className="flex flex-1 bg-yellow-400 text-black font-bold  px-6 py-4 shadow-[4px_4px_0px_black] hover:shadow-[6px_6px_0px_black] transition-all duration-200 hover:bg-yellow-500 font-mono"
                onClick={() => startNewGame()}
              >
                Next Challenge
              </Button>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
