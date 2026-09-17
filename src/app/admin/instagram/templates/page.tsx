"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { listTemplates, deleteTemplate } from "@/lib/instagram/storage";
import { layoutPresetById } from "@/lib/instagram/layoutPresets";
import { formatById, type Template } from "@/lib/instagram/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTemplates(listTemplates());
  }, []);

  function handleDelete(id: string) {
    deleteTemplate(id);
    setTemplates(listTemplates());
    showToast("Template deleted.", "info");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-brand text-2xl text-brand-black">Templates</p>
          <p className="mt-1 text-sm text-brand-gray/60">
            Save a design from the generator as a reusable template — layout and brand styling stay fixed; swap in new
            campaign content each time.
          </p>
        </div>
        <Button href="/admin/instagram">New Post</Button>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white/60 p-10 text-center text-sm text-brand-gray/60">
          No templates yet. In the generator, fine-tune a variation and click <strong>Save as template</strong>.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const preset = layoutPresetById(template.layoutPresetId);
            const format = formatById(template.formatId);
            return (
              <div key={template.id} className="rounded-2xl border border-black/8 bg-white p-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-brand-black">{template.name}</p>
                  <Badge variant="outline">{preset.label}</Badge>
                </div>
                <p className="mt-1 text-xs text-brand-gray/60">
                  {format.label} · {format.width}×{format.height}
                </p>
                <p className="mt-3 text-xs text-brand-gray/70">{preset.description}</p>
                <div className="mt-4 flex gap-3">
                  <Link href={`/admin/instagram?templateId=${template.id}`} className="text-xs font-semibold text-brand-gold underline">
                    Use template
                  </Link>
                  <button onClick={() => handleDelete(template.id)} className="text-xs font-semibold text-red-600 underline">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
