import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "wide" | "full";
}

const sizeClasses = {
  default: "max-w-[720px]",
  wide: "max-w-[1024px]",
  full: "max-w-none",
};

export function Container({
  children,
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--side-margin)]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
