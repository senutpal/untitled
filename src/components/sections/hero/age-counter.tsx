"use client";

import { useAgeCounter } from "@/hooks";
import { BIRTH_DATE } from "@/data";
import { cn } from "@/lib/utils";

interface AgeCounterProps {
  className?: string;
}

export function AgeCounter({ className }: AgeCounterProps) {
  const age = useAgeCounter(BIRTH_DATE);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {age}
    </span>
  );
}
