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

export declare const VALID_WATERMARK_POSITIONS: WatermarkPosition[];
export declare function calculateWatermarkPlacement(
  params: WatermarkPlacementInput
): WatermarkPlacementResult;
export declare function generateSvgWatermarkOverlay(
  options: SvgWatermarkOverlayOptions
): string;
