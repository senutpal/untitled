"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  className?: string;
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
  const prefersReducedMotion = useReducedMotion();

  const handleClick = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.4 }}
      className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      aria-label="Scroll to about section"
    >
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, 6, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="h-6 w-6" />
      </motion.div>
    </motion.button>
  );
}
