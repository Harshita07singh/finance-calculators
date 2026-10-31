"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";
import { categories } from "@/lib/calculators";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const focusSearch = () => {
    const search = document.getElementById("calculator-search");
    if (search) {
      search.focus();
      return;
    }
    window.location.href = "/#calculator-search";
  };

  return (
    <header className="site-header">
      <Link aria-label="Rupevia home" className="brand" href="/">
        <img alt="" className="brand-mark-image" height="70" src="/assets/brand-mark.svg" width="70" />
        {/* <span>rupevia</span> */}
      </Link>
      <nav aria-label="Main navigation" className={menuOpen ? "primary-nav is-open" : "primary-nav"}>
        <Link href="/">Home</Link>
        <a href="/#calculators">All Calculators</a>
        {categories.slice(0, 3).map((category) => (
          <a href={`/#${category.name.toLowerCase().replaceAll(" ", "-")}`} key={category.name}>
            {category.name}
          </a>
        ))}
        {categories.filter((category) => category.name === "Taxes" || category.name === "Business Finance").map((category) => (
          <a href={`/#${category.name.toLowerCase().replaceAll(" ", "-")}`} key={category.name}>
            {category.name}
          </a>
        ))}
        {/* <button aria-label="Search calculators" className="search-nav" onClick={focusSearch} type="button">
          <img alt="" height="16" src="/assets/search.svg" width="16" />
          <span>Search</span>
        </button> */}
      </nav>
      <div className="mobile-actions">
        <button aria-label="Focus calculator search" className="icon-button" onClick={() => document.getElementById("calculator-search")?.focus()} type="button">
          <img alt="" height="20" src="/assets/search-mobile.svg" width="20" />
        </button>
        <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} className="icon-button" onClick={() => setMenuOpen(!menuOpen)} type="button">
          {menuOpen ? <X size={20} /> : <img alt="" height="20" src="/assets/menu.svg" width="20" />}
        </button>
      </div>
    </header>
  );
}
