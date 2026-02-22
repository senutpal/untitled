import { useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';

interface MagnetLinesProps {
  rows?: number;
  columns?: number;
  containerSize?: string;
  lineColor?: string;
  lineWidth?: string;
  lineHeight?: string;
  baseAngle?: number;
  className?: string;
  style?: CSSProperties;
}

const MagnetLines: React.FC<MagnetLinesProps> = ({
  rows = 9,
  columns = 9,
  containerSize = '100%',
  lineColor = '#efefef',
  lineWidth = '1vmin',
  lineHeight = '6vmin',
  baseAngle = -10,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLSpanElement>('span');
    let rafId = 0;
    let pointer = { x: 0, y: 0 };
    let visible = true;
    let dirty = false;

    const update = () => {
      rafId = 0;
      dirty = false;
      if (!visible) return;
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;

        const b = pointer.x - cx;
        const a = pointer.y - cy;
        const c = Math.sqrt(a * a + b * b) || 1;
        const r =
          ((Math.acos(b / c) * 180) / Math.PI) * (pointer.y > cy ? 1 : -1);

        item.style.setProperty('--rotate', `${r}deg`);
      });
    };

    const scheduleUpdate = () => {
      if (!dirty) {
        dirty = true;
        rafId = requestAnimationFrame(update);
      }
    };

    // Initial orientation toward center of grid
    if (items.length) {
      const mid = Math.floor(items.length / 2);
      const rect = items[mid].getBoundingClientRect();
      pointer = { x: rect.x, y: rect.y };
      scheduleUpdate();
    }

    const handlePointerMove = (e: PointerEvent) => {
      pointer = { x: e.x, y: e.y };
      scheduleUpdate();
    };

    const visObs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) scheduleUpdate();
      },
      { threshold: 0 },
    );
    visObs.observe(container);

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
      visObs.disconnect();
    };
  }, [rows, columns]);

  const total = rows * columns;
  const spans = Array.from({ length: total }, (_, i) => (
    <span
      key={i}
      className="block origin-center"
      style={{
        backgroundColor: lineColor,
        width: lineWidth,
        height: lineHeight,
        // @ts-expect-error CSS custom property
        '--rotate': `${baseAngle}deg`,
        transform: 'rotate(var(--rotate))',
      }}
    />
  ));

  return (
    <div
      ref={containerRef}
      className={`grid place-items-center ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: containerSize,
        height: containerSize,
        ...style,
      }}
    >
      {spans}
    </div>
  );
};

export default MagnetLines;
