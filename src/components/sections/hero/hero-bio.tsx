"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { PERSONAL_INFO } from "@/data";
import { TextReveal } from "@/components/ui/text-reveal";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface HeroBioProps {
  className?: string;
}

export function HeroBio({ className }: HeroBioProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("space-y-6 md:space-y-8", className)}>
      {/* TLDR line */}
      <TextReveal
        text={`tldr; ${PERSONAL_INFO.bio.tldr}`}
        as="p"
        delay={0.9}
        staggerDelay={0.02}
        className="font-medium tracking-normal text-base text-muted-foreground md:text-lg"
      />

      {/* Bio lines */}
      <div className="space-y-4 md:space-y-6">
        <TextReveal
          text={PERSONAL_INFO.bio.line1}
          as="p"
          delay={1.1}
          staggerDelay={0.02}
          className="font-medium tracking-normal text-base leading-relaxed md:text-lg"
        />

        <TextReveal
          text={PERSONAL_INFO.bio.line2}
          as="p"
          delay={1.3}
          staggerDelay={0.02}
          className="font-medium tracking-normal text-base leading-relaxed md:text-lg"
        />

        <TextReveal
          text={PERSONAL_INFO.bio.line3}
          as="p"
          delay={1.5}
          staggerDelay={0.02}
          className="font-medium tracking-normal text-base leading-relaxed md:text-lg"
        />
      </div>

      {/* Blog link */}
      <motion.a
        href="#blogs"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="group font-medium tracking-normal inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground md:text-lg"
      >
        {PERSONAL_INFO.bio.blogLink}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </motion.a>
    </div>
  );
}
