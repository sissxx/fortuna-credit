"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { brandColors, brandFonts, brandLogo, headingFontFor } from "@/lib/brand/tokens";
import { layoutPresetById } from "@/lib/instagram/layoutPresets";
import type { FormatId, PostEdits } from "@/lib/instagram/types";
import { formatById } from "@/lib/instagram/types";
import type { LayoutPresetId } from "@/lib/instagram/types";

export type InstagramCanvasHandle = {
  exportBlob: (type: "image/png" | "image/jpeg") => Promise<Blob | null>;
  getDataUrl: (type?: "image/png" | "image/jpeg") => string | null;
};

type Props = {
  formatId: FormatId;
  layoutPresetId: LayoutPresetId;
  edits: PostEdits;
  eyebrowLabel: string;
  className?: string;
};

let cachedLogo: HTMLImageElement | null = null;
function loadLogo(): Promise<HTMLImageElement> {
  if (cachedLogo) return Promise.resolve(cachedLogo);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      cachedLogo = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = brandLogo.icon;
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function ensureFontsLoaded(headlineFont: string) {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const specs = [`400 88px "${headlineFont}"`, `600 34px "${brandFonts.body}"`, `700 24px "${brandFonts.body}"`];
  await Promise.all(
    specs.map((spec) =>
      document.fonts.load(spec).catch(() => {
        /* fall back silently */
      })
    )
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);

  if (lines.length === maxLines && words.length > lines.join(" ").split(/\s+/).length) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(last + "…").width > maxWidth && last.length > 1) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = last.trimEnd() + "…";
  }

  return lines;
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focusY: number
) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height;

  if (imgRatio > boxRatio) {
    sw = img.height * boxRatio;
    sx = (img.width - sw) * focusY === 0 ? (img.width - sw) / 2 : (img.width - sw) / 2;
  } else {
    sh = img.width / boxRatio;
    sy = Math.max(0, Math.min(img.height - sh, (img.height - sh) * focusY));
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const InstagramCanvas = forwardRef<InstagramCanvasHandle, Props>(function InstagramCanvas(
  { formatId, layoutPresetId, edits, eyebrowLabel, className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    exportBlob: (type) =>
      new Promise((resolve) => {
        canvasRef.current?.toBlob((blob) => resolve(blob), type, 0.95);
      }),
    getDataUrl: (type = "image/png") => canvasRef.current?.toDataURL(type, 0.92) ?? null,
  }));

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const format = formatById(formatId);
      const preset = layoutPresetById(layoutPresetId);
      canvas.width = format.width;
      canvas.height = format.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = format.width;
      const ch = format.height;
      const pad = 72;
      const headlineFont = headingFontFor(edits.headline || "");

      await ensureFontsLoaded(headlineFont);

      const focusY = edits.image.position === "top" ? 0 : edits.image.position === "bottom" ? 1 : 0.5;

      let logo: HTMLImageElement | null = null;
      let photo: HTMLImageElement | null = null;
      try {
        logo = edits.showLogo ? await loadLogo() : null;
      } catch {
        logo = null;
      }
      try {
        photo = edits.image.src ? await loadImage(edits.image.src) : null;
      } catch {
        photo = null;
      }
      if (cancelled) return;

      // --- background ---
      ctx.fillStyle = brandColors.black;
      ctx.fillRect(0, 0, cw, ch);

      const glow = ctx.createRadialGradient(cw * 0.85, ch * 0.05, 0, cw * 0.85, ch * 0.05, cw * 0.7);
      glow.addColorStop(0, "rgba(201,162,39,0.16)");
      glow.addColorStop(1, "rgba(201,162,39,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, cw, ch);

      // --- image zone ---
      let imageRect: { x: number; y: number; w: number; h: number } | null = null;
      if (preset.imageZone === "full-bleed") {
        imageRect = { x: 0, y: 0, w: cw, h: ch };
      } else if (preset.imageZone === "top-half") {
        imageRect = { x: 0, y: 0, w: cw, h: ch * 0.56 };
      } else if (preset.imageZone === "bottom-half") {
        imageRect = { x: 0, y: ch * 0.42, w: cw, h: ch * 0.58 };
      } else if (preset.imageZone === "framed-inset") {
        const iw = cw - pad * 2;
        const ih = ch * 0.38;
        imageRect = { x: pad, y: pad * 1.4, w: iw, h: ih };
      }

      if (imageRect && photo) {
        if (preset.imageZone === "framed-inset") {
          roundRectPath(ctx, imageRect.x, imageRect.y, imageRect.w, imageRect.h, 28);
          ctx.save();
          ctx.clip();
          drawCoverImage(ctx, photo, imageRect.x, imageRect.y, imageRect.w, imageRect.h, focusY);
          ctx.restore();
        } else {
          drawCoverImage(ctx, photo, imageRect.x, imageRect.y, imageRect.w, imageRect.h, focusY);
        }
      } else if (imageRect && !photo) {
        // Empty-image placeholder — brand-dark panel, never a broken box.
        ctx.fillStyle = brandColors.blackDeep;
        if (preset.imageZone === "framed-inset") {
          roundRectPath(ctx, imageRect.x, imageRect.y, imageRect.w, imageRect.h, 28);
          ctx.fill();
        } else {
          ctx.fillRect(imageRect.x, imageRect.y, imageRect.w, imageRect.h);
        }
      }

      // --- overlay ---
      if (imageRect && preset.overlay === "full-scrim") {
        const g = ctx.createLinearGradient(0, imageRect.y, 0, imageRect.y + imageRect.h);
        g.addColorStop(0, "rgba(7,7,7,0.15)");
        g.addColorStop(0.55, "rgba(7,7,7,0.55)");
        g.addColorStop(1, "rgba(7,7,7,0.92)");
        ctx.fillStyle = g;
        ctx.fillRect(imageRect.x, imageRect.y, imageRect.w, imageRect.h);
      } else if (imageRect && preset.overlay === "bottom-gradient") {
        const g = ctx.createLinearGradient(0, ch * 0.55, 0, ch);
        g.addColorStop(0, "rgba(7,7,7,0)");
        g.addColorStop(1, "rgba(7,7,7,0.88)");
        ctx.fillStyle = g;
        ctx.fillRect(0, ch * 0.55, cw, ch * 0.45);
      }

      // --- text zone layout ---
      const textAlign = edits.textAlign;
      ctx.textAlign = textAlign === "center" ? "center" : "left";
      const textX = textAlign === "center" ? cw / 2 : pad;
      const maxTextWidth =
        textAlign === "center" ? cw - pad * 2 : cw - pad * (preset.imageZone === "framed-inset" ? 2 : 2);

      let cursorY: number;
      if (preset.textZone === "top") {
        cursorY = imageRect && preset.imageZone === "top-half" ? imageRect.h + pad * 0.6 : pad * 1.6;
      } else if (preset.textZone === "bottom") {
        cursorY = ch - pad * 1.4;
        // We draw bottom-anchored content upward, so pre-measure by drawing
        // top-down from an estimated start based on content size instead.
        cursorY = (imageRect && preset.imageZone === "bottom-half" ? imageRect.y : ch * 0.58) + pad * 0.2;
        if (preset.imageZone === "full-bleed") cursorY = ch * 0.6;
      } else {
        cursorY = ch * 0.38;
      }

      // Eyebrow badge
      if (preset.showEyebrowBadge && eyebrowLabel) {
        ctx.font = `700 24px "${brandFonts.body}"`;
        const label = eyebrowLabel.toUpperCase();
        const textW = ctx.measureText(label).width;
        const padX = 24;
        const badgeW = textW + padX * 2;
        const badgeH = 52;
        const bx = textAlign === "center" ? textX - badgeW / 2 : textX;
        roundRectPath(ctx, bx, cursorY, badgeW, badgeH, badgeH / 2);
        ctx.fillStyle = brandColors.gold;
        ctx.fill();
        ctx.fillStyle = brandColors.black;
        ctx.textBaseline = "middle";
        ctx.fillText(label, textAlign === "center" ? textX : bx + padX, cursorY + badgeH / 2 + 1);
        ctx.textBaseline = "alphabetic";
        cursorY += badgeH + 32;
      } else if (preset.showAccentHairline) {
        const hairlineW = 56;
        const hx = textAlign === "center" ? textX - hairlineW / 2 : textX;
        ctx.strokeStyle = brandColors.gold;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hx, cursorY + 10);
        ctx.lineTo(hx + hairlineW, cursorY + 10);
        ctx.stroke();
        cursorY += 44;
      }

      // Headline
      const headlineSize = Math.round(84 * edits.headlineScale);
      ctx.font = `400 ${headlineSize}px "${headlineFont}"`;
      ctx.fillStyle = brandColors.white;
      const headlineLines = wrapText(ctx, edits.headline || "", maxTextWidth, 4);
      const lineHeight = headlineSize * 1.12;
      for (const line of headlineLines) {
        cursorY += lineHeight;
        ctx.fillText(line, textX, cursorY);
      }
      cursorY += 16;

      // Supporting text
      if (edits.supportingText) {
        ctx.font = `400 34px "${brandFonts.body}"`;
        ctx.fillStyle = brandColors.muted;
        const bodyLines = wrapText(ctx, edits.supportingText, maxTextWidth, 3);
        for (const line of bodyLines) {
          cursorY += 46;
          ctx.fillText(line, textX, cursorY);
        }
        cursorY += 8;
      }

      // CTA
      if (edits.cta && preset.ctaStyle !== "none") {
        cursorY += 40;
        if (preset.ctaStyle === "pill") {
          ctx.font = `700 32px "${brandFonts.body}"`;
          const ctaW = ctx.measureText(edits.cta).width;
          const padX = 44;
          const badgeW = ctaW + padX * 2;
          const badgeH = 84;
          const bx = textAlign === "center" ? textX - badgeW / 2 : textX;
          roundRectPath(ctx, bx, cursorY, badgeW, badgeH, badgeH / 2);
          ctx.fillStyle = brandColors.gold;
          ctx.fill();
          ctx.fillStyle = brandColors.black;
          ctx.textBaseline = "middle";
          ctx.fillText(edits.cta, textAlign === "center" ? textX : bx + padX, cursorY + badgeH / 2 + 2);
          ctx.textBaseline = "alphabetic";
        } else {
          ctx.font = `700 32px "${brandFonts.body}"`;
          ctx.fillStyle = brandColors.goldBright;
          ctx.fillText(edits.cta, textX, cursorY + 28);
          const w = ctx.measureText(edits.cta).width;
          const lx = textAlign === "center" ? textX - w / 2 : textX;
          ctx.strokeStyle = brandColors.gold;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lx, cursorY + 44);
          ctx.lineTo(lx + w, cursorY + 44);
          ctx.stroke();
        }
      }

      // Logo watermark
      if (logo) {
        const logoH = 64;
        const logoW = (logo.width / logo.height) * logoH;
        ctx.globalAlpha = 0.92;
        ctx.drawImage(logo, pad, pad, logoW, logoH);
        ctx.globalAlpha = 1;
      }
    }

    draw();
    return () => {
      cancelled = true;
    };
  }, [formatId, layoutPresetId, edits, eyebrowLabel]);

  const format = formatById(formatId);

  return (
    <canvas
      ref={canvasRef}
      width={format.width}
      height={format.height}
      className={className}
      style={{ width: "100%", height: "auto", aspectRatio: `${format.width} / ${format.height}` }}
      role="img"
      aria-label={`${eyebrowLabel} Instagram post preview`}
    />
  );
});

export default InstagramCanvas;
