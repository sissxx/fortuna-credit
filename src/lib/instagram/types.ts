let idCounter = 0;
export function genId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export const POST_TYPES = [
  "promotional",
  "product-announcement",
  "sale-discount",
  "educational",
  "testimonial",
  "feature-highlight",
  "event-announcement",
  "brand-awareness",
  "custom",
] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_TYPE_LABELS: Record<PostType, string> = {
  promotional: "Promotional ad",
  "product-announcement": "Product announcement",
  "sale-discount": "Sale / discount",
  educational: "Educational post",
  testimonial: "Testimonial",
  "feature-highlight": "Feature highlight",
  "event-announcement": "Event announcement",
  "brand-awareness": "Brand awareness",
  custom: "Custom",
};

export const INSTAGRAM_FORMATS = [
  { id: "square", label: "Square", width: 1080, height: 1080 },
  { id: "portrait", label: "Portrait", width: 1080, height: 1350 },
  { id: "story", label: "Story / Reel", width: 1080, height: 1920 },
] as const;
export type FormatId = (typeof INSTAGRAM_FORMATS)[number]["id"];

export function formatById(id: FormatId) {
  return INSTAGRAM_FORMATS.find((f) => f.id === id) ?? INSTAGRAM_FORMATS[0];
}

export const LAYOUT_PRESET_IDS = [
  "minimal",
  "product-focused",
  "bold-promotional",
  "editorial",
  "image-focused",
] as const;
export type LayoutPresetId = (typeof LAYOUT_PRESET_IDS)[number];

export type ImageFit = "cover" | "contain";
export type ImagePosition = "top" | "center" | "bottom";

export type CampaignInput = {
  /** Selected value-prop focus areas (0 or more) — titles from the Fortuna
   * Credit brand context. Headline/supporting text/CTA are always derived
   * from these + the brand context, never typed freehand. */
  focusAreas: string[];
  additionalInfo: string;
  postType: PostType;
};

export type CampaignCopy = {
  headline: string;
  supportingText: string;
  cta: string;
  caption: string;
  hashtags: string[];
};

export type ImageState = {
  src: string | null; // data URL or /public path
  fit: ImageFit;
  position: ImagePosition;
};

export type PostEdits = {
  headline: string;
  supportingText: string;
  cta: string;
  headlineScale: number; // 0.8–1.3 multiplier
  textAlign: "left" | "center";
  image: ImageState;
  showAccent: boolean;
  showLogo: boolean;
};

export type DesignVariation = {
  id: string;
  layoutPresetId: LayoutPresetId;
  label: string;
  formatId: FormatId;
  edits: PostEdits;
};

export type PostStatus = "draft" | "ready" | "published";

export type GeneratedPost = {
  id: string;
  campaignName: string;
  postType: PostType;
  formatId: FormatId;
  createdAt: string;
  status: PostStatus;
  variation: DesignVariation;
  copy: CampaignCopy;
  thumbnail?: string; // data URL snapshot for the saved-posts list
};

export type Template = {
  id: string;
  name: string;
  layoutPresetId: LayoutPresetId;
  formatId: FormatId;
  edits: PostEdits;
  createdAt: string;
};
