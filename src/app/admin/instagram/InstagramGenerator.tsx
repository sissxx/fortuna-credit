"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import InstagramCanvas, { type InstagramCanvasHandle } from "@/components/admin/InstagramCanvas";
import { LAYOUT_PRESETS, layoutPresetById } from "@/lib/instagram/layoutPresets";
import { getContentGenerator } from "@/lib/instagram/contentGenerator";
import { savePost, saveTemplate, listPosts, listTemplates } from "@/lib/instagram/storage";
import {
  INSTAGRAM_FORMATS,
  POST_TYPES,
  POST_TYPE_LABELS,
  genId,
  type CampaignInput,
  type CampaignCopy,
  type FormatId,
  type GeneratedPost,
  type ImageFit,
  type ImagePosition,
  type LayoutPresetId,
  type PostEdits,
  type PostType,
} from "@/lib/instagram/types";

const emptyCampaign: CampaignInput = {
  campaignName: "",
  productOrService: "",
  headline: "",
  supportingText: "",
  cta: "",
  offer: "",
  startDate: "",
  endDate: "",
  additionalInfo: "",
  postType: "promotional",
};

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

  const [campaign, setCampaign] = useState<CampaignInput>(emptyCampaign);
  const [formatId, setFormatId] = useState<FormatId>("square");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFit, setImageFit] = useState<ImageFit>("cover");
  const [imagePosition, setImagePosition] = useState<ImagePosition>("center");

  const [generated, setGenerated] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<LayoutPresetId>("minimal");
  const [content, setContent] = useState({ headline: "", supportingText: "", cta: "", offer: "" });
  const [fineTune, setFineTune] = useState({ headlineScale: 1, textAlign: "left" as "left" | "center", showAccent: true });
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

  const searchParams = useSearchParams();

  useEffect(() => {
    const postId = searchParams.get("postId");
    const templateId = searchParams.get("templateId");

    if (postId) {
      const post = listPosts().find((p) => p.id === postId);
      if (post) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCampaign((prev) => ({ ...prev, campaignName: post.campaignName, postType: post.postType }));
        setFormatId(post.formatId);
        setSelectedPresetId(post.variation.layoutPresetId);
        const e = post.variation.edits;
        setContent({ headline: e.headline, supportingText: e.supportingText, cta: e.cta, offer: e.offer });
        setFineTune({ headlineScale: e.headlineScale, textAlign: e.textAlign, showAccent: e.showAccent });
        setShowLogo(e.showLogo);
        setImageSrc(e.image.src);
        setImageFit(e.image.fit);
        setImagePosition(e.image.position);
        setCopy(post.copy);
        setHashtagsText(post.copy.hashtags.join(" "));
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
        setContent({ headline: e.headline, supportingText: e.supportingText, cta: e.cta, offer: e.offer });
        setFineTune({ headlineScale: e.headlineScale, textAlign: e.textAlign, showAccent: e.showAccent });
        setShowLogo(e.showLogo);
        setImageSrc(e.image.src);
        setImageFit(e.image.fit);
        setImagePosition(e.image.position);
        setCopy({ headline: e.headline, supportingText: e.supportingText, cta: e.cta, caption: "", hashtags: [] });
        setGenerated(true);
        showToast(`Loaded template "${template.name}". Replace campaign details and generate a caption.`, "success");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function updateCampaign<K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) {
    setCampaign((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setImageSrc(dataUrl);
  }

  function buildEdits(presetId: LayoutPresetId): PostEdits {
    const preset = layoutPresetById(presetId);
    const isSelected = presetId === selectedPresetId;
    return {
      headline: content.headline,
      supportingText: content.supportingText,
      cta: content.cta,
      offer: content.offer,
      headlineScale: isSelected ? fineTune.headlineScale : preset.headlineScale,
      textAlign: isSelected ? fineTune.textAlign : preset.textAlign,
      image: { src: imageSrc, fit: imageFit, position: imagePosition },
      showAccent: isSelected ? fineTune.showAccent : preset.showAccentHairline,
      showLogo,
    };
  }

  async function handleGenerate() {
    if (!campaign.campaignName.trim() || !campaign.productOrService.trim()) {
      showToast("Add a campaign name and product/service first.", "error");
      return;
    }
    setGenerating(true);
    try {
      const generator = getContentGenerator();
      const generatedCopy = await generator.generateCampaignCopy(campaign);
      setCopy(generatedCopy);
      setContent({
        headline: generatedCopy.headline,
        supportingText: generatedCopy.supportingText,
        cta: generatedCopy.cta,
        offer: campaign.offer,
      });
      setHashtagsText(generatedCopy.hashtags.join(" "));
      setSelectedPresetId("minimal");
      const preset = layoutPresetById("minimal");
      setFineTune({ headlineScale: preset.headlineScale, textAlign: preset.textAlign, showAccent: preset.showAccentHairline });
      setGenerated(true);
      showToast("Generated 5 design variations.", "success");
    } finally {
      setGenerating(false);
    }
  }

  function selectVariation(presetId: LayoutPresetId) {
    setSelectedPresetId(presetId);
    const preset = layoutPresetById(presetId);
    setFineTune({ headlineScale: preset.headlineScale, textAlign: preset.textAlign, showAccent: preset.showAccentHairline });
  }

  async function regenerateCaption() {
    const generator = getContentGenerator();
    const fresh = await generator.generateCampaignCopy(campaign);
    setCopy(fresh);
    setHashtagsText(fresh.hashtags.join(" "));
    showToast("Caption regenerated.", "success");
  }

  function downloadCurrent(type: "image/png" | "image/jpeg") {
    const handle = canvasRefs.current[selectedPresetId];
    const dataUrl = handle?.getDataUrl(type);
    if (!dataUrl) return;
    const ext = type === "image/png" ? "png" : "jpg";
    downloadDataUrl(dataUrl, `${campaign.campaignName || "fortuna-post"}-${selectedPresetId}.${ext}`);
  }

  function downloadAllVariations() {
    for (const preset of LAYOUT_PRESETS) {
      const handle = canvasRefs.current[preset.id];
      const dataUrl = handle?.getDataUrl("image/png");
      if (dataUrl) downloadDataUrl(dataUrl, `${campaign.campaignName || "fortuna-post"}-${preset.id}.png`);
    }
  }

  function handleSavePost(status: GeneratedPost["status"] = "draft") {
    if (!copy) return;
    const preset = layoutPresetById(selectedPresetId);
    const edits = buildEdits(selectedPresetId);
    const thumbnail = canvasRefs.current[selectedPresetId]?.getDataUrl("image/jpeg") ?? undefined;
    const post: GeneratedPost = {
      id: genId("post"),
      campaignName: campaign.campaignName,
      postType: campaign.postType,
      formatId,
      createdAt: new Date().toISOString(),
      status,
      variation: { id: genId(preset.id), layoutPresetId: preset.id, label: preset.label, formatId, edits },
      copy: { ...copy, headline: content.headline, supportingText: content.supportingText, cta: content.cta, hashtags: hashtagsText.split(/\s+/).filter(Boolean) },
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
      name: campaign.campaignName || `${preset.label} template`,
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

  const eyebrowLabel = useMemo(() => POST_TYPE_LABELS[campaign.postType], [campaign.postType]);

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6">
        <p className="font-brand text-2xl text-brand-black">Instagram Post Generator</p>
        <p className="mt-1 text-sm text-brand-gray/60">
          Design variations use Fortuna Credit&apos;s brand tokens automatically — colors, fonts, and radius are fixed;
          only composition changes between variations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Controls */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-black/8 bg-white p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Campaign</h2>
            <div className="mt-4 space-y-4">
              <Input label="Campaign name" required value={campaign.campaignName} onChange={(e) => updateCampaign("campaignName", e.target.value)} />
              <Input label="Product / service" required value={campaign.productOrService} onChange={(e) => updateCampaign("productOrService", e.target.value)} />
              <Select label="Post type" value={campaign.postType} onChange={(e) => updateCampaign("postType", e.target.value as PostType)}>
                {POST_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {POST_TYPE_LABELS[t]}
                  </option>
                ))}
              </Select>
              <Input label="Headline" optional hint="Leave blank to auto-generate from product/service" value={campaign.headline} onChange={(e) => updateCampaign("headline", e.target.value)} />
              <Input label="Supporting text" optional value={campaign.supportingText} onChange={(e) => updateCampaign("supportingText", e.target.value)} />
              <Input label="Call to action" optional hint="Leave blank to auto-generate" value={campaign.cta} onChange={(e) => updateCampaign("cta", e.target.value)} />
              <Input label="Price / discount / offer" optional value={campaign.offer} onChange={(e) => updateCampaign("offer", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start date" optional type="date" value={campaign.startDate} onChange={(e) => updateCampaign("startDate", e.target.value)} />
                <Input label="End date" optional type="date" value={campaign.endDate} onChange={(e) => updateCampaign("endDate", e.target.value)} />
              </div>
              <Input label="Additional info" optional value={campaign.additionalInfo} onChange={(e) => updateCampaign("additionalInfo", e.target.value)} />
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
            {generating ? "Generating…" : "Generate Posts"}
          </Button>
        </div>

        {/* Preview + results */}
        <div className="space-y-6">
          {!generated ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/60 p-10 text-center">
              <p className="text-sm text-brand-gray/60">
                Fill in the campaign details and click <strong>Generate Posts</strong> to see five on-brand variations here.
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
                    <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold">Fine-tune</h3>
                    <div className="mt-4 space-y-4">
                      <Input label="Headline" value={content.headline} onChange={(e) => setContent((c) => ({ ...c, headline: e.target.value }))} />
                      <Input label="Supporting text" optional value={content.supportingText} onChange={(e) => setContent((c) => ({ ...c, supportingText: e.target.value }))} />
                      <Input label="CTA" value={content.cta} onChange={(e) => setContent((c) => ({ ...c, cta: e.target.value }))} />
                      <Input label="Offer / price" optional value={content.offer} onChange={(e) => setContent((c) => ({ ...c, offer: e.target.value }))} />
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
