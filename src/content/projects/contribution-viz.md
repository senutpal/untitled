---
name: "contribution-viz"
description: "low-level graphics engine built for data visualization. renders complex datasets using canvas and webgl with zero dependencies."
tech: ["ts", "webgl", "canvas"]
github: "#"
featured: true
order: 4
tagline: "a zero-dependency data visualization engine leveraging WebGL and Canvas 2D for rendering complex contribution graphs and heatmaps at 60fps."
stars: 89
forks: 5
previewType: "grid"
metrics:
  - label: "render time"
    value: "<16ms"
    detail: "60fps target"
  - label: "bundle size"
    value: "8.4kb"
    detail: "zero deps, gzipped"
  - label: "data points"
    value: "100k+"
    detail: "supported"
codeSnippet:
  filename: "src/renderer/webgl.ts"
  language: "typescript"
  code: |
    export class WebGLRenderer {
      private gl: WebGL2RenderingContext;
      private program: WebGLProgram;

      render(data: DataPoint[]): void {
        const buffer = this.createBuffer(data);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.drawArrays(this.gl.POINTS, 0, data.length);
      }
    }
features:
  - title: "Rendering Pipeline"
    items:
      - "Adaptive rendering: automatically switches between Canvas 2D and WebGL based on dataset size."
      - "Custom shader programs for efficient point and heatmap rendering."
  - title: "Developer Experience"
    items:
      - "Declarative API with TypeScript-first design and full type inference."
      - "Built-in color scales, axes, and responsive container handling."
---

A lightweight, zero-dependency graphics engine optimized for rendering data visualizations like contribution heatmaps, scatter plots, and time-series charts.
