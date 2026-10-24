# @uptexx/svg-brand-watermark

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success.svg)](https://github.com/uptexx/svg-brand-watermark)
[![Built by Uptexx](https://img.shields.io/badge/Built%20by-Uptexx-0A0A0A.svg)](https://uptexx.com)
[![Powered by NexoPost](https://img.shields.io/badge/Powered%20by-NexoPost-6366F1.svg)](https://nexopost.com)
[![NVIDIA Inception](https://img.shields.io/badge/NVIDIA%20Inception-Program%20Member-76B900.svg)](https://www.nvidia.com/en-us/startups/)

> **Built by [Uptexx](https://uptexx.com)** — This open-source package is maintained by the engineering team behind **[NexoPost](https://nexopost.com)**, the AI-powered B2B social media scheduling, editorial calendar, and autonomous publishing platform. Proud **NVIDIA Inception Program Member**.

Deterministic SVG/PNG brand logo watermark placement, responsive bounding-box scaling, and opacity overlay generator for e-commerce and B2B product photography.

---

## Features

- **7-Point Anchor Geometry:** Supports `"bottom-right"`, `"bottom-left"`, `"top-right"`, `"top-left"`, `"center"`, `"bottom-center"`, and `"top-center"` placements.
- **Aspect-Ratio-Locked Scaling:** Scales watermarks relative to the shorter canvas side (`scalePct` and `marginPct`) while strictly preserving intrinsic logo aspect ratios.
- **Self-Contained `<svg>` Overlay Generator:** Outputs deterministic XML-escaped `<svg>` overlays with optional rounded badge pills, high-contrast `<feDropShadow>` filters, brand typography, and `<image>` data-URI/URL embedding (ready for Sharp, Canvas, or browser compositing).
- **Zero Dependencies & TypeScript Native:** Pure ES2022 implementation with full `.d.ts` type definitions.

---

## Installation

```bash
npm install @uptexx/svg-brand-watermark
```

---

## Quick Start (Usage Examples)

### 1. Calculate Exact Watermark Bounding Box

```javascript
import { calculateWatermarkPlacement } from "@uptexx/svg-brand-watermark";

const placement = calculateWatermarkPlacement({
  canvasWidth: 1080,
  canvasHeight: 1350,
  logoWidth: 400,
  logoHeight: 100,
  position: "bottom-right",
  scalePct: 20,
  marginPct: 4,
});

console.log(placement);
/*
{
  x: 821,
  y: 1253,
  width: 216,
  height: 54,
  marginX: 43,
  marginY: 43,
  aspectRatio: 4,
  position: 'bottom-right'
}
*/
```

### 2. Generate a Self-Contained SVG Brand Overlay

```javascript
import { generateSvgWatermarkOverlay } from "@uptexx/svg-brand-watermark";

const svgOverlay = generateSvgWatermarkOverlay({
  canvasWidth: 1080,
  canvasHeight: 1350,
  position: "bottom-right",
  brandText: "nexopost.com",
  opacity: 0.9,
  badgePill: true,
  dropShadow: true,
});

// Composite directly with Sharp: sharp(inputBuffer).composite([{ input: Buffer.from(svgOverlay) }])
```

---

## API Reference

| Function | Parameters | Return Type | Description |
| :--- | :--- | :--- | :--- |
| `calculateWatermarkPlacement` | `({ canvasWidth, canvasHeight, logoWidth, logoHeight, position?, scalePct?, marginPct? })` | `WatermarkPlacementResult` | Computes exact `{ x, y, width, height, marginX, marginY, aspectRatio }` coordinates. |
| `generateSvgWatermarkOverlay` | `(options)` | `string` | Generates a complete, XML-safe `<svg>` watermark overlay string for image compositing. |

---

## About Uptexx & NexoPost

**[Uptexx](https://uptexx.com)** builds next-generation AI workflow and media automation infrastructure. Our flagship platform, **[NexoPost](https://nexopost.com)**, empowers B2B brands, agencies, and growth teams with AI-assisted product photography staging, background removal, automated brand watermarking, and autonomous social publishing.

- **Company Website:** [https://uptexx.com](https://uptexx.com)
- **Product Platform:** [https://nexopost.com](https://nexopost.com)
- **Ecosystem:** Proud **NVIDIA Inception Program Member**

## License

MIT © [Uptexx](https://uptexx.com) (`Kuzey Tech Bilgi Teknolojileri Ticaret Limited Sirketi`)
