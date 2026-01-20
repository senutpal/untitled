"use client";

import { useState, useEffect, useCallback } from "react";

function calculateAge(birthDate: Date): number {
  const now = Date.now();
  const birth = birthDate.getTime();
  const ageInMilliseconds = now - birth;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return ageInYears;
}

// Update interval: 1 second to balance smoothness and performance
const UPDATE_INTERVAL_MS = 1000;

export function useAgeCounter(birthDate: Date, precision = 9): string {
  const getFormattedAge = useCallback(
    () => calculateAge(birthDate).toFixed(precision),
    [birthDate, precision]
  );

  const [age, setAge] = useState(getFormattedAge);

  useEffect(() => {
    // Update immediately on mount
    setAge(getFormattedAge());

    const interval = setInterval(() => {
      setAge(getFormattedAge());
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [getFormattedAge]);

  return age;
}
