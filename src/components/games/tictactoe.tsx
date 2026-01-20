"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Player = "X" | "O";
type Cell = Player | null;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function TicTacToeGame() {
  const [board, setBoard] = React.useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = React.useState<Player>("X");
  const [winner, setWinner] = React.useState<Player | "draw" | null>(null);

  const checkWinner = (squares: Cell[]): Player | "draw" | null => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((cell) => cell !== null)) {
      return "draw";
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <GameStatus currentPlayer={currentPlayer} winner={winner} />
      <GameBoard board={board} onCellClick={handleCellClick} winner={winner} />
      <Button onClick={resetGame} variant="secondary">
        Reset Game
      </Button>
    </div>
  );
}

function GameStatus({ currentPlayer, winner }: { currentPlayer: Player; winner: Player | "draw" | null }) {
  if (winner === "draw") {
    return <p className="font-mono text-lg">Draw!</p>;
  }
  if (winner) {
    return <p className="font-mono text-lg">{winner} wins!</p>;
  }
  return <p className="font-mono text-lg">Player {currentPlayer}'s turn</p>;
}

function GameBoard({
  board,
  onCellClick,
  winner,
}: {
  board: Cell[];
  onCellClick: (index: number) => void;
  winner: Player | "draw" | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <GameCell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          disabled={!!winner}
        />
      ))}
    </div>
  );
}

function GameCell({
  value,
  onClick,
  disabled,
}: {
  value: Cell;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-colors",
        value === "X" && "bg-primary/10 text-primary",
        value === "O" && "bg-destructive/10 text-destructive",
        !value && !disabled && "hover:bg-accent"
      )}
    >
      {value}
    </button>
  );
}
