import Image from "next/image";
import Link from "next/link";
import { HeroScrollCue } from "@/components/hero-scroll-cue";

const HERO_IMAGE_WIDTH = 1376;
const HERO_IMAGE_HEIGHT = 768;

export function Hero() {
  return (
    <section
      className={[
        "relative overflow-hidden",
        "max-lg:flex max-lg:flex-col max-lg:min-h-dvh",
        "py-10 sm:py-16 lg:py-28",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
        }}
      />

      <div className="relative z-1 max-lg:flex-1 max-lg:min-h-0 max-lg:flex max-lg:flex-col max-lg:justify-start">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-14 xl:gap-20 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8 lg:mb-7">
              <VercelTriangle size={10} />
              <span className="text-xs text-muted-foreground font-medium">
                Official Vercel Merchandise
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              Gear Up,
              <br />
              <span className="text-muted-foreground">Ship Faster.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Premium developer apparel and accessories from the team that brings
              you Next.js and the best deployment platform on the web.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-[#171719] font-semibold px-6 py-3 text-sm hover:bg-gray-100 transition-colors"
              >
                Shop All Products
                <ArrowRightIcon />
              </Link>
              <Link
                href="/search?category=t-shirts"
                className="inline-flex items-center gap-2 rounded-lg border border-border text-foreground font-medium px-6 py-3 text-sm hover:border-[#555] hover:bg-muted transition-colors"
              >
                Browse Apparel
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end max-lg:pb-20">
            <div className="relative w-full max-w-[min(100%,560px)] lg:max-w-[min(100%,640px)]">
              <Image
                src="/swag-lifestyle-hero.png"
                alt="Model wearing black hoodie and tote bag, holding a water bottle, on a white studio background"
                width={HERO_IMAGE_WIDTH}
                height={HERO_IMAGE_HEIGHT}
                priority
                sizes="(max-width: 1023px) min(100vw - 2rem, 560px), (max-width: 1536px) min(50vw - 2rem, 640px), 640px"
                className="h-auto w-full max-h-[min(52vh,28rem)] rounded-2xl border border-border object-cover object-top shadow-[0_24px_64px_rgba(0,0,0,0.35)] lg:max-h-none"
              />
            </div>
          </div>
        </div>
        </div>
      </div>

      <HeroScrollCue />
    </section>
  );
}

function VercelTriangle({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 65"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
