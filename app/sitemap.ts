import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/candidature`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/conditions`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/confidentialite`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
