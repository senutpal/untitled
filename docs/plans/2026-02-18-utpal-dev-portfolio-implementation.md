# utpal.dev Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a personal portfolio site at utpal.dev with a code-editor aesthetic, powered by Astro + React islands + TailwindCSS, with real GitHub heatmap data, Spotify integration, MDX blog posts, and dark mode.

**Architecture:** Astro static site with four React islands (AgeCounter, SpotifyPlayer, GameModal, DarkModeToggle). Content collections for blog, projects, and reading list. Hybrid output mode for the Spotify API route. All styling via TailwindCSS with CSS custom properties for theming.

**Tech Stack:** Astro 5, React 19, TypeScript, TailwindCSS 4, @astrojs/react, @astrojs/mdx, @astrojs/sitemap, lucide-react

**Design doc:** `docs/plans/2026-02-18-utpal-dev-portfolio-design.md`

---

## Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `src/styles/global.css`, `src/pages/index.astro`, `src/layouts/BaseLayout.astro`

**Step 1: Create Astro project**

Run from `D:\VsCode\untitled`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --no-git
```

If prompted, accept defaults. This scaffolds a minimal Astro project in the current directory.

**Step 2: Install dependencies**

```bash
npm install @astrojs/react @astrojs/tailwind @astrojs/sitemap @astrojs/mdx react react-dom lucide-react
npm install -D @types/react @types/react-dom tailwindcss
```

**Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://utpal.dev',
  output: 'hybrid',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
    mdx(),
  ],
});
```

**Step 4: Configure Tailwind**

Create `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        accent: 'var(--accent)',
        surface: 'var(--surface)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
};
```

**Step 5: Create global styles**

Create `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f2f4f7;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --accent: #4f46e5;
  --surface: rgba(255, 255, 255, 0.5);
  --border: #e5e7eb;
  --status-bar-bg: #e5e7eb;
  --status-bar-border: #d1d5db;
  --gutter-color: #9ca3af;
}

.dark {
  --bg: #0f1117;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
  --accent: #818cf8;
  --surface: rgba(31, 41, 55, 0.5);
  --border: #374151;
  --status-bar-bg: #1f2937;
  --status-bar-border: #374151;
  --gutter-color: #4b5563;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  margin: 0;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Fade-in animation */
.fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}
.fade-in-delay-1 { animation-delay: 0.2s; }
.fade-in-delay-2 { animation-delay: 0.4s; }
.fade-in-delay-3 { animation-delay: 0.6s; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Hover link style */
.hover-link {
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--border);
  transition: all 0.2s ease;
}
.hover-link:hover {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* Heatmap grid */
.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  grid-auto-flow: column;
  gap: 3px;
}
```

**Step 6: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description = "utpal's portfolio — full-stack developer, ai/ml, devops, distributed systems", ogImage } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalURL} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {ogImage && <meta property="og:image" content={ogImage} />}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <!-- Dark mode: prevent flash -->
  <script is:inline>
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  </script>

  <!-- Global styles -->
  <style>
    @import '../styles/global.css';
  </style>
</head>
<body class="pb-24">
  <slot />

  <!-- Fade-in observer -->
  <script is:inline>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-on-scroll').forEach(el => observer.observe(el));
  </script>
</body>
</html>
```

**Step 7: Create minimal index page**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="utpal.dev">
  <main class="max-w-3xl mx-auto px-6 md:px-0 md:pl-16 pt-16 md:pt-24 space-y-24">
    <h1 class="text-4xl font-semibold tracking-tight text-text-primary">hi, i'm utpal.</h1>
  </main>
</BaseLayout>
```

**Step 8: Verify it runs**

```bash
npm run dev
```

Expected: Dev server starts on `localhost:4321`, page shows "hi, i'm utpal." with correct fonts and background color.

**Step 9: Initialize git and commit**

```bash
git init
```

Create `.gitignore`:
```
node_modules/
dist/
.astro/
.env
.env.*
```

```bash
git add -A
git commit -m "feat: scaffold astro project with react, tailwind, mdx, sitemap"
```

---

## Task 2: Content Collections Setup

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/arithmetics-with-typescript-types.mdx`
- Create: `src/content/blog/fixing-cs-education.mdx`
- Create: `src/content/blog/the-grand-plan.mdx`
- Create: `src/content/projects/neural-search-engine.md`
- Create: `src/content/projects/k8s-autoscaler.md`
- Create: `src/content/projects/minimal-terminal.md`
- Create: `src/content/reading/ddia.md`
- Create: `src/content/reading/pragmatic-programmer.md`
- Create: `src/content/reading/vector-database-blog.md`
- Create: `src/content/reading/discord-messages-blog.md`
- Create: `src/content/reading/database-in-rust-video.md`
- Create: `src/content/reading/kafka-internals-video.md`

**Step 1: Define content collection schemas**

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    github: z.string(),
    demo: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const reading = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    type: z.enum(['book', 'blog', 'video']),
    status: z.enum(['reading', 'on-deck', 'completed']),
    url: z.string(),
    duration: z.string().optional(),
  }),
});

export const collections = { blog, projects, reading };
```

**Step 2: Create sample blog posts**

Create `src/content/blog/arithmetics-with-typescript-types.mdx`:

```mdx
---
title: "arithmetics with typescript types"
description: "pushing the type system to its absolute limits for no reason."
date: 2024-05-13
tags: ["typescript", "types"]
draft: false
---

pushing the type system to its absolute limits for no reason.
```

Create `src/content/blog/fixing-cs-education.mdx`:

```mdx
---
title: "fixing cs education"
description: "why we need more systems programming and less framework fatigue."
date: 2024-03-12
tags: ["education", "systems"]
draft: false
---

why we need more systems programming and less framework fatigue.
```

Create `src/content/blog/the-grand-plan.mdx`:

```mdx
---
title: "the grand plan"
description: "a manifesto on slow software and digital permaculture."
date: 2024-02-01
tags: ["philosophy", "software"]
draft: false
---

a manifesto on slow software and digital permaculture.
```

**Step 3: Create sample project entries**

Create `src/content/projects/neural-search-engine.md`:

```markdown
---
name: "neural-search-engine"
description: "distributed vector search engine built from scratch. handles 1m+ vectors with <50ms latency using custom hsw indices."
tech: ["rust", "grpc", "react"]
github: "#"
featured: true
order: 1
---
```

Create `src/content/projects/k8s-autoscaler.md`:

```markdown
---
name: "k8s-autoscaler"
description: "predictive pod autoscaling using lstm models to forecast traffic spikes. reduced cloud costs by 24% in staging."
tech: ["go", "python", "kubernetes"]
github: "#"
demo: "#"
featured: true
order: 2
---
```

Create `src/content/projects/minimal-terminal.md`:

```markdown
---
name: "minimal-terminal"
description: "browser-based terminal emulator with local filesystem access via webassembly."
tech: ["ts", "wasm", "xterm.js"]
github: "#"
featured: true
order: 3
---
```

**Step 4: Create sample reading list entries**

Create `src/content/reading/ddia.md`:

```markdown
---
title: "Designing Data-Intensive Applications"
author: "martin kleppmann"
type: "book"
status: "reading"
url: "#"
---
```

Create `src/content/reading/pragmatic-programmer.md`:

```markdown
---
title: "The Pragmatic Programmer"
author: "david thomas & andrew hunt"
type: "book"
status: "on-deck"
url: "#"
---
```

Create `src/content/reading/vector-database-blog.md`:

```markdown
---
title: "Building a Vector Database from Scratch"
author: "engineering blog · pinecone"
type: "blog"
status: "completed"
url: "#"
---
```

Create `src/content/reading/discord-messages-blog.md`:

```markdown
---
title: "How Discord Stores Trillions of Messages"
author: "systems design · discord engineering"
type: "blog"
status: "completed"
url: "#"
---
```

Create `src/content/reading/database-in-rust-video.md`:

```markdown
---
title: "Building a Database in Rust"
author: "jon gjengset"
type: "video"
status: "completed"
url: "#"
duration: "2:34:12"
---
```

Create `src/content/reading/kafka-internals-video.md`:

```markdown
---
title: "Kafka Internals: How it Works"
author: "martin kleppmann"
type: "video"
status: "completed"
url: "#"
duration: "45:23"
---
```

**Step 5: Verify collections work**

```bash
npm run dev
```

Expected: No errors about content collections. Astro should recognize the schemas.

**Step 6: Commit**

```bash
git add src/content/
git commit -m "feat: add content collections with blog, projects, reading list schemas and sample data"
```

---

## Task 3: Reusable Components — SectionHeader, GutterColumn, DarkModeToggle

**Files:**
- Create: `src/components/SectionHeader.astro`
- Create: `src/components/GutterColumn.astro`
- Create: `src/components/DarkModeToggle.astro`

**Step 1: Create SectionHeader**

Create `src/components/SectionHeader.astro`:

```astro
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---

<span class="font-mono text-[0.85rem] text-text-secondary mb-6 block">// {title}</span>
```

**Step 2: Create GutterColumn**

Create `src/components/GutterColumn.astro`:

```astro
---
const tildes = Array.from({ length: 50 }, () => '~');
---

<div
  class="hidden md:flex fixed left-0 top-0 bottom-[32px] flex-col gap-6 pt-16 w-8 text-center select-none z-0"
  style="color: var(--gutter-color); font-family: 'JetBrains Mono', monospace;"
  aria-hidden="true"
>
  {tildes.map((t) => <div>{t}</div>)}
</div>
```

**Step 3: Create DarkModeToggle**

Create `src/components/DarkModeToggle.astro`:

```astro
<button
  id="dark-mode-toggle"
  class="font-mono text-xs text-text-secondary hover:text-accent transition-colors flex items-center gap-1"
  aria-label="Toggle dark mode"
>
  <span id="theme-icon">◐</span>
  <span id="theme-label">theme</span>
</button>

<script is:inline>
  const toggle = document.getElementById('dark-mode-toggle');
  const icon = document.getElementById('theme-icon');

  function updateIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    icon.textContent = isDark ? '◑' : '◐';
  }

  updateIcon();

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcon();
  });
</script>
```

**Step 4: Verify components render**

Update `src/pages/index.astro` temporarily to import and render each component:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import GutterColumn from '../components/GutterColumn.astro';
import SectionHeader from '../components/SectionHeader.astro';
import DarkModeToggle from '../components/DarkModeToggle.astro';
---

<BaseLayout title="utpal.dev">
  <GutterColumn />
  <main class="max-w-3xl mx-auto px-6 md:px-0 md:pl-16 pt-16 md:pt-24 space-y-24">
    <SectionHeader title="test" />
    <DarkModeToggle />
  </main>
</BaseLayout>
```

```bash
npm run dev
```

Expected: Gutter tildes visible on desktop, `// test` section header renders in mono, dark mode toggle switches theme with no flash on reload.

**Step 5: Commit**

```bash
git add src/components/SectionHeader.astro src/components/GutterColumn.astro src/components/DarkModeToggle.astro src/pages/index.astro
git commit -m "feat: add SectionHeader, GutterColumn, DarkModeToggle components"
```

---

## Task 4: HeroSection + AgeCounter React Island

**Files:**
- Create: `src/components/HeroSection.astro`
- Create: `src/components/AgeCounter.tsx`

**Step 1: Create AgeCounter React island**

Create `src/components/AgeCounter.tsx`:

```tsx
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
```

**Step 2: Create HeroSection**

Create `src/components/HeroSection.astro`:

```astro
---
import AgeCounter from './AgeCounter.tsx';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

// Approximate birth timestamp: adjust to actual birthday
// 20.664581288 years before ~2025 = ~mid 2004
const birthTimestamp = new Date('2004-07-15').getTime();
---

<section class="fade-in">
  <div class="grid md:grid-cols-2 gap-12 items-center">
    <div class="space-y-8">
      <div>
        <h1 class="text-4xl md:text-5xl font-semibold tracking-tight leading-tight" style="color: var(--text-primary);">
          hi,<br />
          i'm utpal.
        </h1>
        <p class="mt-4 font-mono text-sm font-medium" style="color: var(--text-secondary);">
          been here for <AgeCounter client:load birthTimestamp={birthTimestamp} /> years.
        </p>
      </div>

      <div class="space-y-4">
        <p class="text-lg leading-relaxed font-normal" style="color: var(--text-primary);">
          <span class="font-mono text-xs font-bold mb-1 block" style="color: var(--accent);">tldr;</span>
          seeking full-stack roles.<br />
          into ai/ml,<br />
          devops,<br />
          scalable and distributed systems.
        </p>
        <p class="text-sm font-medium" style="color: var(--text-secondary);">building full-stack and mobile apps.</p>
      </div>

      <div class="flex gap-8 pt-2 font-mono text-sm">
        <a href="#" class="hover-link">resume →</a>
        <a href="#blogs" class="hover-link">read my blogs →</a>
      </div>

      <div class="flex gap-6 pt-6 font-mono text-xs">
        <a href="#" class="text-text-secondary hover:text-accent transition-colors flex items-center gap-2" aria-label="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          github
        </a>
        <a href="#" class="text-text-secondary hover:text-accent transition-colors flex items-center gap-2" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          linkedin
        </a>
        <a href="#" class="text-text-secondary hover:text-accent transition-colors flex items-center gap-2" aria-label="X / Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          x
        </a>
        <a href="#" class="text-text-secondary hover:text-accent transition-colors flex items-center gap-2" aria-label="Email">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          email
        </a>
      </div>
    </div>

    <div class="hidden md:block">
      <div class="aspect-square border rounded-sm flex items-center justify-center" style="background-color: var(--border); border-color: var(--border);">
        <span class="font-mono text-sm" style="color: var(--text-secondary);">image placeholder</span>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Verify**

Update `src/pages/index.astro` to use HeroSection. Run `npm run dev`. Expected: hero renders with ticking age counter, correct layout, social icons visible.

**Step 4: Commit**

```bash
git add src/components/HeroSection.astro src/components/AgeCounter.tsx src/pages/index.astro
git commit -m "feat: add HeroSection with AgeCounter React island"
```

---

## Task 5: ContributionHeatmap with GitHub API

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/components/ContributionHeatmap.astro`
- Create: `.env.example`

**Step 1: Create GitHub API fetcher**

Create `src/lib/github.ts`:

```typescript
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
```

**Step 2: Create ContributionHeatmap component**

Create `src/components/ContributionHeatmap.astro`:

```astro
---
import SectionHeader from './SectionHeader.astro';
import { fetchGitHubContributions } from '../lib/github';

const data = await fetchGitHubContributions('utpal-dev'); // Replace with actual GitHub username

function getColor(count: number): string {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
  if (count <= 2) return 'bg-gray-300 dark:bg-gray-700';
  if (count <= 5) return 'bg-gray-500 dark:bg-gray-500';
  if (count <= 8) return 'bg-gray-700 dark:bg-gray-400';
  return 'bg-gray-900 dark:bg-gray-200';
}

const months = ['feb', 'may', 'aug', 'nov', 'jan'];
---

<section class="fade-on-scroll">
  <SectionHeader title="contributions" />
  <div class="border p-6 backdrop-blur-sm rounded-sm" style="border-color: var(--border); background-color: var(--surface);">
    <div class="flex justify-between items-end mb-2 font-mono text-xs" style="color: var(--text-secondary);">
      {months.map((m) => <span>{m}</span>)}
    </div>

    <div class="overflow-x-auto pb-2">
      <div class="heatmap-grid w-full min-w-[600px]">
        {data.weeks.flatMap((week) =>
          week.contributionDays.map((day) => (
            <div
              class={`w-[10px] h-[10px] rounded-[1px] ${getColor(day.contributionCount)}`}
              title={day.date ? `${day.date}: ${day.contributionCount} contributions` : undefined}
            />
          ))
        )}
      </div>
    </div>

    <div class="mt-3 flex justify-between items-center font-mono text-xs" style="color: var(--text-secondary);">
      <span>{data.totalContributions} activities in the last year</span>
      <div class="flex items-center gap-1">
        <span>less</span>
        <div class="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-[1px]"></div>
        <div class="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-[1px]"></div>
        <div class="w-2 h-2 bg-gray-500 rounded-[1px]"></div>
        <div class="w-2 h-2 bg-gray-700 dark:bg-gray-400 rounded-[1px]"></div>
        <div class="w-2 h-2 bg-gray-900 dark:bg-gray-200 rounded-[1px]"></div>
        <span>more</span>
      </div>
    </div>
  </div>
</section>
```

**Step 3: Create `.env.example`**

```
GITHUB_TOKEN=ghp_your_token_here
```

**Step 4: Verify**

Add `ContributionHeatmap` to index.astro. Run `npm run dev`. Expected: heatmap renders with mock data (no token), correct grid layout, dark mode shifts colors.

**Step 5: Commit**

```bash
git add src/lib/github.ts src/components/ContributionHeatmap.astro .env.example src/pages/index.astro
git commit -m "feat: add GitHub contributions heatmap with build-time data fetching"
```

---

## Task 6: AboutSection (About + Education)

**Files:**
- Create: `src/components/AboutSection.astro`

**Step 1: Create AboutSection**

Create `src/components/AboutSection.astro`:

```astro
---
import SectionHeader from './SectionHeader.astro';
---

<section class="fade-on-scroll grid md:grid-cols-2 gap-12">
  <div>
    <SectionHeader title="about" />
    <p class="leading-relaxed font-normal text-sm mb-6" style="color: var(--text-secondary);">
      i build systems that scale and interfaces that disappear. obsessed with the intersection of distributed computing and minimal design. currently obsessing over rust and llm inference optimization.
    </p>
    <div class="space-y-2 font-mono text-xs" style="color: var(--text-secondary);">
      <p>ts / go / react / postgres / redis / docker / aws</p>
    </div>
  </div>

  <div>
    <SectionHeader title="education" />
    <div class="space-y-6">
      <div class="group">
        <div class="flex justify-between items-baseline mb-1">
          <h3 class="font-semibold" style="color: var(--text-primary);">B.S. Computer Science</h3>
          <span class="font-mono text-xs" style="color: var(--text-secondary);">2020 — 2024</span>
        </div>
        <div class="flex justify-between items-baseline">
          <p class="text-sm" style="color: var(--text-secondary);">University of Technology</p>
          <span class="font-mono text-xs" style="color: var(--text-secondary);">cgpa — 8.1</span>
        </div>
      </div>

      <ul class="space-y-2 mt-4 text-sm list-none pl-0" style="color: var(--text-secondary);">
        <li class="flex items-center gap-2">
          <span class="w-1 h-1 rounded-full" style="background-color: var(--text-secondary);"></span> full-stack development
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1 h-1 rounded-full" style="background-color: var(--text-secondary);"></span> ai/ml
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1 h-1 rounded-full" style="background-color: var(--text-secondary);"></span> devops
        </li>
      </ul>
    </div>
  </div>
</section>
```

**Step 2: Add to index, verify, commit**

```bash
git add src/components/AboutSection.astro src/pages/index.astro
git commit -m "feat: add AboutSection with education details"
```

---

## Task 7: ProjectCard + ProjectsSection (from content collection)

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/ProjectsSection.astro`

**Step 1: Create ProjectCard**

Create `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  name: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
}
const { name, description, tech, github, demo } = Astro.props;
---

<div class="group cursor-pointer">
  <div class="flex justify-between items-baseline mb-2 border-b pb-2 transition-colors" style="border-color: var(--border);">
    <h3 class="font-bold lowercase" style="color: var(--text-primary);">{name}</h3>
    <div class="flex gap-3">
      <a href={github} class="font-mono text-xs transition-colors" style="color: var(--text-secondary);" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'" aria-label={`${name} on GitHub`}>github →</a>
      {demo && (
        <a href={demo} class="font-mono text-xs transition-colors" style="color: var(--text-secondary);" onmouseover="this.style.color='var(--accent)'" onmouseout="this.style.color='var(--text-secondary)'" aria-label={`${name} live demo`}>live demo →</a>
      )}
    </div>
  </div>
  <p class="text-sm mb-3 leading-relaxed" style="color: var(--text-secondary);">{description}</p>
  <p class="font-mono text-xs" style="color: var(--gutter-color);">{tech.join(' · ')}</p>
</div>
```

**Step 2: Create ProjectsSection**

Create `src/components/ProjectsSection.astro`:

```astro
---
import { getCollection } from 'astro:content';
import SectionHeader from './SectionHeader.astro';
import ProjectCard from './ProjectCard.astro';

const projects = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order);
---

<section class="fade-on-scroll">
  <SectionHeader title="projects" />
  <div class="grid md:grid-cols-2 gap-x-8 gap-y-12">
    {projects.map((project) => (
      <ProjectCard
        name={project.data.name}
        description={project.data.description}
        tech={project.data.tech}
        github={project.data.github}
        demo={project.data.demo}
      />
    ))}
  </div>

  <div class="mt-8 text-center">
    <a href="#" class="inline-flex items-center gap-2 font-mono text-sm transition-colors border-b pb-1 hover-link">
      see more projects →
    </a>
  </div>
</section>
```

**Step 3: Add to index, verify, commit**

```bash
git add src/components/ProjectCard.astro src/components/ProjectsSection.astro src/pages/index.astro
git commit -m "feat: add ProjectCard and ProjectsSection from content collection"
```

---

## Task 8: BlogPostEntry + ThoughtsSection (from content collection)

**Files:**
- Create: `src/components/BlogPostEntry.astro`
- Create: `src/components/ThoughtsSection.astro`

**Step 1: Create BlogPostEntry**

Create `src/components/BlogPostEntry.astro`:

```astro
---
interface Props {
  date: Date;
  title: string;
  description: string;
  slug: string;
}
const { date, title, description, slug } = Astro.props;
const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toLowerCase();
---

<article class="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 group cursor-pointer">
  <span class="font-mono text-xs w-24 shrink-0" style="color: var(--gutter-color);">{formattedDate}</span>
  <a href={`/blog/${slug}`} class="grow no-underline">
    <h3 class="font-semibold transition-colors underline decoration-transparent group-hover:decoration-current underline-offset-4" style="color: var(--text-primary);">{title}</h3>
    <p class="text-sm mt-1" style="color: var(--text-secondary);">{description}</p>
  </a>
</article>
```

**Step 2: Create ThoughtsSection**

Create `src/components/ThoughtsSection.astro`:

```astro
---
import { getCollection } from 'astro:content';
import SectionHeader from './SectionHeader.astro';
import BlogPostEntry from './BlogPostEntry.astro';

const posts = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<section id="blogs" class="fade-on-scroll pb-12">
  <SectionHeader title="thoughts" />
  <div class="space-y-6">
    {posts.map((post) => (
      <BlogPostEntry
        date={post.data.date}
        title={post.data.title}
        description={post.data.description}
        slug={post.slug}
      />
    ))}
  </div>
</section>
```

**Step 3: Add to index, verify, commit**

```bash
git add src/components/BlogPostEntry.astro src/components/ThoughtsSection.astro src/pages/index.astro
git commit -m "feat: add ThoughtsSection with BlogPostEntry from content collection"
```

---

## Task 9: ReadingList Section (from content collection)

**Files:**
- Create: `src/components/ReadingList.astro`

**Step 1: Create ReadingList**

Create `src/components/ReadingList.astro`:

```astro
---
import { getCollection } from 'astro:content';
import SectionHeader from './SectionHeader.astro';

const allReading = await getCollection('reading');
const books = allReading.filter((r) => r.data.type === 'book');
const blogs = allReading.filter((r) => r.data.type === 'blog');
const videos = allReading.filter((r) => r.data.type === 'video');

const typeLabels: Record<string, { cta: string }> = {
  book: { cta: 'link →' },
  blog: { cta: 'read →' },
  video: { cta: 'watch →' },
};
---

<section class="fade-on-scroll">
  <SectionHeader title="reading list" />
  <div class="space-y-8">
    {[
      { label: 'books', items: books },
      { label: 'blogs', items: blogs },
      { label: 'videos', items: videos },
    ].map(({ label, items }) => (
      <div>
        <h3 class="font-mono text-xs mb-4" style="color: var(--text-secondary);">{label}</h3>
        <div class="space-y-4">
          {items.map((item) => (
            <div class="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 group cursor-pointer">
              <div class="grow">
                <h4 class="font-semibold transition-colors" style="color: var(--text-primary);">{item.data.title}</h4>
                <p class="text-sm mt-1" style="color: var(--text-secondary);">
                  {item.data.author}
                  {item.data.status === 'reading' && ' · currently reading'}
                  {item.data.status === 'on-deck' && ' · on deck'}
                  {item.data.duration && ` · ${item.data.duration}`}
                </p>
              </div>
              <a
                href={item.data.url}
                class="font-mono text-xs transition-colors shrink-0"
                style="color: var(--text-secondary);"
              >
                {typeLabels[item.data.type].cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>
```

**Step 2: Add to index, verify, commit**

```bash
git add src/components/ReadingList.astro src/pages/index.astro
git commit -m "feat: add ReadingList section from content collection"
```

---

## Task 10: DowntimeSection — GameModal + SpotifyPlayer

**Files:**
- Create: `src/components/GameModal.tsx`
- Create: `src/lib/spotify.ts`
- Create: `src/pages/api/spotify.ts`
- Create: `src/components/SpotifyPlayer.tsx`
- Create: `src/components/DowntimeSection.astro`

**Step 1: Create GameModal React island**

Create `src/components/GameModal.tsx`:

```tsx
import { useState, useEffect, useCallback } from 'react';

export default function GameModal() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <>
      <div className="flex flex-wrap justify-between gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="border px-4 py-8 w-32 text-center rounded-sm transition-all group hover:bg-black hover:border-black"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="block text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">👾</span>
          <span className="font-mono text-xs transition-colors group-hover:text-white" style={{ color: 'var(--text-secondary)' }}>snake.exe</span>
        </button>
        <button
          onClick={() => setIsOpen(true)}
          className="border px-4 py-8 w-32 text-center rounded-sm transition-all group hover:bg-black hover:border-black"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="block text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">🧱</span>
          <span className="font-mono text-xs transition-colors group-hover:text-white" style={{ color: 'var(--text-secondary)' }}>tetris.exe</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Game loader"
        >
          <div className="bg-[#1a1a1a] p-1 border border-gray-700 shadow-2xl">
            <div className="bg-black p-8 w-[300px] h-[400px] flex flex-col items-center justify-center text-center">
              <h2 className="font-mono text-green-500 text-xl mb-4">GAME_LOADER</h2>
              <div className="w-full bg-gray-900 h-1 mb-4 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '50%' }}></div>
              </div>
              <p className="font-mono text-gray-500 text-xs">Press ESC to exit process</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

**Step 2: Create Spotify API client**

Create `src/lib/spotify.ts`:

```typescript
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

export interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  progressMs: number;
  durationMs: number;
}

async function getAccessToken(): Promise<string> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

  const basic = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
  const accessToken = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  const data = await response.json();

  if (!data.item) return null;

  return {
    isPlaying: data.is_playing,
    title: data.item.name,
    artist: data.item.artists.map((a: { name: string }) => a.name).join(', '),
    albumArt: data.item.album.images[0]?.url ?? '',
    progressMs: data.progress_ms,
    durationMs: data.item.duration_ms,
  };
}
```

**Step 3: Create Spotify API endpoint**

Create `src/pages/api/spotify.ts`:

```typescript
import type { APIRoute } from 'astro';
import { getNowPlaying } from '../../lib/spotify';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const track = await getNowPlaying();
    return new Response(JSON.stringify(track), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch {
    return new Response(JSON.stringify(null), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
```

**Step 4: Create SpotifyPlayer React island**

Create `src/components/SpotifyPlayer.tsx`:

```tsx
import { useState, useEffect } from 'react';

interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumArt: string;
  progressMs: number;
  durationMs: number;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SpotifyPlayer() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch('/api/spotify');
        const data = await res.json();
        setTrack(data);
      } catch {
        setTrack(null);
      }
    }

    fetchTrack();
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  const progress = track ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <div className="border p-6 backdrop-blur-sm rounded-sm" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-sm flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: 'var(--border)' }}>
          {track?.albumArt ? (
            <img src={track.albumArt} alt={`${track.title} album art`} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>album art</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
            {track?.title ?? 'Not Playing'}
          </h4>
          <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
            {track?.artist ?? 'Connect Spotify to see what\'s playing'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
          <span>{track ? formatTime(track.progressMs) : '0:00'}</span>
          <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: 'var(--text-primary)' }}></div>
          </div>
          <span>{track ? formatTime(track.durationMs) : '0:00'}</span>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button className="transition-colors" style={{ color: 'var(--text-secondary)' }} aria-label="Previous track">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
          </button>
          <button className="transition-colors" style={{ color: 'var(--text-primary)' }} aria-label={track?.isPlaying ? 'Pause' : 'Play'}>
            {track?.isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            )}
          </button>
          <button className="transition-colors" style={{ color: 'var(--text-secondary)' }} aria-label="Next track">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
          </button>
        </div>

        {/* Spotify connection */}
        {!track && (
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-mono text-center" style={{ color: 'var(--gutter-color)' }}>connect to spotify →</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 5: Create DowntimeSection**

Create `src/components/DowntimeSection.astro`:

```astro
---
import SectionHeader from './SectionHeader.astro';
import GameModal from './GameModal.tsx';
import SpotifyPlayer from './SpotifyPlayer.tsx';
---

<section class="fade-on-scroll pb-20">
  <SectionHeader title="downtime" />
  <div class="grid md:grid-cols-2 gap-12">
    <div>
      <GameModal client:load />
    </div>
    <div>
      <SpotifyPlayer client:visible />
    </div>
  </div>
</section>
```

**Step 6: Update `.env.example`**

Add to `.env.example`:
```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_spotify_refresh_token
```

**Step 7: Add to index, verify, commit**

```bash
git add src/components/GameModal.tsx src/components/SpotifyPlayer.tsx src/components/DowntimeSection.astro src/lib/spotify.ts src/pages/api/spotify.ts .env.example src/pages/index.astro
git commit -m "feat: add DowntimeSection with GameModal and SpotifyPlayer islands"
```

---

## Task 11: StatusBar Footer

**Files:**
- Create: `src/components/StatusBar.astro`

**Step 1: Create StatusBar**

Create `src/components/StatusBar.astro`:

```astro
---
import DarkModeToggle from './DarkModeToggle.astro';
---

<footer class="fixed bottom-0 left-0 w-full h-8 flex items-center z-50 font-mono text-xs" style="background-color: var(--status-bar-bg); border-top: 1px solid var(--status-bar-border);">
  <div class="flex justify-between w-full px-4" style="color: var(--text-secondary);">
    <div class="flex gap-6">
      <a href="#" class="hover:text-accent transition-colors flex items-center gap-2" aria-label="LeetCode">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        leetcode
      </a>
      <a href="#" class="hover:text-accent transition-colors flex items-center gap-2" aria-label="Codeforces">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
        codeforces
      </a>
      <a href="#" class="hover:text-accent transition-colors flex items-center gap-2" aria-label="GitHub">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        github
      </a>
    </div>

    <span class="hidden md:inline" style="color: var(--text-secondary);">create. explore. expand. conquer.</span>

    <div class="flex gap-6">
      <DarkModeToggle />
      <a href="#" class="hover:text-accent transition-colors flex items-center gap-2" aria-label="Email">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
        email
      </a>
      <a href="#" class="hover:text-accent transition-colors flex items-center gap-2" aria-label="LinkedIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
        linkedin
      </a>
      <a href="#" class="hover:text-accent transition-colors flex items-center gap-2" aria-label="X / Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
        x
      </a>
    </div>
  </div>
</footer>
```

**Step 2: Add to BaseLayout (not index), verify, commit**

Add `<StatusBar />` at the end of BaseLayout's `<body>`, after the `<slot />`.

```bash
git add src/components/StatusBar.astro src/layouts/BaseLayout.astro
git commit -m "feat: add StatusBar footer with dark mode toggle"
```

---

## Task 12: Assemble Complete Index Page

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Wire all sections together**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import GutterColumn from '../components/GutterColumn.astro';
import HeroSection from '../components/HeroSection.astro';
import ContributionHeatmap from '../components/ContributionHeatmap.astro';
import AboutSection from '../components/AboutSection.astro';
import ProjectsSection from '../components/ProjectsSection.astro';
import ThoughtsSection from '../components/ThoughtsSection.astro';
import ReadingList from '../components/ReadingList.astro';
import DowntimeSection from '../components/DowntimeSection.astro';
---

<BaseLayout title="utpal.dev">
  <GutterColumn />
  <main class="max-w-3xl mx-auto px-6 md:px-0 md:pl-16 pt-16 md:pt-24 space-y-24">
    <HeroSection />
    <ContributionHeatmap />
    <AboutSection />
    <ProjectsSection />
    <ThoughtsSection />
    <ReadingList />
    <DowntimeSection />
  </main>
</BaseLayout>
```

**Step 2: Add JSON-LD to homepage**

Add this to BaseLayout.astro inside `<head>`, at the end:

```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Utpal",
  "url": "https://utpal.dev",
  "jobTitle": "Full-Stack Developer",
  "knowsAbout": ["AI/ML", "DevOps", "Distributed Systems", "Full-Stack Development"],
})} />
```

**Step 3: Verify full page**

```bash
npm run dev
```

Expected: All 8 sections render in order, dark mode toggle works, age counter ticks, gutter visible on desktop, status bar fixed at bottom, heatmap renders, responsive layout works.

**Step 4: Commit**

```bash
git add src/pages/index.astro src/layouts/BaseLayout.astro
git commit -m "feat: assemble complete index page with all sections and JSON-LD"
```

---

## Task 13: Blog Post Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`

**Step 1: Create blog listing page**

Create `src/pages/blog/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import GutterColumn from '../../components/GutterColumn.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import BlogPostEntry from '../../components/BlogPostEntry.astro';

const posts = (await getCollection('blog'))
  .filter((post) => !post.data.draft)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---

<BaseLayout title="thoughts — utpal.dev" description="blog posts on systems programming, ai/ml, and software design">
  <GutterColumn />
  <main class="max-w-3xl mx-auto px-6 md:px-0 md:pl-16 pt-16 md:pt-24 space-y-12">
    <SectionHeader title="all thoughts" />
    <div class="space-y-6">
      {posts.map((post) => (
        <BlogPostEntry
          date={post.data.date}
          title={post.data.title}
          description={post.data.description}
          slug={post.slug}
        />
      ))}
    </div>
  </main>
</BaseLayout>
```

**Step 2: Create individual blog post page**

Create `src/pages/blog/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import GutterColumn from '../../components/GutterColumn.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
const formattedDate = post.data.date.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).toLowerCase();
---

<BaseLayout title={`${post.data.title} — utpal.dev`} description={post.data.description}>
  <GutterColumn />
  <main class="max-w-3xl mx-auto px-6 md:px-0 md:pl-16 pt-16 md:pt-24">
    <article>
      <header class="mb-12">
        <span class="font-mono text-xs block mb-2" style="color: var(--text-secondary);">{formattedDate}</span>
        <h1 class="text-3xl md:text-4xl font-semibold tracking-tight" style="color: var(--text-primary);">{post.data.title}</h1>
        <p class="mt-3 text-sm" style="color: var(--text-secondary);">{post.data.description}</p>
      </header>
      <div class="prose prose-sm max-w-none" style="color: var(--text-primary);">
        <Content />
      </div>
      <div class="mt-12 pt-8 border-t" style="border-color: var(--border);">
        <a href="/blog" class="hover-link font-mono text-sm">← back to all thoughts</a>
      </div>
    </article>
  </main>
</BaseLayout>
```

**Step 3: Verify, commit**

```bash
npm run dev
```

Navigate to `/blog` and click a post. Expected: listing page shows all posts, individual post page renders MDX content with correct layout.

```bash
git add src/pages/blog/
git commit -m "feat: add blog listing and individual post pages"
```

---

## Task 14: SEO Finalization — robots.txt, Plausible, Final Meta

**Files:**
- Create: `public/robots.txt`
- Modify: `src/layouts/BaseLayout.astro` (add Plausible script)

**Step 1: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://utpal.dev/sitemap-index.xml
```

**Step 2: Add Plausible Analytics to BaseLayout**

Add before the closing `</head>` in BaseLayout.astro:

```html
<!-- Analytics -->
<script defer data-domain="utpal.dev" src="https://plausible.io/js/script.js"></script>
```

**Step 3: Build and verify**

```bash
npm run build
```

Expected: Build completes. `dist/` contains `sitemap-index.xml`, `robots.txt`, all HTML pages with correct meta tags.

**Step 4: Commit**

```bash
git add public/robots.txt src/layouts/BaseLayout.astro
git commit -m "feat: add robots.txt, Plausible analytics, finalize SEO"
```

---

## Task 15: Final Verification & Cleanup

**Step 1: Run full build**

```bash
npm run build && npm run preview
```

**Step 2: Verification checklist**

- [ ] All 8 sections render on homepage
- [ ] Dark mode toggle works, persists on reload, no flash
- [ ] Age counter ticks in real-time
- [ ] Heatmap renders (mock data without token, real with token)
- [ ] Game modal opens/closes with click and ESC
- [ ] Spotify player shows fallback state (without credentials)
- [ ] Blog listing page works at `/blog`
- [ ] Individual blog posts render at `/blog/[slug]`
- [ ] Responsive: mobile single-column, desktop two-column
- [ ] Gutter hidden on mobile, visible on desktop
- [ ] Status bar visible with working dark mode toggle
- [ ] `robots.txt` accessible
- [ ] Sitemap generated
- [ ] No console errors
- [ ] All links have `aria-label` where icon-only

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```
