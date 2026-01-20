"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface BlogLinkProps {
  text: string;
  href: string;
  delay?: number;
  className?: string;
}

export function BlogLink({ text, href, delay = 0, className }: BlogLinkProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.a
      href={href}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ delay, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className={cn(
        "group inline-flex items-center gap-2 text-lg text-muted-foreground transition-colors hover:text-foreground md:text-xl",
        className
      )}
    >
      {text}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </motion.a>
  );
}
