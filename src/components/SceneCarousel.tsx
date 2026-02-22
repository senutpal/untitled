import { useState, useEffect } from 'react';
import codingSvg from '../assets/scenes/coding.svg?raw';
import gamingSvg from '../assets/scenes/gaming.svg?raw';
import readingSvg from '../assets/scenes/reading.svg?raw';

const scenes = [codingSvg, gamingSvg, readingSvg];

export default function SceneCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % scenes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="scene-carousel"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1',
      }}
    >
      <style>{`.scene-carousel svg { width: 100%; height: 100%; }`}</style>
      {scenes.map((svg, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: index === activeIndex ? 1 : 0,
            transform: index === activeIndex ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 1000ms ease-in-out, transform 1000ms ease-in-out',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ))}
    </div>
  );
}
