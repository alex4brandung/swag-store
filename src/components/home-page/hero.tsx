import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, VercelTriangle } from "@/components/icons";

const HERO_IMAGE_WIDTH = 1376;
const HERO_IMAGE_HEIGHT = 768;

export function Hero() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-28">
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
          background:
            "radial-gradient(circle, var(--foreground) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-14 xl:gap-20 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8 lg:mb-7">
              <VercelTriangle size={10} />
              <span className="text-xs text-muted-foreground font-medium">
                Official Vercel Merchandise
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
              Gear Up,
              <br />
              <span className="text-muted-foreground">Ship Faster.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Premium developer apparel and accessories from the team that
              brings you Next.js and the best deployment platform on the web.
            </p>

            <Link
              href="/search"
              className="mt-10 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse All Products
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="flex w-full max-w-[min(100%,560px)] justify-center lg:max-w-[min(100%,640px)] lg:justify-end">
            <Image
              src="/swag-lifestyle-hero.png"
              alt="Model wearing black hoodie and tote bag, holding a water bottle, on a white studio background"
              width={HERO_IMAGE_WIDTH}
              height={HERO_IMAGE_HEIGHT}
              priority
              sizes="(max-width: 1023px) min(100vw - 2rem, 560px), (max-width: 1536px) min(50vw - 2rem, 640px), 640px"
              className="h-auto w-full max-h-[min(52vh,28rem)] rounded-2xl border border-border object-cover object-top shadow-[0_12px_32px_rgba(0,0,0,0.18)] lg:max-h-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
