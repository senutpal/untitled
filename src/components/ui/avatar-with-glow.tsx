"use client";

import { cn } from "@/lib/utils";
import { PERSONAL_INFO } from "@/data";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks";
import * as React from "react";
import { GlowingBorder } from "./glowing-border";

export interface AvatarWithGlowProps {
  className?: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

export function AvatarWithGlow({
  className,
  avatarSrc = PERSONAL_INFO.avatar,
  avatarAlt = PERSONAL_INFO.name,
}: AvatarWithGlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      className={cn("relative inline-block", className)}
    >
      {/* Avatar with glowing border and triple border effect */}
      <GlowingBorder className="relative z-20">
        {/* Muted thick border */}
        <div className="rounded-[16px] bg-muted p-1.5 dark:bg-muted/55">
          {/* Inner thin border */}
          <div className="overflow-hidden rounded-xl border border-border dark:border-border/30">
            <AvatarImage src={avatarSrc} alt={avatarAlt} />
          </div>
        </div>
      </GlowingBorder>
    </motion.div>
  );
}

function AvatarImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className="h-20 w-20 bg-muted md:h-24 md:w-24">
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xl font-medium uppercase text-muted-foreground">
          {alt?.charAt(0) || "?"}
        </span>
      )}
    </div>
  );
}
