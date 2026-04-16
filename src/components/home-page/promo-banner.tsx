import { getPromotion } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";

/** Matches loaded banner: ~74px inner row, ~100px total with py-3 + border-y. */
const promoBannerContentMinHeight =
  "min-h-[74px] sm:min-h-11";

const promoBannerOuter =
  "border-y border-border bg-muted py-3";
const promoBannerInner =
  "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

/** Same vertical footprint as the loaded banner so Suspense does not shift the hero. */
export function PromoBannerSkeleton() {
  return (
    <div className={promoBannerOuter}>
      <div className={promoBannerInner}>
        <div
          className="w-full"
          aria-busy
          aria-label="Loading promotion"
        >
          <div
            className={`flex flex-col items-center justify-center gap-1.5 sm:hidden ${promoBannerContentMinHeight}`}
          >
            <span className="h-4 w-[85%] max-w-md animate-pulse rounded bg-muted-foreground/20" />
            <span className="h-4 w-full max-w-md animate-pulse rounded bg-muted-foreground/15" />
            <span className="h-4 w-[70%] max-w-xs animate-pulse rounded bg-muted-foreground/20" />
          </div>
          <div className="hidden min-h-11 flex-wrap items-center justify-center gap-x-2 gap-y-1.5 sm:flex">
            <span className="h-4 w-28 max-w-[40%] animate-pulse rounded bg-muted-foreground/20" />
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-muted-foreground/25" />
            <span className="h-4 w-44 max-w-[55%] animate-pulse rounded bg-muted-foreground/15" />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function PromoBanner() {
  "use cache";
  cacheLife("hours");
  cacheTag("promotions");

  const promo = await getPromotion();

  if (!promo || !promo.active) return null;

  return (
    <div className={promoBannerOuter}>
      <div className={promoBannerInner}>
        <p
          className={`flex ${promoBannerContentMinHeight} flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-center text-sm text-foreground`}
        >
          <span className="font-semibold">{promo.title}</span>
          <span className="text-muted-foreground">&middot;</span>
          <span className="text-muted-foreground">{promo.description}</span>
          {promo.code && (
            <>
              <span className="text-muted-foreground">&middot;</span>
              <span className="inline-flex items-center gap-1">
                <span className="text-muted-foreground text-xs">Code:</span>
                <code className="rounded bg-background border border-border px-2 py-0.5 text-xs font-mono font-semibold tracking-wide text-white">
                  {promo.code}
                </code>
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
