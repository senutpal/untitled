"use client";

import { useState, useEffect, useMemo } from "react";

export function useScrollSection(sectionIds: string[]): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Create a stable key for the dependency array
  const idsKey = useMemo(() => JSON.stringify(sectionIds), [sectionIds]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);
        if (intersectingEntries.length > 0) {
          const bestEntry = intersectingEntries.reduce((best, current) => {
            return (current.intersectionRatio > best.intersectionRatio) ? current : best;
          });
          setActiveSection(bestEntry.target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-20% 0px -60% 0px" }
    );

    // Parse the key back to array
    const ids = JSON.parse(idsKey);
    
    ids.forEach((id: string) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [idsKey]);

  return activeSection;
}
