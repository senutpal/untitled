# utpal.dev Portfolio Site -- Design Document

**Date:** 2026-02-18
**Status:** Approved

## Overview

Personal portfolio site for utpal.dev with a code-editor aesthetic (vim-style gutter, status bar, monospace headers). Built with Astro + React islands + TailwindCSS + TypeScript. Content managed via Astro content collections (MDX/MD).

## Architecture: Astro Islands

95% of the site is static Astro components shipping zero JS. Four React islands handle interactivity:

| Island | Hydration | Purpose |
|--------|-----------|---------|
| `AgeCounter.tsx` | `client:load` | Ticks age every 100ms |
| `SpotifyPlayer.tsx` | `client:visible` | Polls `/api/spotify` every 30s for now-playing |
| `GameModal.tsx` | `client:load` | Opens/closes game launcher modal |
| Dark mode toggle | Inline `<script>` | Toggles `dark` class, persists to localStorage |

## Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro          # HTML shell, fonts, dark mode script, SEO head
├── components/
│   ├── GutterColumn.astro        # Vim-style tilde gutter (static, decorative)
│   ├── StatusBar.astro           # Fixed bottom bar with links
│   ├── HeroSection.astro         # Name, bio, social links, image
│   ├── AgeCounter.tsx            # React island - live ticking age
│   ├── ContributionHeatmap.astro # GitHub heatmap (build-time data)
│   ├── AboutSection.astro        # About + education
│   ├── ProjectCard.astro         # Reusable project card
│   ├── ProjectsSection.astro     # Projects grid
│   ├── BlogPostEntry.astro       # Reusable blog entry row
│   ├── ThoughtsSection.astro     # Blog listing
│   ├── ReadingList.astro         # Books/blogs/videos
│   ├── DowntimeSection.astro     # Games + music player container
│   ├── SpotifyPlayer.tsx         # React island - now playing
│   ├── GameModal.tsx             # React island - game launcher
│   ├── DarkModeToggle.astro      # Toggle (inline script, no React)
│   └── SectionHeader.astro       # Reusable "// section-name"
├── content/
│   ├── config.ts                 # Collection schemas
│   ├── blog/                     # MDX blog posts
│   ├── projects/                 # MD project entries
│   └── reading/                  # MD reading list entries
├── pages/
│   ├── index.astro               # Home (all sections)
│   ├── blog/
│   │   ├── index.astro           # Blog listing
│   │   └── [...slug].astro       # Individual posts
│   └── api/
│       └── spotify.ts            # Server endpoint for Spotify API
├── styles/
│   └── global.css                # Tailwind directives, CSS vars, animations
└── lib/
    ├── github.ts                 # GitHub GraphQL API fetcher
    └── spotify.ts                # Spotify API client
```

## Dependencies

- `astro`, `@astrojs/react`, `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/mdx`
- `react`, `react-dom`, `@types/react`, `@types/react-dom`
- `tailwindcss`
- `lucide-react`

## Theme System

### Colors

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#f2f4f7` | `#0f1117` |
| `--text-primary` | `#111827` | `#e5e7eb` |
| `--text-secondary` | `#6b7280` | `#9ca3af` |
| `--accent` | `#4f46e5` | `#818cf8` |
| `--surface` | `#ffffff80` | `#1f293780` |
| `--border` | `#e5e7eb` | `#374151` |
| `--status-bar-bg` | `#e5e7eb` | `#1f2937` |

### Dark Mode

- Tailwind `darkMode: 'class'`
- Inline `<script>` in `<head>` reads `localStorage.theme` or `prefers-color-scheme` before first paint (no flash)
- Toggle in status bar or hero area

### Typography

- **Inter** (body): weights 300, 400, 500, 600
- **JetBrains Mono** (code/mono): weights 400, 500
- Google Fonts with `font-display: swap`

## Responsive Design

| Breakpoint | Layout |
|------------|--------|
| < 768px | Single column, gutter hidden, hero image hidden, status bar simplified |
| >= 768px | Two-column grids, gutter visible, full status bar with tagline |

## Data Flow

### Build Time
- **GitHub heatmap:** GraphQL API (`contributionsCollection`) fetched in `github.ts`, rendered as static CSS grid in `ContributionHeatmap.astro`
- **Blog posts:** `content/blog/*.mdx` via Astro content collections
- **Projects:** `content/projects/*.md` via content collections
- **Reading list:** `content/reading/*.md` via content collections

### Runtime
- **Spotify:** `SpotifyPlayer.tsx` polls `/api/spotify.ts` (serverless function) every 30s. Server handles OAuth token refresh, returns current track data.
- **Age counter:** Local `setInterval` in React, no API calls
- **Game modal:** Local React state only

## Content Collection Schemas

```typescript
// blog
{
  title: string
  description: string
  date: Date
  tags: string[]
  draft: boolean
}

// projects
{
  name: string
  description: string
  tech: string[]
  github: string
  demo?: string
  featured: boolean
  order: number
}

// reading
{
  title: string
  author: string
  type: 'book' | 'blog' | 'video'
  status: 'reading' | 'on-deck' | 'completed'
  url: string
  duration?: string  // for videos
}
```

## SEO

- `<title>` and `<meta name="description">` on all pages
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter cards: `twitter:card`, `twitter:title`, `twitter:description`
- JSON-LD: `Person` on homepage, `BlogPosting` on blog posts
- `@astrojs/sitemap` for `sitemap.xml`
- `robots.txt` in `public/`
- Canonical URLs on all pages

## Accessibility

- Semantic HTML: `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`
- `aria-hidden="true"` on decorative gutter
- `aria-label` on icon-only links
- Focus-visible outlines on interactive elements
- Color contrast >= 4.5:1 in both themes
- ESC closes modal, logical tab order

## Animations

- CSS `@keyframes fadeIn` with staggered delays
- `IntersectionObserver` in inline `<script>` triggers fade-in on scroll
- Hover transitions via Tailwind utilities (no Framer Motion)

## Deployment

- Astro `output: 'hybrid'` (static pages + serverless API route for Spotify)
- Target: Vercel / Netlify / Cloudflare Pages
- `/api/spotify` runs as serverless function

## Analytics

- Plausible Analytics: lightweight `<script>` in BaseLayout
- No cookie banner needed (privacy-respecting)

## Sections (matching original design)

1. **Hero** -- name, bio, age counter, social links, image placeholder
2. **Contributions** -- GitHub heatmap (real data)
3. **About + Education** -- two-column grid
4. **Projects** -- two-column card grid from content collection
5. **Thoughts** -- blog post listing from content collection
6. **Reading List** -- books, blogs, videos subsections from content collection
7. **Downtime** -- game buttons (placeholder) + Spotify player (real)
8. **Status Bar Footer** -- fixed bottom bar with links and tagline
