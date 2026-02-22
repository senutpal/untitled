interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface HeatmapData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export async function fetchGitHubContributions(username: string): Promise<HeatmapData> {
  const token = import.meta.env.GITHUB_TOKEN;

  if (!token) {
    return generateMockData();
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  if (!response.ok) {
    console.warn(`[github] API returned ${response.status}`);
    return generateMockData();
  }

  const json = await response.json();
  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) {
    return generateMockData();
  }

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
  };
}

function generateMockData(): HeatmapData {
  const weeks = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay());

  let total = 0;
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(date.getDate() + w * 7 + d);
      const count = Math.random() > 0.4 ? Math.floor(Math.random() * 10) : 0;
      total += count;
      days.push({
        date: date.toISOString().split('T')[0],
        contributionCount: count,
      });
    }
    weeks.push({ contributionDays: days });
  }
  return { totalContributions: total, weeks };
}
