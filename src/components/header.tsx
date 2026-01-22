"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useAgeCounter } from "@/hooks";
import { BIRTH_DATE, PERSONAL_INFO } from "@/data";

export function Header() {
  const age = useAgeCounter(BIRTH_DATE, 9);
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40",
        "flex flex-col items-center gap-3",
        "px-[var(--side-margin)] py-4",
        "bg-background/80 backdrop-blur-md",
        "md:flex-row md:justify-between md:items-center md:py-3"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center text-center",
          "md:flex-row md:gap-2 md:text-left"
        )}
      >
        <span className="text-base font-medium text-foreground md:text-lg">
          hi, i&apos;m {PERSONAL_INFO.name.toLowerCase()}
        </span>
        <span className="text-sm text-muted-foreground md:text-base">
          been here for {age} years
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Avatar
          src={PERSONAL_INFO.avatar}
          alt={PERSONAL_INFO.name}
          size="md"
          fallback={PERSONAL_INFO.name.charAt(0)}
          className={cn(
            "h-10 w-10 shrink-0",
            !prefersReducedMotion && "animate-in fade-in zoom-in duration-500"
          )}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
