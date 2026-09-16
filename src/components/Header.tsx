"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./ui/Button";
import { navItems, fortuna } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-90 border-b border-black/8 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-sm font-medium text-brand-gray transition-colors hover:text-brand-black",
                      isActive && "text-brand-black"
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-brand-gold transition-transform duration-200",
                        isActive && "scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={fortuna.phoneHref}
            className="text-sm font-medium text-brand-gray hover:text-brand-black"
          >
            {fortuna.phone}
          </a>
          <Button href="/apply" size="md">
            Apply Now
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <Button href="/apply" size="sm" className="!px-4 !py-2">
            Apply Now
          </Button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-brand-black"
          >
            <span className="relative block h-3.5 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-4 bg-current transition-all duration-200",
                  menuOpen && "top-1.5 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity duration-200",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-3 h-0.5 w-4 bg-current transition-all duration-200",
                  menuOpen && "top-1.5 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden border-t border-black/8 bg-white transition-all duration-300 ease-out lg:hidden",
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 border-t-0"
        )}
      >
        <div className="overflow-hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium text-brand-gray hover:bg-black/5 hover:text-brand-black",
                  pathname === item.href && "bg-black/5 text-brand-black"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={fortuna.phoneHref}
              className="mt-2 rounded-lg border border-black/10 px-3 py-3 text-center text-base font-medium text-brand-gray"
            >
              Call {fortuna.phone}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
