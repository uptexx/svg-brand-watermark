import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateWatermarkPlacement,
  generateSvgWatermarkOverlay,
} from "../src/index.mjs";

test("calculateWatermarkPlacement computes bottom-right coordinates preserving aspect ratio", () => {
  const res = calculateWatermarkPlacement({
    canvasWidth: 1000,
    canvasHeight: 1000,
    logoWidth: 400,
    logoHeight: 100,
    position: "bottom-right",
    scalePct: 20,
    marginPct: 5,
  });

  assert.equal(res.width, 200);
  assert.equal(res.height, 50);
  assert.equal(res.marginX, 50);
  assert.equal(res.marginY, 50);
  assert.equal(res.x, 750);
  assert.equal(res.y, 900);
  assert.equal(res.aspectRatio, 4);
});

test("calculateWatermarkPlacement supports all 7 anchor positions accurately", () => {
  const base = {
    canvasWidth: 1080,
    canvasHeight: 1350,
    logoWidth: 200,
    logoHeight: 100,
    scalePct: 10,
    marginPct: 5,
  };

  const topLeft = calculateWatermarkPlacement({ ...base, position: "top-left" });
  assert.equal(topLeft.x, 54);
  assert.equal(topLeft.y, 54);

  const center = calculateWatermarkPlacement({ ...base, position: "center" });
  assert.equal(center.x, Math.round((1080 - center.width) / 2));
  assert.equal(center.y, Math.round((1350 - center.height) / 2));

  const bottomCenter = calculateWatermarkPlacement({ ...base, position: "bottom-center" });
  assert.equal(bottomCenter.x, Math.round((1080 - bottomCenter.width) / 2));
  assert.equal(bottomCenter.y, 1350 - bottomCenter.height - 54);

  const topCenter = calculateWatermarkPlacement({ ...base, position: "top-center" });
  assert.equal(topCenter.y, 54);
});

test("generateSvgWatermarkOverlay generates valid self-contained SVG with drop-shadow and pill", () => {
  const svg = generateSvgWatermarkOverlay({
    canvasWidth: 1200,
    canvasHeight: 1200,
    position: "bottom-right",
    brandText: "NexoPost & Co <AI>",
    opacity: 0.9,
  });

  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200"'));
  assert.ok(svg.includes('id="uptexx-wm-shadow"'));
  assert.ok(svg.includes('opacity="0.9"'));
  assert.ok(svg.includes("NexoPost &amp; Co &lt;AI&gt;"));
  assert.ok(svg.endsWith("</svg>"));
});

test("generateSvgWatermarkOverlay embeds logoHref and allows disabling pill/shadow", () => {
  const svg = generateSvgWatermarkOverlay({
    canvasWidth: 1080,
    canvasHeight: 1920,
    position: "top-right",
    logoHref: "https://nexopost.com/logo.svg",
    badgePill: false,
    dropShadow: false,
  });

  assert.ok(svg.includes('<image href="https://nexopost.com/logo.svg"'));
  assert.ok(!svg.includes("<rect"));
  assert.ok(!svg.includes("<filter"));
});

test("calculateWatermarkPlacement throws on non-positive canvas or logo dimensions", () => {
  assert.throws(
    () =>
      calculateWatermarkPlacement({
        canvasWidth: 0,
        canvasHeight: 1000,
        logoWidth: 100,
        logoHeight: 50,
      }),
    /positive numbers/
  );
  assert.throws(
    () =>
      calculateWatermarkPlacement({
        canvasWidth: 1000,
        canvasHeight: 1000,
        logoWidth: -10,
        logoHeight: 50,
      }),
    /positive numbers/
  );
});

test("calculateWatermarkPlacement clamps oversized scalePct within safe margins", () => {
  const res = calculateWatermarkPlacement({
    canvasWidth: 800,
    canvasHeight: 600,
    logoWidth: 300,
    logoHeight: 300,
    scalePct: 95,
    marginPct: 10,
  });

  // Shorter side is 600, margin is 60px on each side -> maxAvailHeight = 480
  assert.ok(res.height <= 480);
  assert.ok(res.width <= 680);
});

test("calculateWatermarkPlacement handles bottom-left and top-right positions", () => {
  const bl = calculateWatermarkPlacement({
    canvasWidth: 1000,
    canvasHeight: 1000,
    logoWidth: 200,
    logoHeight: 100,
    position: "bottom-left",
    scalePct: 20,
    marginPct: 5,
  });
  assert.equal(bl.x, 50);
  assert.equal(bl.y, 850);

  const tr = calculateWatermarkPlacement({
    canvasWidth: 1000,
    canvasHeight: 1000,
    logoWidth: 200,
    logoHeight: 100,
    position: "top-right",
    scalePct: 20,
    marginPct: 5,
  });
  assert.equal(tr.x, 750);
  assert.equal(tr.y, 50);
});

test("generateSvgWatermarkOverlay clamps opacity between 0 and 1", () => {
  const svgHigh = generateSvgWatermarkOverlay({
    canvasWidth: 500,
    canvasHeight: 500,
    brandText: "Uptexx",
    opacity: 5,
  });
  assert.ok(svgHigh.includes('opacity="1"'));

  const svgLow = generateSvgWatermarkOverlay({
    canvasWidth: 500,
    canvasHeight: 500,
    brandText: "Uptexx",
    opacity: -2,
  });
  assert.ok(svgLow.includes('opacity="0"'));
});

