"use client";

import { motion } from "motion/react";
import { PERSONAL_INFO } from "@/data";
import { AgeCounter } from "./age-counter";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface HeroSubtitleProps {
  className?: string;
}

export function HeroSubtitle({ className }: HeroSubtitleProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.p
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className={cn(
        "text-lg text-muted-foreground md:text-xl",
        className
      )}
    >
      {PERSONAL_INFO.tagline}{" "}
      <AgeCounter className="text-foreground" />{" "}
      <span className="text-muted-foreground">years</span>
    </motion.p>
  );
}
