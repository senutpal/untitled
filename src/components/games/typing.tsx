"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SAMPLE_TEXTS = [
  "the quick brown fox jumps over the lazy dog",
  "code is poetry written in logic",
  "every developer was once a beginner",
  "simplicity is the ultimate sophistication",
];

export function TypingGame() {
  const [text, setText] = React.useState("");
  const [input, setInput] = React.useState("");
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [wpm, setWpm] = React.useState<number | null>(null);
  const [accuracy, setAccuracy] = React.useState<number | null>(null);
  const [isComplete, setIsComplete] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const startNewGame = React.useCallback(() => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setText(randomText);
    setInput("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setIsComplete(false);
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    setInput(value);

    if (value === text) {
      const endTime = Date.now();
      const timeInMinutes = Math.max((endTime - (startTime || endTime)) / 60000, 0.0001);
      const wordCount = text.split(" ").length;
      const calculatedWpm = Math.round(wordCount / timeInMinutes);

      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === text[i]) correct++;
      }
      const calculatedAccuracy = Math.round((correct / text.length) * 100);

      setWpm(calculatedWpm);
      setAccuracy(calculatedAccuracy);
      setIsComplete(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isComplete ? (
        <ResultsDisplay wpm={wpm} accuracy={accuracy} />
      ) : (
        <TypingDisplay text={text} input={input} />
      )}

      {!isComplete && (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="w-full rounded-lg border bg-background px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Start typing..."
          autoComplete="off"
          spellCheck={false}
        />
      )}

      <Button onClick={startNewGame} variant="secondary">
        {isComplete ? "Try Again" : "New Text"}
      </Button>
    </div>
  );
}

function ResultsDisplay({ wpm, accuracy }: { wpm: number | null; accuracy: number | null }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{wpm} WPM</p>
      <p className="text-muted-foreground">{accuracy}% accuracy</p>
    </div>
  );
}

function TypingDisplay({ text, input }: { text: string; input: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="font-mono text-lg leading-relaxed">
        {text.split("").map((char, i) => (
          <span
            key={i}
            className={cn(
              i < input.length && input[i] === char && "text-primary",
              i < input.length && input[i] !== char && "text-destructive bg-destructive/20",
              i === input.length && "bg-primary/20"
            )}
          >
            {char}
          </span>
        ))}
      </p>
    </div>
  );
}
