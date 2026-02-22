# SVG Scene Carousel Design

## Goal

Replace the `MagnetLines` component in HeroSection with an animated carousel that crossfades between three illustrated scenes: coding, gaming, and reading. All themed to match the project's light/dark color scheme.

## Source Assets

| File | Size | Sections | Original Palette |
|------|------|----------|-----------------|
| coding.svg | 61KB | Character, Chair, Table, 3 Devices, Plants | #92E3A9, #263238, #fff |
| Gaming-bro.svg | 21KB | Character, Chair, Device, Posters | #92E3A9, #263238, #fff |
| reading.svg | 41KB | Character, Books, Lamp, Glasses, Speech Bubble | #407BFF, #de5753, grays |

All are Storyset/Freepik illustrations.

## Architecture

Single `SceneCarousel.tsx` React component containing all 3 SVGs inline.

```
SceneCarousel.tsx
  Container (position: relative, aspect-square)
    CodingScene (position: absolute, opacity + scale animated)
    GamingScene (position: absolute, opacity + scale animated)
    ReadingScene (position: absolute, opacity + scale animated)
```

## Color Remapping

| Original | Replacement | Purpose |
|----------|-------------|---------|
| #92E3A9 (green) | var(--accent) | Accent elements |
| #407BFF (blue) | var(--accent) | Accent elements (reading) |
| #de5753 (red) | var(--accent) | Accent elements (reading) |
| #263238 (dark) | var(--text-primary) | Strokes, outlines |
| #fff, #f5f5f5, #e0e0e0 | var(--bg) | Fills, backgrounds |
| opacity:0.5 whites | var(--surface) | Semi-transparent areas |

## SVG Cleanup

Per file:
- Remove background groups (freepik--background-simple, freepik--background-complete)
- Remove shadow groups
- Remove clip paths referencing removed elements
- Remap all inline style colors to CSS variables
- Keep: Character, furniture, devices, props

## Animation

- **Cycle**: 3 scenes, ~5s each (4s hold + 1s transition)
- **Transition**: Opacity 0 -> 1 over 1s ease-in-out
- **Entrance**: Scale from 0.97 -> 1.0 simultaneous with fade-in
- **Exit**: Scale from 1.0 -> 0.97 simultaneous with fade-out
- **Loop**: Infinite, managed by React useState + useEffect timer

## Integration

In HeroSection.astro, replace:
```astro
<MagnetLines client:visible ... />
```
with:
```astro
<SceneCarousel client:visible />
```

## Dependencies

None. Pure React + CSS transitions.
