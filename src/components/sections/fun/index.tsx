"use client";

import * as React from "react";
import { Container, Section, SectionTitle } from "@/components/layout";
import { GAMES, type Game } from "@/data";
import { GameCard } from "./game-card";
import { GameModal } from "./game-modal";

export function FunSection() {
  const [selectedGame, setSelectedGame] = React.useState<Game | null>(null);

  const handleOpenGame = (game: Game) => {
    setSelectedGame(game);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  return (
    <Section id="fun">
      <Container>
        <SectionTitle>Fun</SectionTitle>
        
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {GAMES.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              index={index}
              onClick={() => handleOpenGame(game)}
            />
          ))}
        </div>
        
        <GameModal
          game={selectedGame}
          isOpen={!!selectedGame}
          onClose={handleCloseGame}
        />
      </Container>
    </Section>
  );
}
