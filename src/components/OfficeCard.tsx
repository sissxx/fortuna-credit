"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import { localePath, type Locale } from "@/i18n/config";
import { formatDate, t } from "@/i18n/format";
import type { Dictionary } from "@/i18n/getDictionary";

export type OfficeView = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: { mondayFriday: string; saturday: string; sunday: string };
  isNew: boolean;
  openingDateISO?: string;
};

export default function OfficeCard({ office, dict, locale }: { office: OfficeView; dict: Dictionary; locale: Locale }) {
  const [isOpenNow, setIsOpenNow] = useState<boolean | null>(null);

  useEffect(() => {
    if (office.isNew && office.openingDateISO) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsOpenNow(Date.now() >= new Date(office.openingDateISO).getTime());
    }
  }, [office]);

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`;
  const c = dict.officeCard;

  return (
    <div
      className={
        office.isNew
          ? "relative overflow-hidden rounded-3xl border border-brand-gold/40 bg-gradient-to-br from-brand-black-deep to-brand-black p-7 text-white shadow-[0_0_0_1px_rgba(201,162,39,0.1)] animate-glow"
          : "rounded-3xl border border-black/8 bg-white p-7"
      }
    >
      {office.isNew && (
        <div className="mb-4">
          <Badge variant={isOpenNow ? "success" : "gold"}>
            {isOpenNow ? c.nowOpen : t(c.comingSoon, { date: office.openingDateISO ? formatDate(office.openingDateISO, locale) : "" })}
          </Badge>
        </div>
      )}

      <h3 className={office.isNew ? "text-xl font-bold text-white" : "text-xl font-bold text-brand-black"}>{office.name}</h3>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex gap-3">
          <dt className={office.isNew ? "min-w-[5.5rem] shrink-0 font-semibold text-brand-gold" : "min-w-[5.5rem] shrink-0 font-semibold text-brand-gray/60"}>
            {c.address}
          </dt>
          <dd className={office.isNew ? "text-brand-muted" : "text-brand-gray/80"}>{office.address}</dd>
        </div>
        <div className="flex gap-3">
          <dt className={office.isNew ? "min-w-[5.5rem] shrink-0 font-semibold text-brand-gold" : "min-w-[5.5rem] shrink-0 font-semibold text-brand-gray/60"}>
            {c.phone}
          </dt>
          <dd className={office.isNew ? "text-brand-muted" : "text-brand-gray/80"}>{office.phone}</dd>
        </div>
        <div className="flex gap-3">
          <dt className={office.isNew ? "min-w-[5.5rem] shrink-0 font-semibold text-brand-gold" : "min-w-[5.5rem] shrink-0 font-semibold text-brand-gray/60"}>
            {c.hours}
          </dt>
          <dd className={office.isNew ? "text-brand-muted" : "text-brand-gray/80"}>
            <span className="block">
              {c.mondayFriday}: {office.hours.mondayFriday}
            </span>
            <span className="block">
              {c.saturday}: {office.hours.saturday}
            </span>
            <span className="block">
              {c.sunday}: {office.hours.sunday}
            </span>
          </dd>
        </div>
        {office.isNew && office.openingDateISO && (
          <div className="flex gap-3">
            <dt className="min-w-[5.5rem] shrink-0 font-semibold text-brand-gold">{c.opening}</dt>
            <dd className="text-brand-muted">{formatDate(office.openingDateISO, locale)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={
            office.isNew
              ? "inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-black hover:bg-brand-gold-bright"
              : "inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-black hover:border-brand-gold"
          }
        >
          {c.getDirections}
        </Link>
        <Button href={localePath(locale, "apply")} size="sm" variant={office.isNew ? "outline" : "secondary"}>
          {c.applyHere}
        </Button>
      </div>
    </div>
  );
}
