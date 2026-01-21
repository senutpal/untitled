"use client";

import { motion } from "motion/react";
import { Avatar } from "@/components/ui/avatar";
import { PERSONAL_INFO } from "@/data";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface HeroAvatarProps {
  className?: string;
}

export function HeroAvatar({ className }: HeroAvatarProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className={cn("mb-8", className)}
    >
      <Avatar
        src={PERSONAL_INFO.avatar}
        alt={PERSONAL_INFO.name}
        size="xl"
        fallback={PERSONAL_INFO.name.charAt(0)}
        className="border-2 border-border shadow-lg"
      />
    </motion.div>
  );
}
