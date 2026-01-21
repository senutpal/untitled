"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks";
import type { Game } from "@/data";

interface GameCardProps {
  game: Game;
  index: number;
  onClick: () => void;
}

export function GameCard({ game, index, onClick }: GameCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      <button type="button" onClick={onClick} className="w-full text-left">
        <Card className="group transition-all hover:shadow-md hover:scale-[1.02]">
          <CardContent className="p-6">
            <GameCardIcon icon={game.icon} />
            <GameCardTitle name={game.name} />
            <GameCardDescription description={game.description} />
          </CardContent>
        </Card>
      </button>
    </motion.div>
  );
}

function GameCardIcon({ icon }: { icon: string }) {
  return (
    <div className="mb-3 text-3xl">
      {icon}
    </div>
  );
}

function GameCardTitle({ name }: { name: string }) {
  return (
    <h3 className="font-semibold">{name}</h3>
  );
}

function GameCardDescription({ description }: { description: string }) {
  return (
    <p className="text-sm text-muted-foreground">{description}</p>
  );
}
