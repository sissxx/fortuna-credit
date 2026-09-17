import type { LayoutPresetId } from "./types";

// Each preset varies COMPOSITION ONLY — image placement, text position,
// hierarchy, cropping, decorative elements, CTA placement. Colors,
// fonts, radius and the accent motif always come from brand tokens
// (src/lib/brand/tokens.ts) and are never overridden here.
export type LayoutPreset = {
  id: LayoutPresetId;
  label: string;
  description: string;
  imageZone: "full-bleed" | "top-half" | "bottom-half" | "framed-inset" | "none";
  textZone: "top" | "center" | "bottom";
  textAlign: "left" | "center";
  overlay: "none" | "bottom-gradient" | "full-scrim";
  showEyebrowBadge: boolean;
  showAccentHairline: boolean;
  ctaStyle: "pill" | "text-underline" | "none";
  headlineScale: number;
};

export const LAYOUT_PRESETS: LayoutPreset[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Generous whitespace, small image accent, quiet confidence.",
    imageZone: "framed-inset",
    textZone: "center",
    textAlign: "center",
    overlay: "none",
    showEyebrowBadge: true,
    showAccentHairline: true,
    ctaStyle: "text-underline",
    headlineScale: 0.95,
  },
  {
    id: "product-focused",
    label: "Product-focused",
    description: "Image leads on top, copy and CTA anchored below.",
    imageZone: "top-half",
    textZone: "bottom",
    textAlign: "left",
    overlay: "none",
    showEyebrowBadge: true,
    showAccentHairline: true,
    ctaStyle: "pill",
    headlineScale: 1,
  },
  {
    id: "bold-promotional",
    label: "Bold promotional",
    description: "Full-bleed image with a scrim, large headline over it.",
    imageZone: "full-bleed",
    textZone: "bottom",
    textAlign: "left",
    overlay: "full-scrim",
    showEyebrowBadge: true,
    showAccentHairline: false,
    ctaStyle: "pill",
    headlineScale: 1.15,
  },
  {
    id: "editorial",
    label: "Editorial",
    description: "Split composition — image on one side, editorial type on the other.",
    imageZone: "bottom-half",
    textZone: "top",
    textAlign: "left",
    overlay: "none",
    showEyebrowBadge: true,
    showAccentHairline: true,
    ctaStyle: "text-underline",
    headlineScale: 1.05,
  },
  {
    id: "image-focused",
    label: "Image-focused",
    description: "Image dominates, a bottom gradient carries a short caption.",
    imageZone: "full-bleed",
    textZone: "bottom",
    textAlign: "center",
    overlay: "bottom-gradient",
    showEyebrowBadge: false,
    showAccentHairline: false,
    ctaStyle: "pill",
    headlineScale: 0.9,
  },
];

export function layoutPresetById(id: LayoutPresetId): LayoutPreset {
  return LAYOUT_PRESETS.find((p) => p.id === id) ?? LAYOUT_PRESETS[0];
}
