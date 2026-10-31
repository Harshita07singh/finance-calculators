import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/calculators";

const siteUrl = "https://rupevia.kesug.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryUrls = categories.map((category) => {
    const slug = category.name.toLowerCase().replaceAll(" ", "-");

    return {
      url: `${siteUrl}/tools/${slug}/`
    };
  });

  const calculatorUrls = calculators.map((calculator) => ({
    url: `${siteUrl}${calculator.path}/`
  }));

  return [
    { url: `${siteUrl}/` },
    ...categoryUrls,
    ...calculatorUrls
  ];
}
