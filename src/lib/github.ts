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
    // Return mock data if no token
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

  const json = await response.json();
  const calendar = json.data.user.contributionsCollection.contributionCalendar;

  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
  };
}

function generateMockData(): HeatmapData {
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push({
        date: '',
        contributionCount: Math.random() > 0.4 ? Math.floor(Math.random() * 10) : 0,
      });
    }
    weeks.push({ contributionDays: days });
  }
  return { totalContributions: 729, weeks };
}
