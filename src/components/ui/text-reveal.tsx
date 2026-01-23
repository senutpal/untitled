"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  animateBy?: "word" | "character";
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.05,
  as: Component = "p",
  animateBy = "word",
}: TextRevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  const elements = animateBy === "word" ? text.split(" ") : text.split("");

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component ref={ref as any} className={cn("flex flex-wrap", className)}>
      {elements.map((element, index) => (
        <motion.span
          key={`${element}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.3,
            delay: Math.min(delay + index * staggerDelay, 2), // Cap delay to prevent excessive delays
            ease: [0.33, 1, 0.68, 1],
          }}
          className="inline-block"
        >
          {element}
          {animateBy === "word" && index < elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Component>
  );
}
