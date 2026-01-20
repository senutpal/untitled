"use client";

import { TextReveal } from "@/components/ui/text-reveal";
import { cn } from "@/lib/utils";

interface AboutLineProps {
  text: string;
  delay?: number;
  className?: string;
}

export function AboutLine({ text, delay = 0, className }: AboutLineProps) {
  return (
    <TextReveal
      text={text}
      as="p"
      delay={delay}
      staggerDelay={0.02}
      className={cn("text-lg leading-relaxed md:text-xl", className)}
    />
  );
}
