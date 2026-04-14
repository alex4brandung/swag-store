"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

const SCROLL_TOP_THRESHOLD_PX = 8;

export function HeroScrollCue() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    function onScroll() {
      setAtTop(window.scrollY <= SCROLL_TOP_THRESHOLD_PX);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#featured-products"
      aria-label="Scroll to featured products"
      aria-hidden={!atTop}
      tabIndex={atTop ? 0 : -1}
      className={[
        "lg:hidden",
        "pointer-events-auto fixed left-1/2 z-20 -translate-x-1/2",
        "bottom-[max(1rem,env(safe-area-inset-bottom,0px))]",
        "inline-flex items-center justify-center rounded-full p-3",
        "text-muted-foreground/60 transition-[opacity,transform,visibility,color] duration-200 ease-out",
        "hover:text-muted-foreground motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40",
        atTop
          ? "visible translate-y-0 opacity-100"
          : "invisible pointer-events-none translate-y-1 opacity-0",
      ].join(" ")}
    >
      <ChevronDownIcon
        size={20}
        strokeWidth={2}
        className="hero-scroll-chevron size-6 animate-bounce motion-reduce:animate-none"
      />
    </a>
  );
}
