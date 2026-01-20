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
  const separator = animateBy === "word" ? " " : "";

  if (prefersReducedMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component ref={ref as React.RefObject<HTMLParagraphElement>} className={cn("flex flex-wrap", className)}>
      {elements.map((element, index) => (
        <motion.span
          key={`${element}-${index}`}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{
            duration: 0.4,
            delay: delay + index * staggerDelay,
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
