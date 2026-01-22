"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks";
import { LucideIcon } from "lucide-react";

interface AnimatedLinkProps {
  text: string;
  href: string;
  icon: LucideIcon;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  iconClassName?: string;
  target?: string;
  rel?: string;
}

export function AnimatedLink({
  text,
  href,
  icon: Icon,
  delay = 0,
  staggerDelay = 0.02,
  className,
  iconClassName,
  target,
  rel,
}: AnimatedLinkProps) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  const words = text.split(" ");

  if (prefersReducedMotion) {
    return (
      <a
        ref={ref as any}
        href={href}
        target={target}
        rel={rel}
        className={cn("group inline-flex items-center gap-2", className)}
      >
        <span>{text}</span>
        <Icon className={cn("h-4 w-4", iconClassName)} />
      </a>
    );
  }

  return (
    <motion.a
      ref={ref as any}
      href={href}
      target={target}
      rel={rel}
      className={cn("group inline-flex flex-wrap items-center gap-1.5", className)}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: Math.min(delay + index * staggerDelay, 2),
              ease: [0.33, 1, 0.68, 1],
            }}
            className="inline-block"
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
          {index === words.length - 1 && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: Math.min(delay + words.length * staggerDelay, 2),
                ease: [0.33, 1, 0.68, 1],
              }}
              className="inline-flex items-center"
            >
              <Icon className={cn("h-4 w-4", iconClassName)} />
            </motion.span>
          )}
        </React.Fragment>
      ))}
    </motion.a>
  );
}
