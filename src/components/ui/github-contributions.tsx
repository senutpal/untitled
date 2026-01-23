"use client";

import { ActivityCalendar, Activity } from "react-activity-calendar";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { GITHUB_API_URL, MAX_DATA_DAYS, flattenContributions, processData } from "@/lib/github-contributions/utils";

export function GitHubContributions() {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("year");

  const [screenWidth, setScreenWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateWidth = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const newPeriod = screenWidth < 576 ? "6 months" : "year";
    setPeriod(newPeriod);
  }, [screenWidth]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 1, currentYear].join(",");

        const res = await fetch(
          `${GITHUB_API_URL}/senutpal?format=nested&years=${years}`,
        );
        if (!res.ok) throw new Error("Failed to fetch GitHub data");

        const json = await res.json();
        const allActivities = flattenContributions(json.contributions);
        const processed = processData(allActivities, MAX_DATA_DAYS);
        setData(processed);
      } catch {
        setError("Failed to load contributions");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const days = screenWidth < 576 ? 180 : 365;
  const filteredData = useMemo(() => processData(data, days), [data, days]);

  const blockSize = useMemo(() => {
    if (!containerWidth || !filteredData.length) return 10;

    const weeks = Math.ceil(filteredData.length / 7);
    const blockMargin = 3;
    const totalMargin = (weeks - 1) * blockMargin;
    const availableSpace = containerWidth - totalMargin;

    if (weeks === 0) return 10;

    const size = availableSpace / weeks;
    return Math.max(Math.floor(size * 10) / 10, 2);
  }, [containerWidth, filteredData.length]);

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

  const totalContributions = filteredData.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  if (error) return null;

  return (
    <motion.div
      ref={containerRef}
      className="w-full flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.32, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
    >
      {loading ? (
        <div className="w-full flex flex-col gap-4">
          <div className="w-full h-32 bg-muted/20 animate-pulse rounded-md" />
          <div className="flex justify-between items-center px-1">
            <div className="h-3 w-32 bg-muted/20 animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted/20 animate-pulse rounded" />
          </div>
        </div>
      ) : (
        <>
          {containerWidth > 0 && (
            <div className="w-full flex justify-center overflow-hidden">
              <ActivityCalendar
                data={filteredData}
                theme={theme}
                blockSize={blockSize}
                blockMargin={3}
                blockRadius={2}
                fontSize={12}
                colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
                showTotalCount={false}
                showColorLegend={false}
                showWeekdayLabels={false}
              />
            </div>
          )}

          <div className="w-full flex justify-between items-center mt-3 text-xs md:text-[13px] text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">
                {totalContributions.toLocaleString()}
              </span>{" "}
              activites in the last {period}
            </span>

            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="w-2.5 h-2.5 rounded-[1px]"
                    style={{ backgroundColor: `var(--contrib-${level})` }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
