"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowingBorderProps {
  children: ReactNode;
  className?: string;
}

/**
 * GlowingBorder - Wraps content with an animated traveling glow effect
 * 
 * Features:
 * - Rainbow hue cycling animation
 * - Traveling spotlight that moves around the border perimeter
 * - Conic gradient creates the comet/trail effect
 * - Hover state: pauses animation, expands glow spread
 * - Respects prefers-reduced-motion
 * 
 * CSS Variables (customizable via className or style):
 * - --glow-speed: Animation duration (default: 3s)
 * - --glow-size: Border thickness (default: 4px)
 * - --glow-radius: Border radius (default: 1rem)
 * - --glow-blur: Blur intensity (default: 12px)
 * - --glow-spread: Light spread angle (default: 80deg)
 * 
 * CSS is defined in globals.css using @property for animatable custom properties.
 */
export function GlowingBorder({ children, className }: GlowingBorderProps) {
  return (
    <div className={cn("glowing-border", className)}>
      <div className="glowing-border-content">{children}</div>
    </div>
  );
}
