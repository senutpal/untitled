import { Activity } from "react-activity-calendar";

export const GITHUB_API_URL = process.env.NEXT_PUBLIC_GITHUB_API_URL || "https://github-contributions-api.jogruber.de/v4";

export const MAX_DATA_DAYS = 365;

export function flattenContributions(contributions: {
  [year: string]: {
    [month: string]: {
      [day: string]: Activity;
    };
  };
}): Activity[] {
  const activities: Activity[] = [];
  const years = Object.keys(contributions).sort();

  years.forEach((year) => {
    const months = contributions[year];
    const sortedMonths = Object.keys(months).sort(
      (a, b) => parseInt(a) - parseInt(b),
    );

    sortedMonths.forEach((month) => {
      const days = months[month];
      const sortedDays = Object.keys(days).sort(
        (a, b) => parseInt(a) - parseInt(b),
      );

      sortedDays.forEach((day) => {
        activities.push(days[day]);
      });
    });
  });

  return activities;
}

export function processData(activities: Activity[], days: number = 365): Activity[] {
  if (!activities.length) return [];

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const targetStart = new Date(today);
  targetStart.setDate(targetStart.getDate() - days);

  const dayOfWeek = targetStart.getDay();
  const alignedStart = new Date(targetStart);
  alignedStart.setDate(targetStart.getDate() - dayOfWeek);
  alignedStart.setHours(0, 0, 0, 0);

  const parseLocalDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  return activities
    .filter((activity) => {
      const date = parseLocalDate(activity.date);
      return date >= alignedStart && date <= today;
    })
    .sort(
      (a, b) =>
        parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime(),
    );
}