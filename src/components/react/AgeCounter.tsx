import { useState, useEffect } from 'react';

interface Props {
  birthTimestamp: number; // Unix ms timestamp of birth
}

export default function AgeCounter({ birthTimestamp }: Props) {
  const calcAge = () => (Date.now() - birthTimestamp) / (365.25 * 24 * 60 * 60 * 1000);
  const [age, setAge] = useState(calcAge);

  useEffect(() => {
    const interval = setInterval(() => setAge(calcAge()), 100);
    return () => clearInterval(interval);
  }, [birthTimestamp]);

  return <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{age.toFixed(9)}</span>;
}
