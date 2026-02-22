# SVG Scene Carousel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the MagnetLines hero component with a crossfading carousel of three themed SVG illustrations (coding, gaming, reading).

**Architecture:** A Node.js build script processes the three Storyset SVGs (strips backgrounds, remaps colors to CSS variables), outputs cleaned SVGs to `src/assets/scenes/`. A single `SceneCarousel.tsx` React component imports them via Vite `?raw`, cycles through them with a timer, and crossfades with a subtle scale entrance animation.

**Tech Stack:** React, CSS transitions, Vite `?raw` imports, Node.js script for SVG processing.

---

### Task 1: Create SVG processing script

**Files:**
- Create: `scripts/process-svgs.js`

**Step 1: Write the processing script**

```js
// scripts/process-svgs.js
const fs = require('fs');
const path = require('path');

const INPUT_FILES = [
  { src: 'coding.svg', out: 'coding.svg' },
  { src: 'Gaming-bro.svg', out: 'gaming.svg' },
  { src: 'reading.svg', out: 'reading.svg' },
];

const OUTDIR = path.join(__dirname, '..', 'src', 'assets', 'scenes');

// Groups to strip entirely (background blobs, shadows)
const STRIP_GROUPS = [
  /freepik--background-simple/,
  /freepik--background-complete/,
  /freepik--Shadow/,
];

// Color remapping table
// Order matters: more specific patterns first
const COLOR_MAP = [
  // Accent colors → var(--accent)
  [/#92E3A9/gi, 'var(--accent)'],
  [/#407BFF/gi, 'var(--accent)'],
  [/#de5753/gi, 'var(--accent)'],
  [/#e4897b/gi, 'var(--accent)'],  // skin-accent in reading.svg

  // Dark strokes → var(--text-primary)
  [/#263238/gi, 'var(--text-primary)'],

  // Whites/light fills → var(--bg)
  // Match inside style attributes: fill:#fff  or  fill:#f5f5f5  etc.
  [/#f5f5f5/gi, 'var(--bg)'],
  [/#f0f0f0/gi, 'var(--bg)'],
  [/#ebebeb/gi, 'var(--bg)'],
  [/#e6e6e6/gi, 'var(--bg)'],
  [/#e0e0e0/gi, 'var(--bg)'],
  [/#e5e5e5/gi, 'var(--bg)'],

  // Pure white — be careful, only replace inside fill/stroke style props
  [/#fff(?=[";,\s)])/gi, 'var(--bg)'],
];

function stripGroups(svg) {
  // Remove entire <g id="freepik--background-...">...</g> groups
  // These are non-nested so a greedy match within <g ...>...</g> works
  for (const pattern of STRIP_GROUPS) {
    // Match <g id="freepik--background-simple--inject-3">...</g>
    const re = new RegExp(
      `<g\\s+id="[^"]*${pattern.source}[^"]*"[^>]*>.*?</g>`,
      'gs'
    );
    svg = svg.replace(re, '');
  }
  return svg;
}

function remapColors(svg) {
  for (const [pattern, replacement] of COLOR_MAP) {
    svg = svg.replace(pattern, replacement);
  }
  return svg;
}

// Ensure output directory exists
fs.mkdirSync(OUTDIR, { recursive: true });

for (const { src, out } of INPUT_FILES) {
  const inPath = path.join(__dirname, '..', src);
  let svg = fs.readFileSync(inPath, 'utf-8');

  svg = stripGroups(svg);
  svg = remapColors(svg);

  const outPath = path.join(OUTDIR, out);
  fs.writeFileSync(outPath, svg, 'utf-8');
  console.log(`✓ ${src} → src/assets/scenes/${out}`);
}

console.log('Done.');
```

**Step 2: Run the script**

Run: `node scripts/process-svgs.js`
Expected: Three lines of output confirming each file was processed, plus "Done."

**Step 3: Verify output**

- Check that `src/assets/scenes/coding.svg`, `src/assets/scenes/gaming.svg`, `src/assets/scenes/reading.svg` exist
- Open each in a text editor and confirm:
  - No `freepik--background-simple` or `freepik--background-complete` groups remain
  - No `#92E3A9`, `#407BFF`, `#de5753` hex colors remain
  - `var(--accent)`, `var(--text-primary)`, `var(--bg)` appear throughout
- Open each in a browser to visually confirm the illustration shapes are intact (backgrounds will be transparent)

**Step 4: Commit**

```bash
git add scripts/process-svgs.js src/assets/scenes/
git commit -m "add SVG processing script and cleaned scene assets"
```

---

### Task 2: Create SceneCarousel component

**Files:**
- Create: `src/components/SceneCarousel.tsx`

**Step 1: Write the component**

```tsx
import { useState, useEffect } from 'react';

// Vite ?raw imports give us the SVG markup as a string
import codingSvg from '../assets/scenes/coding.svg?raw';
import gamingSvg from '../assets/scenes/gaming.svg?raw';
import readingSvg from '../assets/scenes/reading.svg?raw';

const scenes = [codingSvg, gamingSvg, readingSvg];

const HOLD_MS = 4000;   // time each scene is fully visible
const FADE_MS = 1000;   // CSS transition duration (keep in sync with CSS below)
const CYCLE_MS = HOLD_MS + FADE_MS;

export default function SceneCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % scenes.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1' }}>
      {scenes.map((svg, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === active ? 1 : 0,
            transform: i === active ? 'scale(1)' : 'scale(0.97)',
            transition: `opacity ${FADE_MS}ms ease-in-out, transform ${FADE_MS}ms ease-in-out`,
            pointerEvents: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ))}
    </div>
  );
}
```

**Step 2: Verify the component renders**

Run: `npm run dev`
- Temporarily import `SceneCarousel` in any page to confirm it renders without errors
- Confirm the SVGs display and crossfade every 5s
- Confirm the subtle scale animation is visible during transitions
- Confirm colors match the theme (accent indigo, dark strokes, light fills)
- Toggle dark mode and verify colors update

**Step 3: Commit**

```bash
git add src/components/SceneCarousel.tsx
git commit -m "add SceneCarousel component with crossfade animation"
```

---

### Task 3: Integrate into HeroSection

**Files:**
- Modify: `src/components/HeroSection.astro:2,59-69`

**Step 1: Update the import**

In `src/components/HeroSection.astro`, change:
```astro
import MagnetLines from './MagnetLines.tsx';
```
to:
```astro
import SceneCarousel from './SceneCarousel.tsx';
```

**Step 2: Replace the component usage**

Replace lines 58-71:
```astro
    <div class="hidden md:block">
      <div class="aspect-square rounded-sm overflow-hidden flex items-center justify-center">
        <MagnetLines
          client:visible
          rows={12}
          columns={12}
          containerSize="100%"
          lineColor="var(--text-muted)"
          lineWidth="1.5px"
          lineHeight="24px"
          baseAngle={-10}
          style={{ height: '100%' }}
        />
      </div>
    </div>
```
with:
```astro
    <div class="hidden md:block">
      <div class="aspect-square rounded-sm overflow-hidden flex items-center justify-center">
        <SceneCarousel client:visible />
      </div>
    </div>
```

**Step 3: Verify integration**

Run: `npm run dev`
- Navigate to homepage
- Confirm the right column shows the first scene (coding)
- Wait 5s and confirm it crossfades to gaming
- Wait 5s more and confirm it crossfades to reading
- Confirm it loops back to coding
- Toggle dark mode: colors should update live
- Resize to mobile: the carousel should be hidden (existing `hidden md:block`)

**Step 4: Commit**

```bash
git add src/components/HeroSection.astro
git commit -m "replace MagnetLines with SceneCarousel in hero"
```

---

### Task 4: Polish and verify

**Step 1: Check SVG sizing**

If the SVGs don't fill the container properly (they have `viewBox="0 0 500 500"`), add this to the `dangerouslySetInnerHTML` wrapper div in `SceneCarousel.tsx`:

```tsx
// Inside the div with dangerouslySetInnerHTML, add a CSS rule
// to make child SVGs fill the container:
```

Add a `<style>` or inline style that targets the SVG within:
```css
.scene-carousel svg {
  width: 100%;
  height: 100%;
}
```

Or apply it inline in the component wrapper:
```tsx
<div style={{ position: 'relative', width: '100%', aspectRatio: '1' }} className="scene-carousel">
```

And add to `global.css`:
```css
.scene-carousel svg {
  width: 100%;
  height: 100%;
}
```

**Step 2: Verify color edge cases**

Check that:
- Semi-transparent fills (`opacity:0.5` + white) show correctly
- Clip paths still work (they reference elements within the same SVG, not the removed backgrounds)
- No stray hardcoded colors remain — search processed SVGs for any remaining hex codes

Run: `node -e "const fs=require('fs'); ['coding','gaming','reading'].forEach(n => { const s=fs.readFileSync('src/assets/scenes/'+n+'.svg','utf-8'); const m=s.match(/#[0-9a-f]{3,6}/gi); if(m) console.log(n+':', [...new Set(m)]); else console.log(n+': clean'); })"`

If any hex colors remain that should be remapped, update the `COLOR_MAP` in `scripts/process-svgs.js` and re-run.

**Step 3: Final commit**

```bash
git add -A
git commit -m "polish scene carousel sizing and colors"
```

---

## Notes

- The `MagnetLines.tsx` file is NOT deleted — it may be used elsewhere or the user may want to keep it as a fallback.
- The three source SVGs in the project root (`coding.svg`, `Gaming-bro.svg`, `reading.svg`) are kept as source assets. Only the processed copies in `src/assets/scenes/` are used at runtime.
- If a processed SVG has broken clip paths (because a referenced `<clipPath>` was inside a removed background group), the fix is to move that `<clipPath>` from the `<g>` group into the top-level `<defs>` before stripping groups. Update the processing script accordingly.
- Vite's `?raw` import includes the full SVG string in the JS bundle. Total added bundle size: ~123KB uncompressed, ~15-20KB gzipped. This only loads on the homepage via `client:visible`.
