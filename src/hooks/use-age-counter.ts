"use client";

import { useState, useEffect, useCallback, useRef } from "react";

function calculateAge(birthDate: Date): number {
  const now = Date.now();
  const birth = birthDate.getTime();
  const ageInMilliseconds = now - birth;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return ageInYears;
}

// Use requestAnimationFrame for smooth ~60fps updates
// This ensures digits increment smoothly (1, 2, 3, 4, 5...) instead of jumping

export function useAgeCounter(birthDate: Date, precision = 9): string {
  const getFormattedAge = useCallback(
    () => calculateAge(birthDate).toFixed(precision),
    [birthDate, precision]
  );

  const [age, setAge] = useState(() => getFormattedAge());
  const frameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    // Throttle updates to ~30fps for performance while still looking smooth
    // 30fps = ~33ms between frames, which is enough for smooth digit transitions
    const THROTTLE_MS = 33;

    const update = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current >= THROTTLE_MS) {
        setAge(getFormattedAge());
        lastUpdateRef.current = timestamp;
      }
      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [getFormattedAge]);

  return age;
}
