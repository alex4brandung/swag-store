import { getPromotion } from "@/lib/api";

export async function PromoBanner() {
  let promo;
  try {
    promo = await getPromotion();
  } catch {
    return null;
  }

  if (!promo || !promo.active) return null;

  return (
    <div className="border-y border-border bg-muted py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-foreground">
          <span className="font-semibold">{promo.title}</span>
          <span className="mx-2 text-muted-foreground">&middot;</span>
          <span className="text-muted-foreground">
            {promo.description}
          </span>
          {promo.code && (
            <>
              <span className="mx-2 text-muted-foreground">
                &middot;
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="text-muted-foreground text-xs">
                  Code:
                </span>
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
