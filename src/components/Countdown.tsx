"use client";

import { useEffect, useState } from "react";
import Button from "./ui/Button";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function getTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-brand-gold/30 bg-white/5 text-2xl font-bold tabular-nums text-brand-gold-bright sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({
  targetDate,
  city,
  address,
}: {
  targetDate: string;
  city: string;
  address: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return <div className="h-32" aria-hidden />;
  }

  if (!timeLeft) {
    return (
      <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-black">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-black" aria-hidden />
          We are open
        </span>
        <p className="text-lg text-white">
          Visit our new Fortuna Credit office in <span className="text-brand-gold-bright">{city}</span>.
        </p>
        <Button href="/locations" variant="primary">
          Get Directions
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">New office opening</p>
        <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">October 1</p>
      </div>
      <div
        className="flex items-center gap-2.5 sm:gap-4"
        role="timer"
        aria-live="off"
        aria-label={`Time remaining until new office opening: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
      >
        <Unit value={timeLeft.days} label="Days" />
        <span className="pb-5 text-xl text-brand-gold/50" aria-hidden>:</span>
        <Unit value={timeLeft.hours} label="Hours" />
        <span className="pb-5 text-xl text-brand-gold/50" aria-hidden>:</span>
        <Unit value={timeLeft.minutes} label="Minutes" />
        <span className="pb-5 text-xl text-brand-gold/50" aria-hidden>:</span>
        <Unit value={timeLeft.seconds} label="Seconds" />
      </div>
      <p className="max-w-sm text-sm text-brand-muted">{address}</p>
    </div>
  );
}
