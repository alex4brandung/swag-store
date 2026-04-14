"use cache";

import { cacheLife } from "next/cache";
import { VercelTriangle } from "./icons";

export async function Footer() {
  cacheLife("days");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <VercelTriangle className="text-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Vercel Swag Store
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {year} Vercel, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
