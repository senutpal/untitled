"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Game } from "@/data";
import { SnakeGame } from "@/components/games/snake";
import { TicTacToeGame } from "@/components/games/tictactoe";
import { MemoryGame } from "@/components/games/memory";
import { TypingGame } from "@/components/games/typing";

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GameModal({ game, isOpen, onClose }: GameModalProps) {
  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{game.icon}</span>
            <span>{game.name}</span>
          </DialogTitle>
          <DialogDescription>{game.description}</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <GameRenderer gameId={game.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GameRenderer({ gameId }: { gameId: string }) {
  switch (gameId) {
    case "snake":
      return <SnakeGame />;
    case "tictactoe":
      return <TicTacToeGame />;
    case "memory":
      return <MemoryGame />;
    case "typing":
      return <TypingGame />;
    default:
      return <p className="text-center text-muted-foreground">Game coming soon!</p>;
  }
}
