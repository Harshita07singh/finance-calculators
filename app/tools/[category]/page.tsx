import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { calculators, categories } from "@/lib/calculators";

function getCategory(slug: string) {
  return categories.find((category) =>
    category.name.toLowerCase().replaceAll(" ", "-") === slug
  );
}

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.name.toLowerCase().replaceAll(" ", "-")
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) return {};

  const categoryLabel = category.name === "Taxes" ? "Tax" : category.name;

  return {
    title: `${categoryLabel} Calculators | Rupevia`,
    description: category.description,
    alternates: {
      canonical: `/tools/${slug}`
    },
    keywords: [
      `${categoryLabel} calculators`,
      `${category.name} calculator`,
      "financial calculator",
      "India",
      "Rupevia"
    ]
  };
}

export default async function CategoryToolsPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);

  if (!category) notFound();

  const tools = category.discoveryItems.flatMap((item) => {
    const tool = item.path ? calculators.find((calculator) => calculator.path === item.path) : undefined;
    return tool ? [tool] : [];
  });
  const categoryLabel = category.name === "Taxes" ? "Tax" : category.name;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="calculator-intro">
          <p className="breadcrumb"><Link href="/">Home</Link> / {category.name}</p>
          <span className="section-kicker">EXPLORE {category.name.toUpperCase()}</span>
          <h1>{categoryLabel} calculators</h1>
          <p className="intro-description">{category.description} Choose a tool to run your numbers.</p>
        </section>
        <section className="related-section detail-section">
          <div className="related-grid">
            {tools.map((tool) => (
              <Link className="related-card" href={tool.path} key={tool.path}>
                <span>{tool.category}</span>
                <strong>{tool.title}</strong>
                <p>{tool.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
