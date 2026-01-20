import { cn } from "@/lib/utils";

interface TimelineDotProps {
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
}

export function TimelineDot({ isFirst, isLast, className }: TimelineDotProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Connector line above */}
      {!isFirst && (
        <div className="absolute bottom-full h-full w-px bg-border" />
      )}
      
      {/* Dot */}
      <div className="relative z-10 h-3 w-3 rounded-full border-2 border-primary bg-background" />
      
      {/* Connector line below */}
      {!isLast && (
        <div className="absolute top-full h-full w-px bg-border" />
      )}
    </div>
  );
}
