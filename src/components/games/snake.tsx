"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  isPlaying: boolean;
  gameOver: boolean;
}

const GRID_SIZE = 15;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const INITIAL_STATE: GameState = {
  snake: [{ x: 7, y: 7 }],
  food: { x: 10, y: 10 },
  direction: "RIGHT",
  score: 0,
  isPlaying: false,
  gameOver: false,
};

const OPPOSITES: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

const MOVES: Record<Direction, (head: Position) => Position> = {
  UP: (h) => ({ x: h.x, y: h.y - 1 }),
  DOWN: (h) => ({ x: h.x, y: h.y + 1 }),
  LEFT: (h) => ({ x: h.x - 1, y: h.y }),
  RIGHT: (h) => ({ x: h.x + 1, y: h.y }),
};

function generateFood(snake: Position[]): Position {
  // Check if grid is full
  if (snake.length >= GRID_SIZE * GRID_SIZE) {
    return { x: -1, y: -1 }; // Signal grid is full
  }
  
  let newFood: Position;
  let attempts = 0;
  const maxAttempts = GRID_SIZE * GRID_SIZE;
  
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    attempts++;
  } while (
    attempts < maxAttempts && 
    snake.some((s) => s.x === newFood.x && s.y === newFood.y)
  );
  
  return newFood;
}

function checkCollision(pos: Position, snake: Position[]): boolean {
  // Wall collision
  if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) {
    return true;
  }
  // Self collision
  return snake.some((s) => s.x === pos.x && s.y === pos.y);
}

export function SnakeGame() {
  const [gameState, setGameState] = React.useState<GameState>(INITIAL_STATE);
  const directionRef = React.useRef<Direction>(gameState.direction);

  const resetGame = React.useCallback(() => {
    const initialSnake = [{ x: 7, y: 7 }];
    const newState: GameState = {
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: "RIGHT",
      score: 0,
      isPlaying: true,
      gameOver: false,
    };
    directionRef.current = "RIGHT";
    setGameState(newState);
  }, []);

  // Keyboard controls
  React.useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
      };
      const newDir = keyMap[e.key];
      if (newDir && OPPOSITES[directionRef.current] !== newDir) {
        e.preventDefault();
        directionRef.current = newDir;
        setGameState((prev) => ({ ...prev, direction: newDir }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.isPlaying, gameState.gameOver]);

  // Game loop
  React.useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const moveSnake = () => {
      setGameState((prev) => {
        const head = prev.snake[0];
        const newHead = MOVES[prev.direction](head);

        // Check if new head overlaps with current tail (when not eating)
        const willGrow = newHead.x === prev.food.x && newHead.y === prev.food.y;
        const currentTail = prev.snake[prev.snake.length - 1];
        const isTailMovement = !willGrow && 
                               currentTail && 
                               newHead.x === currentTail.x && 
                               newHead.y === currentTail.y;

        // Create temporary snake for collision check
        const snakeForCollision = isTailMovement 
          ? prev.snake.slice(0, -1)  // Exclude tail from collision check
          : prev.snake;

        if (checkCollision(newHead, snakeForCollision)) {
          return { ...prev, gameOver: true, isPlaying: false };
        }

        const newSnake = [newHead, ...prev.snake];
        let newScore = prev.score;
        let newFood = prev.food;

        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          newScore = prev.score + 1;
          const generatedFood = generateFood(newSnake);
          if (generatedFood.x === -1) {
            // Grid is full - player wins!
            return { ...prev, snake: newSnake, score: newScore, gameOver: true, isPlaying: false };
          }
          newFood = generatedFood;
        } else {
          newSnake.pop();
        }

        return {
          ...prev,
          snake: newSnake,
          score: newScore,
          food: newFood,
        };
      });
    };

    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.gameOver, gameState.direction]);

  return (
    <div className="flex flex-col items-center gap-4">
      <ScoreDisplay score={gameState.score} />
      <GameBoard snake={gameState.snake} food={gameState.food} />
      <GameControls
        isPlaying={gameState.isPlaying}
        gameOver={gameState.gameOver}
        onStart={resetGame}
      />
      <p className="text-xs text-muted-foreground">Use arrow keys to move</p>
    </div>
  );
}

function ScoreDisplay({ score }: { score: number }) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg">Score: {score}</p>
    </div>
  );
}

function GameBoard({ snake, food }: { snake: Position[]; food: Position }) {
  return (
    <div
      className="relative rounded-lg border bg-muted/50"
      style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      role="img"
      aria-label="Snake game board"
    >
      {snake.map((pos, i) => (
        <SnakeSegment key={`${pos.x}-${pos.y}-${i}`} position={pos} isHead={i === 0} />
      ))}
      <FoodItem position={food} />
    </div>
  );
}

function SnakeSegment({ position, isHead }: { position: Position; isHead: boolean }) {
  return (
    <div
      className={cn("absolute rounded-sm", isHead ? "bg-primary" : "bg-primary/70")}
      style={{
        left: position.x * CELL_SIZE,
        top: position.y * CELL_SIZE,
        width: CELL_SIZE - 2,
        height: CELL_SIZE - 2,
      }}
    />
  );
}

function FoodItem({ position }: { position: Position }) {
  return (
    <div
      className="absolute rounded-full bg-destructive"
      style={{
        left: position.x * CELL_SIZE,
        top: position.y * CELL_SIZE,
        width: CELL_SIZE - 2,
        height: CELL_SIZE - 2,
      }}
    />
  );
}

function GameControls({
  isPlaying,
  gameOver,
  onStart,
}: {
  isPlaying: boolean;
  gameOver: boolean;
  onStart: () => void;
}) {
  if (isPlaying) return null;

  return (
    <Button onClick={onStart} aria-label={gameOver ? "Play snake game again" : "Start snake game"}>
      {gameOver ? "Play Again" : "Start Game"}
    </Button>
  );
}
