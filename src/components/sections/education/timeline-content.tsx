"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Education } from "@/data";

interface TimelineContentProps {
  education: Education;
  className?: string;
}

export function TimelineContent({ education, className }: TimelineContentProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className={cn("pb-8 pl-4", className)}
    >
      <p className="mb-1 font-mono text-sm text-muted-foreground">
        {education.period}
      </p>
      <h3 className="text-lg font-semibold">{education.institution}</h3>
      <p className="text-muted-foreground">
        {education.degree}
        {education.field && ` in ${education.field}`}
      </p>
      {education.description && (
        <p className="mt-2 text-sm text-muted-foreground">
          {education.description}
        </p>
      )}
    </motion.div>
  );
}
