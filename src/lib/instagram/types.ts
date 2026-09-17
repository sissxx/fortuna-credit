let idCounter = 0;
export function genId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

// Every post this studio generates promotes Fortuna Credit — there is no
// "what kind of post" classification to infer or choose; it's always an ad.
export const POST_TYPES = ["ad"] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_TYPE_LABELS: Record<PostType, string> = {
  ad: "Ad",
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

export const LANGUAGE_MODES = ["bg", "en", "both"] as const;
export type LanguageMode = (typeof LANGUAGE_MODES)[number];

/** One selection per marketing-message menu (§30–35). Each value is either
 * "ai" (the AI_CHOOSE sentinel from copyLibrary.ts) or an exact phrase the
 * admin picked — which must be used verbatim, never rewritten (§38). */
export type MessageSelections = {
  hook: string;
  trust: string;
  lifestyle: string;
  cta: string;
  shortHeadline: string;
};

export type CampaignInput = {
  languageMode: LanguageMode;
  /** A specific office id, or "all" for no office-specific contact info. */
  officeId: string;
  selections: MessageSelections;
  /** Bumped by "Generate New Variation" to reroll AI-chosen picks/layout
   * while keeping explicit selections and factual data unchanged (§41). */
  nonce: number;
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

/** Verified office contact info attached to a post — never free text. */
export type OfficeSnapshot = {
  id: string;
  name: string;
  city: string;
  phone: string;
  isNew: boolean;
};

export type PostEdits = {
  headline: string;
  supportingText: string;
  cta: string;
  /** English counterpart shown alongside the primary copy when the
   * campaign's language mode is "both". */
  secondary: { headline: string; supportingText: string; cta: string } | null;
  headlineScale: number; // 0.8–1.3 multiplier
  textAlign: "left" | "center";
  image: ImageState;
  showAccent: boolean;
  showLogo: boolean;
  office: OfficeSnapshot | null;
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
