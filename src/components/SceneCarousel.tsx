import { useState, useEffect } from 'react';
import codingSvg from '../assets/scenes/coding.svg?raw';
import gamingSvg from '../assets/scenes/gaming.svg?raw';
import readingSvg from '../assets/scenes/reading.svg?raw';

const scenes = [codingSvg, gamingSvg, readingSvg];

const HOLD_MS = 4000;
const FADE_MS = 1000;
const CYCLE_MS = HOLD_MS + FADE_MS;

export default function SceneCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % scenes.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
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
      <style>{`
        .scene-carousel svg { width: 100%; height: 100%; }
        .dark .scene-carousel { filter: invert(0.88) hue-rotate(180deg); }
      `}</style>
      {scenes.map((svg, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: i === activeIndex ? 1 : 0,
            transform: i === activeIndex ? 'scale(1)' : 'scale(0.97)',
            transition: `opacity ${FADE_MS}ms ease-in-out, transform ${FADE_MS}ms ease-in-out`,
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ))}
    </div>
  );
}
