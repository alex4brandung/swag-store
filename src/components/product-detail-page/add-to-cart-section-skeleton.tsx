export function AddToCartSectionSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      aria-hidden
    >
      <div className="h-5 w-[150px] animate-pulse rounded-md bg-muted-foreground/20" />
      <div className="h-[42px] w-[200px] animate-pulse rounded-md bg-muted-foreground/20" />
      <div className="h-10 w-full animate-pulse rounded-md bg-muted-foreground/20" />
    </div>
  );
}
