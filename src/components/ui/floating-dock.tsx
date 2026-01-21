"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReducedMotion, useMobile } from "@/hooks";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DockItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isActive?: boolean;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const isMobile = useMobile();
  const prefersReducedMotion = useReducedMotion();

  return (
    <TooltipProvider delayDuration={0}>
      <nav
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
          className
        )}
        aria-label="Main navigation"
      >
        <motion.div
          initial={prefersReducedMotion ? {} : { y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="flex items-center gap-1 rounded-full border bg-background/80 px-2 py-2 shadow-lg backdrop-blur-md"
        >
          {items.map((item) => (
            <DockItemButton
              key={item.id}
              item={item}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>
      </nav>
    </TooltipProvider>
  );
}

interface DockItemButtonProps {
  item: DockItem;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

function DockItemButton({ item, isMobile, prefersReducedMotion }: DockItemButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (item.href) {
      document.getElementById(item.href)?.scrollIntoView({ behavior: "smooth" });
    }
    item.onClick?.();
  };

  const button = (
    <motion.button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        item.isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      whileHover={prefersReducedMotion || isMobile ? {} : { scale: 1.15 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      aria-label={item.label}
      aria-current={item.isActive ? "page" : undefined}
    >
      {item.icon}
      {item.isActive && !prefersReducedMotion && (
        <motion.div
          layoutId="dock-active-indicator"
          className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );

  if (isMobile) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}
