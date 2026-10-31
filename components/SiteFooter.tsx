import Link from "next/link";
import { categories } from "@/lib/calculators";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link aria-label="Rupevia home" className="brand brand-light" href="/">
            <img alt="" className="brand-mark-image" height="90" src="/assets/brand-mark.svg" width="90" />
            <span>rupevia</span>
          </Link>
          <p>Clear numbers for more confident financial decisions.</p>
        </div>
        {categories.slice(0, 4).map((category) => (
          <div className="footer-column" key={category.name}>
            <h3>{category.name}</h3>
            {category.calculators.slice(0, 5).map((item) => (
              <Link href={item.path} key={item.path}>{item.title.replace(" Calculator", "")}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Rupevia. Built for clearer money decisions.</span>
        <span>Estimates are for educational purposes only.</span>
      </div>
    </footer>
  );
}
