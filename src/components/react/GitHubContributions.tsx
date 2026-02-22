import { ActivityCalendar, type Activity } from "react-activity-calendar";
import { useState, useEffect, useRef, useMemo } from "react";

interface Props {
  data: Activity[];
  totalContributions: number;
}

export function GitHubContributions({ data, totalContributions }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setIsMobile(entry.contentRect.width < 576);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const filteredData = useMemo(() => {
    if (!isMobile) return data;
    const days = 180;
    return data.slice(-days);
  }, [data, isMobile]);

  const blockSize = useMemo(() => {
    if (!containerWidth || !filteredData.length) return 10;
    const weeks = Math.ceil(filteredData.length / 7);
    const blockMargin = 3;
    const totalMargin = (weeks - 1) * blockMargin;
    const available = containerWidth - totalMargin;
    if (weeks === 0) return 10;
    const size = available / weeks;
    return Math.max(Math.floor(size * 10) / 10, 2);
  }, [containerWidth, filteredData.length]);

  const filteredTotal = useMemo(
    () => filteredData.reduce((acc, d) => acc + d.count, 0),
    [filteredData],
  );

  const period = isMobile ? "6 months" : "year";

  const theme = {
    light: [
      "var(--contrib-0)",
      "var(--contrib-1)",
      "var(--contrib-2)",
      "var(--contrib-3)",
      "var(--contrib-4)",
    ],
    dark: [
      "var(--contrib-0)",
      "var(--contrib-1)",
      "var(--contrib-2)",
      "var(--contrib-3)",
      "var(--contrib-4)",
    ],
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {containerWidth > 0 && (
        <div className="w-full flex justify-center overflow-hidden">
          <ActivityCalendar
            data={filteredData}
            theme={theme}
            blockSize={blockSize}
            blockMargin={3}
            blockRadius={2}
            fontSize={12}
            colorScheme={isDark ? "dark" : "light"}
            showTotalCount={false}
            showColorLegend={false}
            showWeekdayLabels={false}
          />
        </div>
      )}

      <div
        className="w-full flex justify-between items-center mt-3 font-mono"
        style={{ fontSize: "11px", color: "var(--text-tertiary)" }}
      >
        <span>
          <span style={{ fontWeight: 500, color: "var(--text-primary)" }}>
            {filteredTotal.toLocaleString()}
          </span>{" "}
          activities in the last {period}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline">less</span>
          <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-2.5 h-2.5 rounded-[1px]"
                style={{ backgroundColor: `var(--contrib-${level})` }}
              />
            ))}
          </div>
          <span className="hidden sm:inline">more</span>
        </div>
      </div>
    </div>
  );
}
