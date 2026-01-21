"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function createShuffledCards(): Card[] {
  return [...EMOJIS, ...EMOJIS]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
}

export function MemoryGame() {
  const [cards, setCards] = React.useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = React.useState<number[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  const initializeGame = React.useCallback(() => {
    setCards(createShuffledCards());
    setFlippedCards([]);
    setMoves(0);
    setIsComplete(false);
  }, []);

  React.useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    
    const clickedCard = cards[id];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    // Immutable flip
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            );
            if (updated.every((c) => c.isMatched)) {
              setIsComplete(true);
            }
            return updated;
          });
          setFlippedCards([]);
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <GameHeader moves={moves} isComplete={isComplete} />
      <CardGrid cards={cards} onCardClick={handleCardClick} />
      <Button onClick={initializeGame} variant="secondary" aria-label="Reset memory game">
        Reset Game
      </Button>
    </div>
  );
}

function GameHeader({ moves, isComplete }: { moves: number; isComplete: boolean }) {
  return (
    <div className="text-center">
      <p className="font-mono text-lg">Moves: {moves}</p>
      {isComplete && <p className="text-primary">Congratulations!</p>}
    </div>
  );
}

function CardGrid({ cards, onCardClick }: { cards: Card[]; onCardClick: (id: number) => void }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {cards.map((card) => (
        <MemoryCard key={card.id} card={card} onClick={() => onCardClick(card.id)} />
      ))}
    </div>
  );
}

function MemoryCard({ card, onClick }: { card: Card; onClick: () => void }) {
  const showEmoji = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={showEmoji ? `Card showing ${card.emoji}` : "Hidden card"}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-lg text-2xl transition-all duration-200",
        showEmoji ? "bg-card border-2" : "bg-primary/20 hover:bg-primary/30",
        card.isMatched && "opacity-50"
      )}
    >
      {showEmoji ? card.emoji : "?"}
    </button>
  );
}
