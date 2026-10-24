/**
 * @uptexx/svg-brand-watermark
 * Deterministic SVG/PNG brand logo watermark placement, responsive bounding-box scaling,
 * and opacity overlay generator for product photography.
 *
 * Built by Uptexx (https://uptexx.com) — Powered by NexoPost (https://nexopost.com)
 */

export type WatermarkPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "center"
  | "bottom-center"
  | "top-center";

export interface WatermarkPlacementInput {
  canvasWidth: number;
  canvasHeight: number;
  logoWidth: number;
  logoHeight: number;
  position?: WatermarkPosition;
  scalePct?: number;
  marginPct?: number;
}

export interface WatermarkPlacementResult {
  x: number;
  y: number;
  width: number;
  height: number;
  marginX: number;
  marginY: number;
  aspectRatio: number;
  position: WatermarkPosition;
}

export interface SvgWatermarkOverlayOptions {
  canvasWidth: number;
  canvasHeight: number;
  logoWidth?: number;
  logoHeight?: number;
  position?: WatermarkPosition;
  scalePct?: number;
  marginPct?: number;
  opacity?: number;
  brandText?: string;
  logoHref?: string;
  badgePill?: boolean;
  dropShadow?: boolean;
  textColor?: string;
  pillColor?: string;
}

export const VALID_WATERMARK_POSITIONS: WatermarkPosition[] = [
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
  "center",
  "bottom-center",
  "top-center",
];

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function calculateWatermarkPlacement(
  params: WatermarkPlacementInput
): WatermarkPlacementResult {
  if (!params || typeof params !== "object") {
    throw new TypeError("calculateWatermarkPlacement requires a parameters object.");
  }

  const canvasWidth = Math.round(Number(params.canvasWidth));
  const canvasHeight = Math.round(Number(params.canvasHeight));
  const logoWidth = Number(params.logoWidth);
  const logoHeight = Number(params.logoHeight);

  if (
    !Number.isFinite(canvasWidth) ||
    canvasWidth <= 0 ||
    !Number.isFinite(canvasHeight) ||
    canvasHeight <= 0
  ) {
    throw new RangeError("canvasWidth and canvasHeight must be positive numbers.");
  }

  if (
    !Number.isFinite(logoWidth) ||
    logoWidth <= 0 ||
    !Number.isFinite(logoHeight) ||
    logoHeight <= 0
  ) {
    throw new RangeError("logoWidth and logoHeight must be positive numbers.");
  }

  const position: WatermarkPosition =
    params.position && VALID_WATERMARK_POSITIONS.includes(params.position)
      ? params.position
      : "bottom-right";

  const scalePct = Math.min(90, Math.max(1, Number(params.scalePct ?? 15)));
  const marginPct = Math.min(40, Math.max(0, Number(params.marginPct ?? 4)));

  const shorterSide = Math.min(canvasWidth, canvasHeight);
  const aspectRatio = logoWidth / logoHeight;

  let width = Math.max(1, Math.round((shorterSide * scalePct) / 100));
  let height = Math.max(1, Math.round(width / aspectRatio));

  const marginX = Math.round((shorterSide * marginPct) / 100);
  const marginY = Math.round((shorterSide * marginPct) / 100);

  const maxAvailWidth = Math.max(1, canvasWidth - marginX * 2);
  const maxAvailHeight = Math.max(1, canvasHeight - marginY * 2);

  if (width > maxAvailWidth) {
    width = maxAvailWidth;
    height = Math.max(1, Math.round(width / aspectRatio));
  }
  if (height > maxAvailHeight) {
    height = maxAvailHeight;
    width = Math.max(1, Math.round(height * aspectRatio));
  }

  let x = 0;
  let y = 0;

  switch (position) {
    case "top-left":
      x = marginX;
      y = marginY;
      break;
    case "top-center":
      x = Math.round((canvasWidth - width) / 2);
      y = marginY;
      break;
    case "top-right":
      x = canvasWidth - width - marginX;
      y = marginY;
      break;
    case "center":
      x = Math.round((canvasWidth - width) / 2);
      y = Math.round((canvasHeight - height) / 2);
      break;
    case "bottom-left":
      x = marginX;
      y = canvasHeight - height - marginY;
      break;
    case "bottom-center":
      x = Math.round((canvasWidth - width) / 2);
      y = canvasHeight - height - marginY;
      break;
    case "bottom-right":
    default:
      x = canvasWidth - width - marginX;
      y = canvasHeight - height - marginY;
      break;
  }

  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width,
    height,
    marginX,
    marginY,
    aspectRatio: Number(aspectRatio.toFixed(4)),
    position,
  };
}

export function generateSvgWatermarkOverlay(options: SvgWatermarkOverlayOptions): string {
  if (!options || typeof options !== "object") {
    throw new TypeError("generateSvgWatermarkOverlay requires an options object.");
  }

  const canvasWidth = Math.round(Number(options.canvasWidth));
  const canvasHeight = Math.round(Number(options.canvasHeight));
  const logoWidth = Number(options.logoWidth ?? 240);
  const logoHeight = Number(options.logoHeight ?? 60);

  const placement = calculateWatermarkPlacement({
    canvasWidth,
    canvasHeight,
    logoWidth,
    logoHeight,
    position: options.position ?? "bottom-right",
    scalePct: options.scalePct ?? 18,
    marginPct: options.marginPct ?? 4,
  });

  const opacity = Math.min(1, Math.max(0, Number(options.opacity ?? 0.88)));
  const brandText = options.brandText ? String(options.brandText).trim() : "";
  const logoHref = options.logoHref ? String(options.logoHref).trim() : "";
  const badgePill = options.badgePill !== false;
  const dropShadow = options.dropShadow !== false;
  const textColor = escapeXml(options.textColor || "#FFFFFF");
  const pillColor = escapeXml(options.pillColor || "#0F172A");

  const defs = dropShadow
    ? `<defs><filter id="uptexx-wm-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.45"/></filter></defs>`
    : "";

  const filterAttr = dropShadow ? ` filter="url(#uptexx-wm-shadow)"` : "";
  const rx = Math.round(placement.height / 2);

  const pillElement = badgePill
    ? `<rect x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" rx="${rx}" ry="${rx}" fill="${pillColor}" fill-opacity="0.78"/>`
    : "";

  const imageElement = logoHref
    ? `<image href="${escapeXml(logoHref)}" x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" preserveAspectRatio="xMidYMid meet"/>`
    : "";

  const fontSize = Math.max(10, Math.round(placement.height * 0.42));
  const textX = Math.round(placement.x + placement.width / 2);
  const textY = Math.round(placement.y + placement.height / 2);
  const textElement = brandText
    ? `<text x="${textX}" y="${textY}" fill="${textColor}" font-family="Inter, system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="600" text-anchor="middle" dominant-baseline="central">${escapeXml(brandText)}</text>`
    : "";

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvasWidth} ${canvasHeight}" width="${canvasWidth}" height="${canvasHeight}">`,
    defs,
    `<g opacity="${opacity}"${filterAttr}>`,
    pillElement,
    imageElement,
    textElement,
    `</g>`,
    `</svg>`,
  ]
    .filter(Boolean)
    .join("");
}
