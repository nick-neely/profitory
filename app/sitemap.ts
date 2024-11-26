import type { MetadataRoute } from "next";
import { url } from "./(frontend)/layout";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${url}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
