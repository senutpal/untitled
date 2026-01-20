"use client";

import { TimelineDot } from "./timeline-dot";
import { TimelineContent } from "./timeline-content";
import type { Education } from "@/data";

interface TimelineItemProps {
  education: Education;
  isFirst: boolean;
  isLast: boolean;
}

export function TimelineItem({ education, isFirst, isLast }: TimelineItemProps) {
  return (
    <div className="flex">
      <TimelineDot isFirst={isFirst} isLast={isLast} />
      <TimelineContent education={education} />
    </div>
  );
}
