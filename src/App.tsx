import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import HangmanDraw from "./component/HangmanDraw";
import HangmanWord from "./component/HangmanWord";
import Keyboard from "./component/Keyboard";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  const [guessLetters, setGuessLetters] = useState<string[]>([]);

  // take and filter the letters we guess
  const incorrectLetters = guessLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessLetters.includes(letter));

  const addGuessLetter = useCallback(
    (letter: string) => {
      if (guessLetters.includes(letter) || isLoser || isWinner) {
        return;
      } else {
        setGuessLetters((currentLetters) => [...currentLetters, letter]);
      }
    },
    [guessLetters, isLoser, isWinner]
  );

  // keyboard event handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) {
        return;
      } else {
        e.preventDefault();
        addGuessLetter(key);
      }
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessLetters]);

  useEffect(() => {
    if (isWinner) {
      toast("Congratulations, you won!", {
        icon: "👏",
        duration: 5000,
      });
    }
  }, [isWinner]);

  useEffect(() => {
    if (isLoser) {
      toast.error("You lost, please refresh the page!", {
        duration: 5000,
      });
    }
  }, [isLoser, wordToGuess]);

  return (
    <div className="bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100 via-indigo-100 to-purple-200 h-screen">
      <div className="font-adlam max-w-5xl flex flex-col items-center gap-8 mx-auto pt-12">
        <Toaster />
        <div className="w-full flex flex-col gap-4 lg:gap-8 lg:flex-row justify-center items-center">
          {/* Hangman and Word Display */}
          <div className="w-full lg:w-1/2 text-center flex flex-col gap-4">
            <HangmanDraw numberOfGuess={incorrectLetters.length} />
            <HangmanWord
              result={isLoser}
              guessLetters={guessLetters}
              wordToGuess={wordToGuess}
            />
          </div>

          {/* Keyboard */}
          <div className="w-full lg:w-1/2 text-center">
            <Keyboard
              disabled={isWinner || isLoser}
              activeLetter={guessLetters.filter((letter) =>
                wordToGuess.includes(letter)
              )}
              inactiveLetter={incorrectLetters}
              addGuessLetter={addGuessLetter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
