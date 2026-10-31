"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, calculators } from "@/lib/calculators";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const categoryIcons: Record<string, string> = {
  Loans: "hand-coins.svg",
  Investments: "chart-combined-card.svg",
  Savings: "piggy-bank.svg",
  Taxes: "receipt-rupee-card.svg",
  "Personal Finance": "wallet.svg",
  "Business Finance": "briefcase.svg"
};

const popular = [
  { label: "Home EMI", href: "/loans/home-emi-calculator" },
  { label: "SIP", href: "/investments/sip-calculator" },
  { label: "Income Tax", href: "/taxes/income-tax-calculator" }
];

const quickTools = [
  {
    title: "Home EMI",
    description: "Find the monthly payment that fits your home plans.",
    action: "Plan your home loan",
    href: "/loans/home-emi-calculator",
    icon: "house-card.svg"
  },
  {
    title: "SIP Calculator",
    description: "See what a consistent investment could grow into.",
    action: "Build your future",
    href: "/investments/sip-calculator",
    icon: "chart-combined.svg"
  },
  {
    title: "Income Tax",
    description: "Compare regimes and estimate your tax liability.",
    action: "Know your take-home",
    href: "/taxes/income-tax-calculator",
    icon: "receipt-rupee.svg"
  },
  {
    title: "Fixed Deposit",
    description: "Understand your FD maturity amount and returns.",
    action: "Make savings count",
    href: "/savings/fixed-deposit-calculator",
    icon: "landmark.svg"
  }
];

const trendingTools = [
  {
    category: "INVESTMENTS",
    title: "SIP Calculator",
    description: "Plan a monthly investing habit",
    href: "/investments/sip-calculator"
  },
  {
    category: "LOANS",
    title: "Home EMI Calculator",
    description: "Find your comfortable monthly payment",
    href: "/loans/home-emi-calculator"
  },
  {
    category: "TAXES",
    title: "Income Tax Calculator",
    description: "Compare the old and new tax regimes",
    href: "/taxes/income-tax-calculator"
  }
];

const recentTools = [
  {
    category: "LOANS",
    title: "Loan Prepayment",
    description: "See the impact of one extra payment",
    href: "/loans/loan-prepayment-calculator"
  },
  {
    category: "PERSONAL FINANCE",
    title: "Emergency Fund",
    description: "Build a buffer for the unexpected",
    href: "/personal-finance/emergency-fund-calculator"
  },
  {
    category: "BUSINESS FINANCE",
    title: "Break-even Calculator",
    description: "Know when your business covers its costs",
    href: "/business-finance/break-even-calculator"
  }
];

const searchableTools = [
  ...calculators.map((item) => ({
    title: item.title,
    category: item.category,
    path: item.path,
    description: item.shortDescription
  }))
];

export function HomePage() {
  const [query, setQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? searchableTools.filter((item) => `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(search)) : [];
  }, [query]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <span className="eyebrow-pill"><img alt="" height="13" src="/assets/sparkles.svg" width="13" /> BIG DECISIONS. CLEARER NUMBERS. CHECK YOUR FINANCES</span>
           
            <h1>Rupevia Every Financial Calculation, Made Simple.</h1>
            <p className="hero-description">
              From your first SIP to your forever home. Explore free, easy-to-understand calculators built for every Indian money milestone.
            </p>
            <div className="hero-search-wrap">
              <div className="hero-search">
                <SearchIcon />
                <input
                  aria-label="What would you like to calculate?"
                  autoComplete="off"
                  id="calculator-search"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="What would you like to calculate?"
                  value={query}
                />
                {/* <button aria-label="Search calculators" onClick={() => filtered[0] ? window.location.assign(filtered[0].path) : document.getElementById("calculators")?.scrollIntoView({ behavior: "smooth" })} type="button">
                  <img alt="" aria-hidden="true" src="/assets/arrow-right.svg" />
                </button> */}
              </div>
              {filtered.length > 0 && (
                <div className="search-results">
                  {filtered.slice(0, 5).map((item) => (
                    <Link href={item.path} key={item.path} onClick={() => setQuery("")}>
                      <span>{item.title}</span><img alt="" aria-hidden="true" src="/assets/arrow-up-right.svg" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <p className="popular-searches">Popular searches: {popular.map((item, index) => (
              <span key={item.label}>{index > 0 && <span className="dot-separator">·</span>}<Link href={item.href}>{item.label}</Link></span>
            ))}</p>
            <div className="trust-row">
              {["Always free", "No sign-up", "Private by design"].map((item) => <span key={item}><img alt="" height="14" src="/assets/check-circle.svg" width="14" />{item}</span>)}
            </div>
          </div>
          <div className="finance-preview">
            <div className="preview-heading">
              <span><img alt="" height="20" src="/assets/house.svg" width="20" /> Your home. Your numbers.</span>
              <span className="live-tag">LIVE</span>
            </div>
            <p className="preview-label">Estimated monthly EMI</p>
            <div className="preview-value">₹43,391 <span>/ month</span></div>
            <div className="preview-facts">
              <div><small>Loan amount</small><strong>₹50 lakh</strong></div>
              <div><small>Interest rate</small><strong>8.5%</strong></div>
              <div><small>Tenure</small><strong>20 years</strong></div>
            </div>
            <div className="preview-slider"><span /></div>
            <p className="preview-foot"><img alt="" height="14" src="/assets/check-circle.svg" width="14" /> A plan that feels possible.</p>
          </div>
        </section>

        {/* <section className="ad-strip" aria-label="Advertisement">
          <span>ADVERTISEMENT</span>
          <strong>Google AdSense · Responsive display ad</strong>
        </section> */}

        <section className="metrics-strip" aria-label="Rupevia benefits">
          <div><img alt="" height="13" src="/assets/sparkles.svg" width="13" /><strong>20+</strong><span>calculators</span></div>
          <div><img alt="" height="24" src="/assets/calculator.svg" width="24" /><strong>100%</strong><span>free to use</span></div>
          <div><img alt="" height="24" src="/assets/shield-check.svg" width="24" /><strong>Private</strong><span>by design</span></div>
          <div><img alt="" height="14" src="/assets/check-circle.svg" width="14" /><strong>Clear</strong><span>transparent formulas</span></div>
        </section>

        <section className="section-block" id="calculators">
          <div className="section-heading">
            <div><span className="section-kicker">A GOOD PLACE TO START</span><h2>Small calculations. Big clarity.</h2><p>The tools people reach for when life gets financial.</p></div>
            <Link className="text-link" href="/#all-categories">Explore all <img alt="" aria-hidden="true" src="/assets/arrow-right.svg" /></Link>
          </div>
          <div className="quick-grid">
            {quickTools.map((item) => (
              <Link className="quick-card" href={item.href} key={item.title}>
                <span className="card-icon"><img alt="" src={`/assets/${item.icon}`} /></span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <span className="card-action">{item.action} <img alt="" aria-hidden="true" src="/assets/arrow-up-right.svg" /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="category-band">
          <div className="category-section section-block" id="all-categories">
          <div className="section-heading">
            <div><span className="section-kicker">EXPLORE ALL CALCULATORS</span><h2>Whatever’s next, run the numbers.</h2><p>Six ways to navigate your finances. One place to find your answer.</p></div>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const icon = categoryIcons[category.name];
              const featuredPaths = new Set(category.discoveryItems.flatMap((item) => item.path ? [item.path] : []));
              const additionalItems = category.calculators.filter((item) => !featuredPaths.has(item.path));
              const showingAll = expandedCategory === category.name;
              const discoveryItems = showingAll
                ? [...category.discoveryItems, ...additionalItems.map((item) => ({ label: item.title.replace(" Calculator", ""), path: item.path }))]
                : category.discoveryItems;
              return (
                <section className="category-card" id={category.name.toLowerCase().replaceAll(" ", "-")} key={category.name}>
                  <h3><span className="mini-icon"><img alt="" src={`/assets/${icon}`} /></span>{category.name}</h3>
                  <p>{category.description}</p>
                  {discoveryItems.map((item) => (
                    <Link href={item.path} key={item.label}>{item.label}<span aria-hidden="true">→</span></Link>
                  ))}
                  {additionalItems.length > 0 ? (
                    <button className="category-expand" onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)} type="button">
                      {showingAll ? "Show fewer" : category.exploreLabel} <span aria-hidden="true">→</span>
                    </button>
                  ) : <Link className="category-explore" href={`/tools/${category.name.toLowerCase().replaceAll(" ", "-")}`}>{category.exploreLabel} <span aria-hidden="true">→</span></Link>}
                </section>
              );
            })}
          </div>
          </div>
        </section>

        <section className="split-section section-block">
          <div className="tool-collection">
            <h2 className="collection-heading"><img alt="" src="/assets/trending-up.svg" />Trending right now</h2>
            <p className="muted-copy">A useful pulse on everyday money decisions.</p>
            {trendingTools.map((item) => <EditorialTool {...item} key={item.title} />)}
          </div>
          <div className="tool-collection">
            <h2 className="collection-heading"><img alt="" src="/assets/recent-sparkles.svg" />Recently added</h2>
            <p className="muted-copy">More ways to see the bigger picture.</p>
            {recentTools.map((item) => <EditorialTool {...item} key={item.title} />)}
          </div>
        </section>

        <section className="promise-band">
          <div className="section-block">
            <span className="section-kicker">OUR PROMISE</span>
            <h2>No jargon. No guesswork. Just the numbers.</h2>
            <div className="promise-grid">
              <div><img alt="" height="24" src="/assets/calculator.svg" width="24" /><strong>Built to be simple</strong><p>Clear inputs and easy-to-understand estimates.</p></div>
              <div><img alt="" height="24" src="/assets/shield-check.svg" width="24" /><strong>Your data stays yours</strong><p>No account, no personal data, no surprises.</p></div>
              <div><img alt="" height="22" src="/assets/chart-combined.svg" width="22" /><strong>Made for real life</strong><p>Practical tools for the financial choices that matter.</p></div>
            </div>
          </div>
        </section>

        <section className="faq-intro section-block">
          <span className="section-kicker">HELPFUL, ALWAYS</span>
          <h2>A little clarity, before you calculate.</h2>
          <p>Rupevia calculators are free tools to help you explore your options and understand the numbers behind everyday decisions.</p>
          <div className="intro-faqs">
            <div><strong>Are Rupevia calculators free to use?</strong><p>Yes. Every calculator is free, with no sign-up and no hidden fees.</p></div>
            <div><strong>Do the results guarantee an outcome?</strong><p>No. Results are estimates that can help with planning. Actual terms and outcomes may vary.</p></div>
            <div><strong>Can I use these tools on my phone?</strong><p>Yes. The calculators are designed to work across mobile, tablet and desktop screens.</p></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function EditorialTool({ category, title, description, href }: { category: string; title: string; description: string; href: string }) {
  return (
    <Link className="editorial-tool" href={href}>
      <span className="editorial-copy">
        <span className="editorial-category">{category}</span>
        <strong>{title}</strong>
        <span className="editorial-description">{description}</span>
      </span>
      <img alt="" aria-hidden="true" src="/assets/arrow-up-right-feature.svg" />
    </Link>
  );
}

function SearchIcon() {
  return <img alt="" aria-hidden="true" className="search-input-icon" height="20" src="/assets/search-input.svg" width="20" />;
}
