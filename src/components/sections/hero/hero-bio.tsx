"use client";

import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { PERSONAL_INFO } from "@/data";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/ui/text-reveal";
import { AnimatedLink } from "@/components/ui/animated-link";

// Animation delays
const TLDR_DELAY = 0.54;
const LINE1_DELAY = 0.66;
const LINE2_DELAY = 0.78;
const LINE3_DELAY = 0.9;
const RESUME_LINK_DELAY = 1.02;
const BLOG_LINK_DELAY = 1.14;
const DIVIDER_ANIMATION_DURATION = 0.3;
const DIVIDER_STAGGER_DELAY = 0.01;

interface HeroBioProps {
  className?: string;
}

export function HeroBio({ className }: HeroBioProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("space-y-3 md:space-y-5", className)}>
      {/* TLDR line */}
      <TextReveal
        text={`tldr; ${PERSONAL_INFO.bio.tldr}`}
        as="p"
        delay={TLDR_DELAY}
        staggerDelay={DIVIDER_STAGGER_DELAY}
        className="font-medium tracking-normal text-base md:text-lg"
      />

      {/* Bio lines */}
      <div className="space-y-0.5 md:space-y-1 text-muted-foreground">
        <TextReveal
          text={PERSONAL_INFO.bio.line1}
          as="p"
          delay={LINE1_DELAY}
          staggerDelay={DIVIDER_STAGGER_DELAY}
          className="font-medium tracking-normal text-base leading-relaxed md:text-lg"
        />

        <TextReveal
          text={PERSONAL_INFO.bio.line2}
          as="p"
          delay={LINE2_DELAY}
          staggerDelay={DIVIDER_STAGGER_DELAY}
          className="font-medium tracking-normal text-base leading-relaxed md:text-lg"
        />

        <TextReveal
          text={PERSONAL_INFO.bio.line3}
          as="p"
          delay={LINE3_DELAY}
          staggerDelay={DIVIDER_STAGGER_DELAY}
          className="font-medium tracking-normal text-base leading-relaxed md:text-lg"
        />
      </div>

      {/* Resume and Blog links */}
      <div className="flex items-center gap-2 font-medium tracking-normal text-base leading-relaxed md:text-lg">
        <AnimatedLink
          text={PERSONAL_INFO.bio.resumeLink.text}
          href={PERSONAL_INFO.bio.resumeLink.url}
          icon={ArrowUpRight}
          delay={RESUME_LINK_DELAY}
          className="text-foreground underline-offset-2 hover:underline"
          iconClassName="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          target="_blank"
          rel="noopener noreferrer"
        />

        <motion.span
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { delay: BLOG_LINK_DELAY, duration: DIVIDER_ANIMATION_DURATION, ease: [0.33, 1, 0.68, 1] }
          }
          className="text-muted-foreground"
        >
          |
        </motion.span>

        <AnimatedLink
          text={PERSONAL_INFO.bio.blogLink}
          href="#blogs"
          aria-label="Read my blogs"
          icon={ArrowRight}
          delay={BLOG_LINK_DELAY}
          className="text-muted-foreground hover:text-foreground"
          iconClassName="transition-transform group-hover:translate-x-1"
        />
      </div>
    </div>
  );
}
