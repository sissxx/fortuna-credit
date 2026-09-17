"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import InstagramCanvas, { type InstagramCanvasHandle } from "@/components/admin/InstagramCanvas";
import { LAYOUT_PRESETS, layoutPresetById } from "@/lib/instagram/layoutPresets";
import { getContentGenerator } from "@/lib/instagram/contentGenerator";
import { savePost, saveTemplate, listPosts, listTemplates } from "@/lib/instagram/storage";
import { getFortunaContext, type ContextLocale } from "@/lib/fortuna/businessContext";
import { AI_CHOOSE, libraryPhrases, type CopyCategory } from "@/lib/fortuna/copyLibrary";
import FortunaContextPanel from "@/components/admin/FortunaContextPanel";
import {
  INSTAGRAM_FORMATS,
  LANGUAGE_MODES,
  POST_TYPE_LABELS,
  genId,
  type CampaignInput,
  type CampaignCopy,
  type DesignVariation,
  type FormatId,
  type GeneratedPost,
  type ImageFit,
  type ImagePosition,
  type LanguageMode,
  type LayoutPresetId,
  type MessageSelections,
  type OfficeSnapshot,
  type PostEdits,
} from "@/lib/instagram/types";

const FORTUNA_NAME = "Fortuna Credit";

// Every post is an ad for Fortuna Credit — there's no post-type to infer,
// just the locale-appropriate word for the eyebrow badge shown on the ad.
const AD_LABEL: Record<ContextLocale, string> = { bg: "Реклама", en: "Ad" };

const LANGUAGE_LABELS: Record<LanguageMode, string> = { bg: "Bulgarian", en: "English", both: "Both" };

const MESSAGE_MENUS: { key: keyof MessageSelections; category: CopyCategory; label: string }[] = [
  { key: "hook", category: "hooks", label: "Attention / Hook" },
  { key: "trust", category: "trust", label: "Trust / Human Approach" },
  { key: "lifestyle", category: "lifestyle", label: "Lifestyle / Opportunity" },
  { key: "cta", category: "cta", label: "Call to Action" },
  { key: "shortHeadline", category: "shortHeadline", label: "Short Headline (visual text)" },
];

const emptySelections: MessageSelections = {
  hook: AI_CHOOSE,
  trust: AI_CHOOSE,
  lifestyle: AI_CHOOSE,
  cta: AI_CHOOSE,
  shortHeadline: AI_CHOOSE,
};

type EditableCopy = { headline: string; supportingText: string; cta: string };
type FineTune = { headlineScale: number; textAlign: "left" | "center"; showAccent: boolean };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function InstagramGenerator() {
  const { showToast } = useToast();

  const [languageMode, setLanguageMode] = useState<LanguageMode>("bg");
  const [officeId, setOfficeId] = useState("all");
  const [selections, setSelections] = useState<MessageSelections>(emptySelections);
  const [nonce, setNonce] = useState(0);
  const [formatId, setFormatId] = useState<FormatId>("square");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFit, setImageFit] = useState<ImageFit>("cover");
  const [imagePosition, setImagePosition] = useState<ImagePosition>("center");

  const [generated, setGenerated] = useState(false);
  const [variations, setVariations] = useState<DesignVariation[] | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<LayoutPresetId>("minimal");
  const [content, setContent] = useState<EditableCopy>({ headline: "", supportingText: "", cta: "" });
  const [secondary, setSecondary] = useState<EditableCopy | null>(null);
  const [office, setOffice] = useState<OfficeSnapshot | null>(null);
  const [fineTune, setFineTune] = useState<FineTune>({ headlineScale: 1, textAlign: "left", showAccent: true });
  const [showLogo, setShowLogo] = useState(true);
  const [copy, setCopy] = useState<CampaignCopy | null>(null);
  const [hashtagsText, setHashtagsText] = useState("");
  const [generating, setGenerating] = useState(false);

  const canvasRefs = useRef<Record<LayoutPresetId, InstagramCanvasHandle | null>>({
    minimal: null,
    "product-focused": null,
    "bold-promotional": null,
    editorial: null,
    "image-focused": null,
  });

  const primaryLocale: ContextLocale = languageMode === "en" ? "en" : "bg";
  const ctx = useMemo(() => getFortunaContext(primaryLocale), [primaryLocale]);
  const baseCampaignInput = useMemo<Omit<CampaignInput, "nonce">>(
    () => ({ languageMode, officeId, selections }),
    [languageMode, officeId, selections]
  );
  const eyebrowLabel = AD_LABEL[primaryLocale];

  const searchParams = useSearchParams();

  useEffect(() => {
    const postId = searchParams.get("postId");
    const templateId = searchParams.get("templateId");

    if (postId) {
      const post = listPosts().find((p) => p.id === postId);
      if (post) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormatId(post.formatId);
        setSelectedPresetId(post.variation.layoutPresetId);
        const e = post.variation.edits;
        setContent({ headline: e.headline, supportingText: e.supportingText, cta: e.cta });
        setSecondary(e.secondary);
        setOffice(e.office);
        setFineTune({ headlineScale: e.headlineScale, textAlign: e.textAlign, showAccent: e.showAccent });
        setShowLogo(e.showLogo);
        setImageSrc(e.image.src);
        setImageFit(e.image.fit);
        setImagePosition(e.image.position);
        setCopy(post.copy);
        setHashtagsText(post.copy.hashtags.join(" "));
        setVariations(null);
        setGenerated(true);
        showToast("Loaded saved post for editing.", "success");
      }
      return;
    }

    if (templateId) {
      const template = listTemplates().find((t) => t.id === templateId);
      if (template) {
        setFormatId(template.formatId);
        setSelectedPresetId(template.layoutPresetId);
        const e = template.edits;
        setContent({ headline: e.headline, supportingText: e.supportingText, cta: e.cta });
        setSecondary(e.secondary);
        setOffice(e.office);
        setFineTune({ headlineScale: e.headlineScale, textAlign: e.textAlign, showAccent: e.showAccent });
        setShowLogo(e.showLogo);
        setImageSrc(e.image.src);
        setImageFit(e.image.fit);
        setImagePosition(e.image.position);
        setCopy({ headline: e.headline, supportingText: e.supportingText, cta: e.cta, caption: "", hashtags: [] });
        setVariations(null);
        setGenerated(true);
        showToast(`Loaded template "${template.name}". Adjust the messages and regenerate the caption if needed.`, "success");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImageSrc(dataUrl);
  }

  function buildEdits(presetId: LayoutPresetId): PostEdits {
    const preset = layoutPresetById(presetId);
    const image = { src: imageSrc, fit: imageFit, position: imagePosition };

    if (presetId === selectedPresetId) {
      return {
        headline: content.headline,
        supportingText: content.supportingText,
        cta: content.cta,
        secondary,
        headlineScale: fineTune.headlineScale,
        textAlign: fineTune.textAlign,
        image,
        showAccent: fineTune.showAccent,
        showLogo,
        office,
      };
    }

    const variation = variations?.find((v) => v.layoutPresetId === presetId);
    if (variation) return { ...variation.edits, image, showLogo, office };

    return {
      headline: "",
      supportingText: "",
      cta: "",
      secondary: null,
      headlineScale: preset.headlineScale,
      textAlign: preset.textAlign,
      image,
      showAccent: preset.showAccentHairline,
      showLogo,
      office,
    };
  }

  async function runGenerate(nonceValue: number, toastMessage: string) {
    setGenerating(true);
    try {
      const input: CampaignInput = { ...baseCampaignInput, nonce: nonceValue };
      const generator = getContentGenerator();
      const [generatedCopy, newVariations] = await Promise.all([
        generator.generateCampaignCopy(input, primaryLocale),
        generator.generateVariations(input, formatId, primaryLocale),
      ]);
      setCopy(generatedCopy);
      setHashtagsText(generatedCopy.hashtags.join(" "));
      setVariations(newVariations);

      const first = newVariations.find((v) => v.layoutPresetId === "minimal") ?? newVariations[0];
      setSelectedPresetId(first.layoutPresetId);
      setContent({ headline: first.edits.headline, supportingText: first.edits.supportingText, cta: first.edits.cta });
      setSecondary(first.edits.secondary);
      setOffice(first.edits.office);
      setFineTune({ headlineScale: first.edits.headlineScale, textAlign: first.edits.textAlign, showAccent: first.edits.showAccent });
      setGenerated(true);
      showToast(toastMessage, "success");
    } finally {
      setGenerating(false);
    }
  }

  function handleGenerate() {
    setNonce(0);
    runGenerate(0, "Generated 5 design variations.");
  }

  function handleNewVariation() {
    const next = nonce + 1;
    setNonce(next);
    runGenerate(next, "Generated a new creative — your selected messages and office info stayed put.");
  }

  function selectVariation(presetId: LayoutPresetId) {
    setSelectedPresetId(presetId);
    const variation = variations?.find((v) => v.layoutPresetId === presetId);
    if (!variation) return;
    setContent({ headline: variation.edits.headline, supportingText: variation.edits.supportingText, cta: variation.edits.cta });
    setSecondary(variation.edits.secondary);
    setFineTune({ headlineScale: variation.edits.headlineScale, textAlign: variation.edits.textAlign, showAccent: variation.edits.showAccent });
  }

  async function regenerateCaption() {
    const generator = getContentGenerator();
    const fresh = await generator.generateCampaignCopy({ ...baseCampaignInput, nonce: nonce + 1 }, primaryLocale);
    setCopy(fresh);
    setHashtagsText(fresh.hashtags.join(" "));
    showToast("Caption regenerated.", "success");
  }

  function downloadCurrent(type: "image/png" | "image/jpeg") {
    const handle = canvasRefs.current[selectedPresetId];
    const dataUrl = handle?.getDataUrl(type);
    if (!dataUrl) return;
    const ext = type === "image/png" ? "png" : "jpg";
    downloadDataUrl(dataUrl, `fortuna-credit-ad-${selectedPresetId}.${ext}`);
  }

  function downloadAllVariations() {
    for (const preset of LAYOUT_PRESETS) {
      const handle = canvasRefs.current[preset.id];
      const dataUrl = handle?.getDataUrl("image/png");
      if (dataUrl) downloadDataUrl(dataUrl, `fortuna-credit-ad-${preset.id}.png`);
    }
  }

  function handleSavePost(status: GeneratedPost["status"] = "draft") {
    if (!copy) return;
    const preset = layoutPresetById(selectedPresetId);
    const edits = buildEdits(selectedPresetId);
    const thumbnail = canvasRefs.current[selectedPresetId]?.getDataUrl("image/jpeg") ?? undefined;
    const post: GeneratedPost = {
      id: genId("post"),
      campaignName: `${FORTUNA_NAME} — ${POST_TYPE_LABELS.ad}`,
      postType: "ad",
      formatId,
      createdAt: new Date().toISOString(),
      status,
      variation: { id: genId(preset.id), layoutPresetId: preset.id, label: preset.label, formatId, edits },
      copy: {
        ...copy,
        headline: content.headline,
        supportingText: content.supportingText,
        cta: content.cta,
        hashtags: hashtagsText.split(/\s+/).filter(Boolean),
      },
      thumbnail,
    };
    savePost(post);
    showToast("Post saved.", "success");
  }

  function handleSaveTemplate() {
    const preset = layoutPresetById(selectedPresetId);
    const edits = buildEdits(selectedPresetId);
    saveTemplate({
      id: genId("template"),
      name: `${POST_TYPE_LABELS.ad} — ${preset.label}`,
      layoutPresetId: preset.id,
      formatId,
      edits,
      createdAt: new Date().toISOString(),
    });
    showToast("Saved as template.", "success");
  }

  function copyCaption() {
    if (!copy) return;
    navigator.clipboard.writeText(copy.caption).then(() => showToast("Caption copied.", "success"));
  }

  function copyHashtags() {
    navigator.clipboard.writeText(hashtagsText).then(() => showToast("Hashtags copied.", "success"));
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6">
        <p className="font-brand text-2xl text-brand-black">Fortuna Credit Marketing Studio</p>
        <p className="mt-1 text-sm text-brand-gray/60">
          Every post promotes Fortuna Credit — pick the language, an office if relevant, and the messages you want to use.
        </p>
      </div>

      <div className="mb-6">
        <FortunaContextPanel locale={primaryLocale} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Controls */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-black/8 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Language</h2>
            <div className="mt-3 flex gap-1.5">
              {LANGUAGE_MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLanguageMode(mode)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    languageMode === mode ? "border-brand-gold bg-brand-gold text-brand-black" : "border-black/12 text-brand-gray hover:border-brand-gold"
                  }`}
                >
                  {LANGUAGE_LABELS[mode]}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <Select label="Office" value={officeId} onChange={(e) => setOfficeId(e.target.value)}>
                <option value="all">All locations / not office-specific</option>
                {ctx.offices.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                    {o.isNew ? ` (opening ${o.openingDateLabel})` : ""}
                  </option>
                ))}
              </Select>
              <p className="mt-1.5 text-xs text-brand-gray/50">
                Selecting an office attaches its verified phone number and city to the ad — never typed by hand.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-black/8 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Marketing messages</h2>
            <p className="mt-1 text-xs text-brand-gray/50">
              Pick an exact phrase per category, or leave it on <strong>AI Choose</strong> and let the studio pick one for
              you. Anything you pick is used exactly as written.
            </p>
            <div className="mt-4 space-y-4">
              {MESSAGE_MENUS.map((menu) => (
                <Select
                  key={menu.key}
                  label={menu.label}
                  value={selections[menu.key]}
                  onChange={(e) => setSelections((s) => ({ ...s, [menu.key]: e.target.value }))}
                >
                  <option value={AI_CHOOSE}>✨ AI Choose</option>
                  {libraryPhrases(menu.category, primaryLocale).map((phrase) => (
                    <option key={phrase} value={phrase}>
                      {phrase}
                    </option>
                  ))}
                </Select>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-black/8 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Image</h2>
            <div className="mt-4 space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full rounded-xl border border-black/12 bg-white px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand-gold file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-brand-black"
              />
              {imageSrc && (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Uploaded" className="h-14 w-14 rounded-lg object-cover" />
                  <Button variant="ghost" size="sm" onClick={() => setImageSrc(null)}>
                    Remove image
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Select label="Fit" value={imageFit} onChange={(e) => setImageFit(e.target.value as ImageFit)}>
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </Select>
                <Select label="Focus" value={imagePosition} onChange={(e) => setImagePosition(e.target.value as ImagePosition)}>
                  <option value="top">Top</option>
                  <option value="center">Center</option>
                  <option value="bottom">Bottom</option>
                </Select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/8 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Format</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {INSTAGRAM_FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormatId(f.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                    formatId === f.id ? "border-brand-gold bg-brand-gold text-brand-black" : "border-black/12 text-brand-gray hover:border-brand-gold"
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 font-normal opacity-70">
                    {f.width}×{f.height}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <Button onClick={handleGenerate} disabled={generating} className="w-full" size="lg">
            {generating ? "Generating…" : "✨ Generate Post"}
          </Button>
          {generated && (
            <Button onClick={handleNewVariation} disabled={generating} variant="outline" className="w-full" size="md">
              🔄 Generate New Variation
            </Button>
          )}
        </div>

        {/* Preview + results */}
        <div className="space-y-6">
          {!generated ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/60 p-10 text-center">
              <p className="text-sm text-brand-gray/60">
                Click <strong>Generate Post</strong> to see five on-brand Fortuna Credit ad variations here.
              </p>
            </div>
          ) : (
            <>
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-gold">
                  Variations — {eyebrowLabel}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {LAYOUT_PRESETS.map((preset) => {
                    const isSelected = preset.id === selectedPresetId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectVariation(preset.id)}
                        className={`group overflow-hidden rounded-xl border-2 text-left transition-all ${
                          isSelected ? "border-brand-gold shadow-[0_0_0_3px_rgba(201,162,39,0.15)]" : "border-black/10 hover:border-brand-gold/50"
                        }`}
                      >
                        <InstagramCanvas
                          ref={(el) => {
                            canvasRefs.current[preset.id] = el;
                          }}
                          formatId={formatId}
                          layoutPresetId={preset.id}
                          edits={buildEdits(preset.id)}
                          eyebrowLabel={eyebrowLabel}
                        />
                        <p className={`px-2 py-1.5 text-[11px] font-semibold ${isSelected ? "bg-brand-gold text-brand-black" : "bg-black/[0.03] text-brand-gray"}`}>
                          {preset.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="rounded-2xl border border-black/8 bg-brand-black p-6">
                  <div className="mx-auto max-w-md">
                    <InstagramCanvas
                      ref={(el) => {
                        canvasRefs.current[selectedPresetId] = el;
                      }}
                      formatId={formatId}
                      layoutPresetId={selectedPresetId}
                      edits={buildEdits(selectedPresetId)}
                      eyebrowLabel={eyebrowLabel}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => downloadCurrent("image/png")}>
                      Download PNG
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadCurrent("image/jpeg")}>
                      Download JPG
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadAllVariations}>
                      Download all variations
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleSavePost("draft")}>
                      Save as draft
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleSavePost("ready")}>
                      Mark ready &amp; save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleSaveTemplate}>
                      Save as template
                    </Button>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-2xl border border-black/8 bg-white p-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Edit</h3>
                    <div className="mt-4 space-y-4">
                      <TextField label="Headline" value={content.headline} onChange={(v) => setContent((c) => ({ ...c, headline: v }))} />
                      <TextField label="Supporting text" value={content.supportingText} onChange={(v) => setContent((c) => ({ ...c, supportingText: v }))} />
                      <TextField label="CTA" value={content.cta} onChange={(v) => setContent((c) => ({ ...c, cta: v }))} />

                      {secondary && (
                        <div className="space-y-3 rounded-xl border border-black/8 bg-black/[0.02] p-3">
                          <p className="text-xs font-bold uppercase tracking-widest text-brand-gray/50">
                            Secondary language
                          </p>
                          <TextField label="Headline" value={secondary.headline} onChange={(v) => setSecondary((s) => (s ? { ...s, headline: v } : s))} />
                          <TextField label="Supporting text" value={secondary.supportingText} onChange={(v) => setSecondary((s) => (s ? { ...s, supportingText: v } : s))} />
                          <TextField label="CTA" value={secondary.cta} onChange={(v) => setSecondary((s) => (s ? { ...s, cta: v } : s))} />
                        </div>
                      )}

                      <div>
                        <label htmlFor="headline-scale" className="text-sm font-medium text-brand-gray">
                          Headline size
                        </label>
                        <input
                          id="headline-scale"
                          type="range"
                          min={0.7}
                          max={1.3}
                          step={0.05}
                          value={fineTune.headlineScale}
                          onChange={(e) => setFineTune((f) => ({ ...f, headlineScale: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFineTune((f) => ({ ...f, textAlign: "left" }))}
                          className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${fineTune.textAlign === "left" ? "border-brand-gold bg-brand-gold/10" : "border-black/12"}`}
                        >
                          Left align
                        </button>
                        <button
                          type="button"
                          onClick={() => setFineTune((f) => ({ ...f, textAlign: "center" }))}
                          className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold ${fineTune.textAlign === "center" ? "border-brand-gold bg-brand-gold/10" : "border-black/12"}`}
                        >
                          Center align
                        </button>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-brand-gray">
                        <input type="checkbox" checked={fineTune.showAccent} onChange={(e) => setFineTune((f) => ({ ...f, showAccent: e.target.checked }))} className="accent-brand-gold" />
                        Show accent hairline
                      </label>
                      <label className="flex items-center gap-2 text-sm text-brand-gray">
                        <input type="checkbox" checked={showLogo} onChange={(e) => setShowLogo(e.target.checked)} className="accent-brand-gold" />
                        Show logo watermark
                      </label>
                      {office && (
                        <div className="rounded-lg border border-brand-gold/30 bg-brand-gold/5 p-3 text-xs text-brand-gray/70">
                          Contact bar: <strong className="text-brand-black">{office.phone}</strong> · {office.city}
                          <button type="button" onClick={() => setOffice(null)} className="ml-2 text-brand-gold underline">
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/8 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Caption &amp; hashtags</h3>
                      <Button size="sm" variant="ghost" onClick={regenerateCaption}>
                        Regenerate
                      </Button>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="caption" className="text-sm font-medium text-brand-gray">
                          Caption
                        </label>
                        <textarea
                          id="caption"
                          rows={4}
                          value={copy?.caption ?? ""}
                          onChange={(e) => setCopy((c) => (c ? { ...c, caption: e.target.value } : c))}
                          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="hashtags" className="text-sm font-medium text-brand-gray">
                          Hashtags
                        </label>
                        <textarea
                          id="hashtags"
                          rows={2}
                          value={hashtagsText}
                          onChange={(e) => setHashtagsText(e.target.value)}
                          className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={copyCaption}>
                          Copy caption
                        </Button>
                        <Button size="sm" variant="outline" onClick={copyHashtags}>
                          Copy hashtags
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className="block w-fit">
                    {formatId} · {selectedPresetId}
                  </Badge>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-brand-gray">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/12 bg-white px-4 py-3 text-base text-brand-black placeholder:text-brand-gray/40 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
      />
    </div>
  );
}
