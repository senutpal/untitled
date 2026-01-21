"use client";

import { TextReveal } from "@/components/ui/text-reveal";
import { PERSONAL_INFO } from "@/data";
import { cn } from "@/lib/utils";

interface HeroTitleProps {
  className?: string;
}

export function HeroTitle({ className }: HeroTitleProps) {
  return (
    <div className={cn("mb-2", className)}>
      <TextReveal
        text={`hi, i'm ${PERSONAL_INFO.name.toLowerCase()}`}
        as="h1"
        delay={0.3}
        staggerDelay={0.04}
        className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl"
      />
    </div>
  );
}
