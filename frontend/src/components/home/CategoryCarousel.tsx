"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CATEGORIES, slugify } from "@/lib/mock-data";
import * as Icons from "lucide-react";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

const iconMap: Record<string, any> = Icons;

// Only categories that have a cover image feed the image carousel.
const SLIDES = CATEGORIES.filter((c) => c.image);

export function CategoryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const SPEED = 0.5; // px per frame (~30px/s)
    const step = () => {
      if (!pausedRef.current) {
        el.scrollLeft += SPEED;
        // The track renders the slides twice; loop seamlessly at the halfway point.
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const slides = [...SLIDES, ...SLIDES]; // duplicated for infinite loop

  return (
    <div className="relative group/carousel">
      <div
        ref={trackRef}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-1"
      >
        {slides.map((c, i) => {
          const Ic = iconMap[c.icon.charAt(0).toUpperCase() + c.icon.slice(1)] ?? Package;
          return (
            <Link
              key={`${c.name}-${i}`}
              href={`/category/${slugify(c.name)}`}
              className="group/card relative shrink-0 w-52 aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <img
                src={c.image}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute left-3 top-3 h-9 w-9 rounded-full bg-white/95 grid place-items-center text-orange shadow">
                <Ic className="h-4.5 w-4.5" />
              </span>
              <div className="absolute left-3 bottom-3 text-white">
                <p className="font-display font-bold leading-tight">{c.name}</p>
                <p className="text-[11px] text-white/80">{c.count}+ produits</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Manual controls (also reveal on hover) */}
      <button
        aria-label="Précédent"
        onClick={() => nudge(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-white shadow-md border border-gray-100 text-navy opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:text-orange"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Suivant"
        onClick={() => nudge(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 grid place-items-center rounded-full bg-white shadow-md border border-gray-100 text-navy opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:text-orange"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
