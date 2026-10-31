import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPage } from "@/components/CalculatorPage";
import { calculators } from "@/lib/calculators";

export function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.path.split("/").filter(Boolean)
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const calculator = calculators.find((item) => item.path === path);

  if (!calculator) return {};

  return {
    title: `${calculator.title} | Rupevia`,
    description: calculator.description,
    alternates: {
      canonical: calculator.path
    },
    keywords: [
      calculator.title,
      `${calculator.category} calculator`,
      "financial calculator",
      "India",
      "Rupevia"
    ]
  };
}

export default async function Page({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const calculator = calculators.find((item) => item.path === path);

  if (!calculator) notFound();

  return <CalculatorPage calculator={calculator} />;
}
