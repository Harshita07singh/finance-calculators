import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rupevia — Every financial calculation, made simple",
  description:
    "Free, easy-to-understand financial calculators built for every Indian money milestone.",
  metadataBase: new URL("https://rupevia.kesug.com"),
  alternates: {
    canonical: "/"
  },
  keywords: ["financial calculators", "India", "money planning", "Rupevia"],
  publisher: "Rupevia",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
