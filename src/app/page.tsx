import type { Metadata } from "next";
import { Hero } from "@/components/hero";

export const metadata: Metadata = {
  title: "Vercel Swag Store — Official Merch",
  description:
    "Shop official Vercel merchandise — premium developer apparel, accessories, and gear.",
  openGraph: {
    title: "Vercel Swag Store — Official Merch",
    description:
      "Shop official Vercel merchandise — premium developer apparel, accessories, and gear.",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
    </>
  );
}
