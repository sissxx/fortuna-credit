"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export type AccordionItemData = { question: string; answer: string };

export default function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-black/8 rounded-2xl border border-black/8 bg-white">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-semibold text-brand-black transition-colors hover:text-brand-gold sm:px-6"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/15 text-sm transition-transform duration-300",
                    isOpen && "rotate-45 border-brand-gold text-brand-gold"
                  )}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-brand-gray/75 sm:px-6">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
