// Single source of truth for the Instagram generator's visual language.
// These values mirror src/app/globals.css exactly — do not fork them.
// If the brand palette/fonts change, update both places together.

export const brandColors = {
  black: "#070707",
  blackDeep: "#0D0D0D",
  gray: "#171717",
  gold: "#C9A227",
  goldBright: "#E5C45A",
  white: "#FFFFFF",
  muted: "#B8B8B8",
} as const;

export const brandFonts = {
  // Matches src/app/[locale]/layout.tsx's per-locale heading font rule.
  headingLatin: "Vidaloka",
  headingCyrillic: "Playfair Display",
  body: "Inter",
} as const;

export function headingFontFor(text: string): string {
  return /[Ѐ-ӿ]/.test(text) ? brandFonts.headingCyrillic : brandFonts.headingLatin;
}

export const brandRadius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const brandLogo = {
  icon: "/logo/icon.png",
  horizontalDark: "/logo/lockup-horizontal-dark.png",
} as const;

// The site's signature accent — a short gold hairline before an uppercase
// eyebrow label. Reused as a decorative element in every post variation.
export const brandAccent = {
  hairlineColor: brandColors.gold,
  hairlineLength: 40,
};
