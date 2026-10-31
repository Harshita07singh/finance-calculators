"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Download, Info, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { CalculatorDefinition } from "@/lib/calculators";
import { calculators } from "@/lib/calculators";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

type Values = Record<string, number>;

type Calculation = {
  total: number;
  headline: number;
  interest: number;
  invested: number;
  monthly: number;
  label: string;
  unit?: "percent" | "units";
  metrics?: { label: string; value: string }[];
  chartValues?: { label: string; value: number; display?: string }[];
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function progressiveTax(income: number, slabs: { limit: number; rate: number }[]) {
  let tax = 0;
  let lowerLimit = 0;

  for (const slab of slabs) {
    tax += Math.max(0, Math.min(income, slab.limit) - lowerLimit) * slab.rate;
    if (income <= slab.limit) break;
    lowerLimit = slab.limit;
  }

  return tax;
}

function estimateIncomeTax(income: number, deductions: number, regime: "old" | "new") {
  const standardDeduction = regime === "new" ? 75000 : 50000;
  const taxableIncome = Math.max(0, income - deductions - standardDeduction);
  const slabs = regime === "new"
    ? [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 0.05 },
        { limit: 1200000, rate: 0.1 },
        { limit: 1600000, rate: 0.15 },
        { limit: 2000000, rate: 0.2 },
        { limit: 2400000, rate: 0.25 },
        { limit: Number.POSITIVE_INFINITY, rate: 0.3 }
      ]
    : [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.2 },
        { limit: Number.POSITIVE_INFINITY, rate: 0.3 }
      ];
  const slabTax = progressiveTax(taxableIncome, slabs);
  const rebateLimit = regime === "new" ? 60000 : 12500;
  const rebateThreshold = regime === "new" ? 1200000 : 500000;
  const rebate = taxableIncome <= rebateThreshold ? Math.min(slabTax, rebateLimit) : 0;

  return Math.max(0, slabTax - rebate) * 1.04;
}

function calculate(calculator: CalculatorDefinition, values: Values): Calculation {
  const principal = Math.max(0, values.amount ?? 0);
  const annualRate = Math.max(0, values.rate ?? 0) / 100;
  const years = Math.max(1 / 12, values.years ?? 1);
  const monthlyRate = annualRate / 12;
  const months = Math.max(1, Math.round(years * 12));
  const path = calculator.path;

  if (path.includes("/taxes/income-tax")) {
    const annualIncome = principal;
    const oldTax = estimateIncomeTax(annualIncome, values.deductions ?? 0, "old");
    const newTax = estimateIncomeTax(annualIncome, 0, "new");
    const selectedTax = Math.min(oldTax, newTax);
    return {
      total: selectedTax,
      headline: selectedTax,
      interest: selectedTax,
      invested: annualIncome,
      monthly: 0,
      label: "Estimated annual income tax",
      metrics: [
        { label: "New regime estimate", value: currency.format(newTax) },
        { label: "Old regime estimate", value: currency.format(oldTax) },
        { label: "Lower estimate", value: oldTax < newTax ? "Old regime" : "New regime" }
      ],
      chartValues: [
        { label: "New regime tax", value: newTax },
        { label: "Old regime tax", value: oldTax }
      ]
    };
  }

  if (path.includes("hra-exemption")) {
    const basicSalary = principal;
    const hraReceived = Math.max(0, values.rate ?? 0);
    const annualRent = Math.max(0, values.years ?? 0);
    const exemption = Math.max(0, Math.min(hraReceived, annualRent - basicSalary * 0.1, basicSalary * 0.5));
    return {
      total: exemption,
      headline: exemption,
      interest: exemption,
      invested: basicSalary,
      monthly: 0,
      label: "Estimated HRA exemption",
      metrics: [
        { label: "Annual basic salary", value: currency.format(basicSalary) },
        { label: "Annual HRA received", value: currency.format(hraReceived) },
        { label: "Exempt HRA", value: currency.format(exemption) }
      ],
      chartValues: [
        { label: "HRA received", value: hraReceived },
        { label: "Exempt HRA", value: exemption },
        { label: "Not exempt", value: Math.max(0, hraReceived - exemption) }
      ]
    };
  }

  if (path.includes("gst-calculator")) {
    const gst = principal * annualRate;
    return {
      total: principal + gst,
      headline: gst,
      interest: gst,
      invested: principal,
      monthly: 0,
      label: "Estimated GST amount",
      metrics: [
        { label: "Taxable amount", value: currency.format(principal) },
        { label: "GST amount", value: currency.format(gst) },
        { label: "Total including GST", value: currency.format(principal + gst) }
      ],
      chartValues: [
        { label: "Taxable amount", value: principal },
        { label: "GST", value: gst },
        { label: "Total", value: principal + gst }
      ]
    };
  }

  if (path.includes("capital-gains")) {
    const saleValue = Math.max(0, values.rate ?? 0);
    const capitalGain = saleValue - principal;
    const taxRate = Math.max(0, values.taxRate ?? 0) / 100;
    const tax = Math.max(0, capitalGain) * taxRate;
    return {
      total: tax,
      headline: tax,
      interest: capitalGain,
      invested: principal,
      monthly: 0,
      label: "Estimated capital gains tax",
      metrics: [
        { label: "Purchase price", value: currency.format(principal) },
        { label: "Sale value", value: currency.format(saleValue) },
        { label: "Capital gain", value: currency.format(capitalGain) },
        { label: "Estimated tax", value: currency.format(tax) }
      ],
      chartValues: [
        { label: "Purchase price", value: principal },
        { label: "Sale value", value: saleValue },
        { label: "Capital gain", value: capitalGain },
        { label: "Estimated tax", value: tax }
      ]
    };
  }

  if (path.includes("tds-calculator")) {
    const tds = principal * annualRate;
    return {
      total: tds,
      headline: tds,
      interest: tds,
      invested: principal,
      monthly: 0,
      label: "Estimated TDS deduction",
      metrics: [
        { label: "Payment amount", value: currency.format(principal) },
        { label: "TDS deducted", value: currency.format(tds) },
        { label: "Net payment", value: currency.format(principal - tds) }
      ],
      chartValues: [
        { label: "Payment amount", value: principal },
        { label: "TDS deducted", value: tds },
        { label: "Net payment", value: principal - tds }
      ]
    };
  }

  if (path.includes("budget-planner")) {
    const expenses = Math.max(0, values.rate ?? 0);
    const savingsTarget = Math.max(0, values.years ?? 0);
    const remaining = principal - expenses - savingsTarget;
    return {
      total: remaining,
      headline: remaining,
      interest: remaining,
      invested: principal,
      monthly: remaining,
      label: "Monthly amount left unallocated",
      metrics: [
        { label: "Monthly income", value: currency.format(principal) },
        { label: "Expenses + savings target", value: currency.format(expenses + savingsTarget) },
        { label: "Amount left", value: currency.format(remaining) }
      ],
      chartValues: [
        { label: "Monthly income", value: principal },
        { label: "Planned expenses and savings", value: expenses + savingsTarget },
        { label: "Unallocated amount", value: remaining }
      ]
    };
  }

  if (path.includes("net-worth")) {
    const liabilities = Math.max(0, values.rate ?? 0);
    const netWorth = principal - liabilities;
    return {
      total: netWorth,
      headline: netWorth,
      interest: netWorth,
      invested: principal,
      monthly: 0,
      label: "Estimated net worth",
      metrics: [
        { label: "Total assets", value: currency.format(principal) },
        { label: "Total liabilities", value: currency.format(liabilities) },
        { label: "Net worth", value: currency.format(netWorth) }
      ],
      chartValues: [
        { label: "Assets", value: principal },
        { label: "Liabilities", value: liabilities },
        { label: "Net worth", value: netWorth }
      ]
    };
  }

  if (path.includes("emergency-fund")) {
    const savings = Math.max(0, values.rate ?? 0);
    const target = principal * Math.max(1, values.years ?? 1);
    const gap = Math.max(0, target - savings);
    return {
      total: target,
      headline: gap,
      interest: gap,
      invested: savings,
      monthly: 0,
      label: "Additional savings needed",
      metrics: [
        { label: "Emergency fund target", value: currency.format(target) },
        { label: "Current savings", value: currency.format(savings) },
        { label: "Remaining gap", value: currency.format(gap) }
      ],
      chartValues: [
        { label: "Fund target", value: target },
        { label: "Current savings", value: savings },
        { label: "Remaining gap", value: gap }
      ]
    };
  }

  if (path.includes("profit-margin")) {
    const costs = Math.max(0, values.rate ?? 0);
    const profit = principal - costs;
    const margin = principal > 0 ? (profit / principal) * 100 : 0;
    return {
      total: profit,
      headline: margin,
      interest: profit,
      invested: principal,
      monthly: 0,
      label: "Estimated profit margin",
      unit: "percent",
      metrics: [
        { label: "Revenue", value: currency.format(principal) },
        { label: "Total costs", value: currency.format(costs) },
        { label: "Profit", value: currency.format(profit) }
      ],
      chartValues: [
        { label: "Revenue", value: principal },
        { label: "Costs", value: costs },
        { label: "Profit", value: profit }
      ]
    };
  }

  if (path.includes("break-even")) {
    const sellingPrice = Math.max(0, values.rate ?? 0);
    const variableCost = Math.max(0, values.years ?? 0);
    const contribution = sellingPrice - variableCost;
    const units = contribution > 0 ? Math.ceil(principal / contribution) : 0;
    return {
      total: units,
      headline: units,
      interest: units,
      invested: principal,
      monthly: 0,
      label: contribution > 0 ? "Estimated break-even units" : "No break-even at current unit pricing",
      unit: "units",
      metrics: [
        { label: "Fixed costs", value: currency.format(principal) },
        { label: "Contribution per unit", value: currency.format(contribution) },
        { label: "Units to break even", value: contribution > 0 ? units.toLocaleString("en-IN") : "Not achievable" }
      ],
      chartValues: [
        { label: "Fixed costs", value: principal },
        { label: "Contribution per unit", value: contribution },
        { label: "Break-even units", value: units, display: contribution > 0 ? `${units.toLocaleString("en-IN")} units` : "Not achievable" }
      ]
    };
  }

  if (path.includes("working-capital")) {
    const liabilities = Math.max(0, values.rate ?? 0);
    const workingCapital = principal - liabilities;
    return {
      total: workingCapital,
      headline: workingCapital,
      interest: workingCapital,
      invested: principal,
      monthly: 0,
      label: "Estimated net working capital",
      metrics: [
        { label: "Current assets", value: currency.format(principal) },
        { label: "Current liabilities", value: currency.format(liabilities) },
        { label: "Net working capital", value: currency.format(workingCapital) }
      ],
      chartValues: [
        { label: "Current assets", value: principal },
        { label: "Current liabilities", value: liabilities },
        { label: "Net working capital", value: workingCapital }
      ]
    };
  }

  if (path.includes("invoice-discounting")) {
    const days = Math.max(0, values.years ?? 0);
    const discount = principal * annualRate * days / 365;
    const proceeds = principal - discount;
    return {
      total: proceeds,
      headline: proceeds,
      interest: -discount,
      invested: principal,
      monthly: 0,
      label: "Estimated net invoice proceeds",
      metrics: [
        { label: "Invoice amount", value: currency.format(principal) },
        { label: "Discount fee", value: currency.format(discount) },
        { label: "Net proceeds", value: currency.format(proceeds) }
      ],
      chartValues: [
        { label: "Invoice amount", value: principal },
        { label: "Discount fee", value: discount },
        { label: "Net proceeds", value: proceeds }
      ]
    };
  }

  if (path.includes("loan-eligibility")) {
    const affordablePayment = Math.max(0, principal * 0.4 - (values.existingEmi ?? 0));
    const eligiblePrincipal = monthlyRate === 0
      ? affordablePayment * months
      : affordablePayment * (((1 + monthlyRate) ** months - 1) / (monthlyRate * (1 + monthlyRate) ** months));
    const existingEmi = Math.max(0, values.existingEmi ?? 0);
    return {
      total: eligiblePrincipal,
      headline: eligiblePrincipal,
      interest: eligiblePrincipal * annualRate * years,
      invested: eligiblePrincipal,
      monthly: affordablePayment,
      label: "Estimated loan eligibility",
      metrics: [
        { label: "Monthly income", value: currency.format(principal) },
        { label: "Existing monthly EMIs", value: currency.format(existingEmi) },
        { label: "Available EMI capacity", value: currency.format(affordablePayment) }
      ],
      chartValues: [
        { label: "Income-based EMI limit", value: principal * 0.4 },
        { label: "Existing EMIs", value: existingEmi },
        { label: "Available EMI", value: affordablePayment },
        { label: "Estimated eligible loan", value: eligiblePrincipal }
      ]
    };
  }

  if (path.includes("loan-prepayment")) {
    const emi = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
    const extra = Math.max(0, values.extra ?? 0);
    function payoff(payment: number) {
      let balance = principal;
      let interest = 0;
      let total = 0;
      let elapsedMonths = 0;

      while (balance > 0 && elapsedMonths < months) {
        const monthInterest = balance * monthlyRate;
        const actualPayment = Math.min(payment, balance + monthInterest);
        balance = Math.max(0, balance + monthInterest - actualPayment);
        interest += monthInterest;
        total += actualPayment;
        elapsedMonths += 1;
      }

      return { interest, total, elapsedMonths };
    }

    const baseline = payoff(emi);
    const adjustedPayment = emi + extra;
    const adjusted = payoff(adjustedPayment);
    const interestSaved = Math.max(0, baseline.interest - adjusted.interest);
    const monthsSaved = Math.max(0, baseline.elapsedMonths - adjusted.elapsedMonths);
    return {
      total: adjusted.total,
      headline: interestSaved,
      interest: adjusted.interest,
      invested: principal,
      monthly: adjustedPayment,
      label: "Estimated interest saved",
      metrics: [
        { label: "Standard EMI", value: currency.format(emi) },
        { label: "EMI with extra payment", value: currency.format(adjustedPayment) },
        { label: "Interest saved", value: currency.format(interestSaved) },
        { label: "Months saved", value: monthsSaved.toLocaleString("en-IN") }
      ],
      chartValues: [
        { label: "Interest without extra payments", value: baseline.interest },
        { label: "Interest with extra payments", value: adjusted.interest },
        { label: "Interest saved", value: interestSaved }
      ]
    };
  }

  if (calculator.category === "Loans" || path.includes("business-loan-emi")) {
    const monthly = monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
    const total = monthly * months;
    return { total, headline: monthly, interest: Math.max(0, total - principal), invested: principal, monthly, label: "Estimated monthly EMI" };
  }

  if (path.includes("simple-interest")) {
    const interest = principal * annualRate * years;
    return { total: principal + interest, headline: principal + interest, interest, invested: principal, monthly: 0, label: "Total amount" };
  }

  if (path.includes("cagr") || path.includes("mutual-fund") || path.includes("xirr") || path.includes("stock-returns")) {
    const endValue = Math.max(0, values.rate ?? 0);
    const invested = principal;
    const gain = endValue - invested;
    const annualized = invested > 0 ? (Math.pow(endValue / invested, 1 / years) - 1) * 100 : 0;
    const isAnnualised = path.includes("cagr") || path.includes("xirr");
    const isAbsoluteReturn = path.includes("mutual-fund") || path.includes("stock-returns");
    const absoluteReturn = invested > 0 ? (gain / invested) * 100 : 0;
    return {
      total: endValue,
      headline: isAnnualised ? annualized : isAbsoluteReturn ? absoluteReturn : endValue,
      interest: gain,
      invested,
      monthly: annualized,
      label: isAnnualised ? "Annualised return" : isAbsoluteReturn ? "Absolute return" : "Current value",
      unit: isAnnualised || isAbsoluteReturn ? "percent" : undefined,
      metrics: [
        { label: "Amount invested", value: currency.format(invested) },
        { label: "Current value", value: currency.format(endValue) },
        { label: "Gain / loss", value: currency.format(gain) }
      ],
      chartValues: [
        { label: "Amount invested", value: invested },
        { label: "Current value", value: endValue },
        { label: "Gain / loss", value: gain }
      ]
    };
  }

  if (path.includes("inflation")) {
    const futureCost = principal * (1 + annualRate) ** years;
    return { total: futureCost, headline: futureCost, interest: futureCost - principal, invested: principal, monthly: 0, label: "Estimated future cost" };
  }

  if (path.includes("recurring-deposit") || path.includes("sip-calculator") || path.includes("epf-calculator") || path.includes("nps-calculator")) {
    const monthlyContribution = path.includes("epf-calculator") ? principal * 0.24 : principal;
    const totalInvested = monthlyContribution * months;
    const futureValue = monthlyRate === 0
      ? totalInvested
      : monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    return { total: futureValue, headline: futureValue, interest: futureValue - totalInvested, invested: totalInvested, monthly: monthlyContribution, label: "Estimated future value" };
  }

  if (path.includes("retirement")) {
    const monthlyExpenses = principal * (1 + annualRate) ** years;
    const total = monthlyExpenses * 12 * 20;
    return { total, headline: total, interest: Math.max(0, total - principal), invested: principal, monthly: total / 240, label: "Estimated retirement goal" };
  }

  if (path.includes("savings-goal")) {
    const monthly = annualRate === 0
      ? principal / months
      : principal * monthlyRate / (((1 + monthlyRate) ** months) - 1);
    return { total: principal, headline: monthly, interest: 0, invested: principal, monthly, label: "Monthly savings needed" };
  }

  if (path.includes("ppf")) {
    const total = annualRate === 0
      ? principal * years
      : principal * (((1 + annualRate) ** years - 1) / annualRate) * (1 + annualRate);
    return { total, headline: total, interest: total - principal * years, invested: principal * years, monthly: 0, label: "Estimated maturity value" };
  }

  const periods = path.includes("fixed-deposit") || path.includes("compound-interest") ? 4 : 1;
  const total = principal * (1 + annualRate / periods) ** (periods * years);
  return { total, headline: total, interest: total - principal, invested: principal, monthly: 0, label: "Estimated maturity value" };
}

export function CalculatorPage({ calculator }: { calculator: CalculatorDefinition }) {
  const initialValues = Object.fromEntries(calculator.inputs.map((input) => [input.key, input.initial]));
  const [values, setValues] = useState<Values>(initialValues);
  const [calculatedValues, setCalculatedValues] = useState<Values>(initialValues);
  const result = useMemo(() => calculate(calculator, calculatedValues), [calculator, calculatedValues]);
  const isRateResult = calculator.path.includes("cagr") || calculator.path.includes("xirr") || result.unit === "percent";
  const hasPendingChanges = calculator.inputs.some((input) => values[input.key] !== calculatedValues[input.key]);
  const headline = isRateResult
    ? `${result.headline.toFixed(2)}%`
    : result.unit === "units"
      ? result.headline.toLocaleString("en-IN")
      : currency.format(result.headline);
  const related = calculators.filter((item) => item.category === calculator.category && item.path !== calculator.path).slice(0, 3);
  const chartValues = result.chartValues ?? [
    { label: "Amount / principal", value: result.invested },
    { label: "Interest / gain", value: result.interest },
    { label: "Calculated result", value: result.total }
  ];
  const chartMaximum = Math.max(1, ...chartValues.map((item) => Math.abs(item.value)));
  const horizon = Math.max(1, Math.ceil(calculatedValues.years ?? 1));
  const schedule = Array.from({ length: Math.min(10, horizon) }, (_, index) => {
    const year = Math.ceil(horizon * (index + 1) / Math.min(10, horizon));
    const checkpoint = calculate(calculator, { ...calculatedValues, years: year });
    return { year, invested: checkpoint.invested, value: checkpoint.total };
  });
  const showSchedule = !result.metrics
    && calculator.category !== "Loans"
    && !calculator.path.includes("business-loan-emi")
    && !calculator.path.includes("savings-goal")
    && !calculator.path.includes("xirr");

  function updateValue(key: string, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function resetValues() {
    setValues(initialValues);
    setCalculatedValues(initialValues);
  }

  function submitCalculation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedValues = Object.fromEntries(calculator.inputs.map((input) => [
      input.key,
      Math.min(input.max, Math.max(input.min, values[input.key] ?? input.initial))
    ]));
    setValues(submittedValues);
    setCalculatedValues(submittedValues);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  return (
    <>
      <SiteHeader />
      <main>
        <section className="calculator-intro">
          <p className="breadcrumb"><Link href="/">Home</Link> / {calculator.category} / {calculator.title.replace(" Calculator", "")}</p>
          <span className="section-kicker">{calculator.eyebrow}</span>
          <h1>{calculator.title}</h1>
          <p className="intro-description">{calculator.description}</p>
          <p className="assurance"><Check size={13} /> Free, always <span>·</span> No sign-up <span>·</span> Transparent formulas</p>
        </section>

        {/* <section className="ad-strip calculator-ad" aria-label="Advertisement">
          <span>ADVERTISEMENT</span><strong>Google AdSense · Responsive display ad</strong>
        </section> */}

        <section className="calculator-workspace">
          <form className="input-card" onSubmit={submitCalculation}>
            <div className="input-card-heading"><h2>Let’s run your numbers</h2><p>Adjust the values, then calculate to update your results.</p></div>
            <div className="input-list">
              {calculator.inputs.map((input) => (
                <label className="number-input" key={input.key}>
                  <span className="input-label">{input.label}<Info aria-label={`${input.label} information`} size={13} /></span>
                  <span className="value-input">
                    {input.prefix && <span>{input.prefix}</span>}
                    <input
                      aria-label={input.label}
                      max={input.max}
                      min={input.min}
                      onChange={(event) => updateValue(input.key, Number(event.target.value))}
                      step={input.step}
                      type="number"
                      value={values[input.key] ?? input.initial}
                    />
                    {input.suffix && <span>{input.suffix}</span>}
                  </span>
                  <input
                    aria-label={`${input.label} slider`}
                    className="range-input"
                    max={input.max}
                    min={input.min}
                    onChange={(event) => updateValue(input.key, Number(event.target.value))}
                    step={input.step}
                    type="range"
                    value={Math.min(input.max, Math.max(input.min, values[input.key] ?? input.initial))}
                  />
                  <span className="range-limits"><span>{input.prefix}{input.min.toLocaleString("en-IN")}{input.suffix ? ` ${input.suffix}` : ""}</span><span>{input.prefix}{input.max.toLocaleString("en-IN")}{input.suffix ? ` ${input.suffix}` : ""}</span></span>
                </label>
              ))}
            </div>
            <div className="input-actions">
              <button className="button-primary" type="submit"><CalculatorIcon /> Calculate <ArrowRight size={15} /></button>
              <button aria-label="Reset inputs" className="button-secondary" onClick={resetValues} type="button"><RotateCcw size={15} /> Reset</button>
            </div>
            <p aria-live="polite" className="calculation-status">{hasPendingChanges ? "Inputs changed — calculate to refresh your result and graph." : "Results reflect the last calculation."}</p>
            <p className="privacy-note"><ShieldIcon /> Your numbers stay private. We don’t save your inputs.</p>
          </form>

          <div className="results-column" id="results">
            <section aria-live="polite" className="result-highlight">
              <span className="result-kicker">{result.label}</span>
              <strong>{headline}</strong>
              <div className="result-actions"><span>Estimated result</span><button aria-label="Share result" onClick={() => navigator.clipboard?.writeText(`${calculator.title}: ${headline}`)} type="button"><Share2 size={14} /> Share</button><button aria-label="Download result" onClick={() => window.print()} type="button"><Download size={14} /> Save</button></div>
            </section>
            <div className="result-stats">
              {result.metrics
                ? result.metrics.map((metric) => <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)
                : <>
                    <div><span>Invested amount</span><strong>{currency.format(result.invested)}</strong></div>
                    <div><span>Estimated interest</span><strong className="green-text">{currency.format(result.interest)}</strong></div>
                    <div><span>{calculator.category === "Loans" ? "Loan period" : "Time period"}</span><strong>{calculatedValues.years ?? "—"} {calculatedValues.years ? "years" : ""}</strong></div>
                  </>}
            </div>
            <section aria-label="Calculated results graph" className="chart-card">
              <div className="card-heading"><h2>Calculated breakdown</h2><span className="chart-tag">UPDATED ON CALCULATE</span></div>
              <div className="calculation-graph" role="img" aria-label={chartValues.map((item) => `${item.label}: ${item.display ?? currency.format(item.value)}`).join(", ")}>
                {chartValues.map((item) => (
                  <div className="graph-row" key={item.label}>
                    <div className="graph-row-heading"><span>{item.label}</span><strong>{item.display ?? currency.format(item.value)}</strong></div>
                    <div className="graph-track"><span style={{ width: `${Math.max(1, Math.abs(item.value) / chartMaximum * 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            </section>
            <p className="disclaimer"><Info size={14} /> This is an estimate based on the inputs above, not a guarantee of future returns or loan terms.</p>
          </div>
        </section>

        {!result.metrics && <section className="detail-section">
          <div className="section-heading detail-heading"><div><span className="section-kicker">SEE THE DIFFERENCE</span><h2>A small change. A different outcome.</h2><p>Use your estimate to compare the numbers that matter.</p></div></div>
          <div className="comparison-grid">
            <div className="comparison-card"><h3>Scenario comparison</h3><div><span>Invested amount</span><strong>{currency.format(result.invested)}</strong></div><div><span>Estimated growth</span><strong className="purple-text">{currency.format(result.interest)}</strong></div><div><span>Total at the end</span><strong className="purple-text">{currency.format(result.total)}</strong></div></div>
            <div className="tip-card"><Sparkles size={17} /><h3>Small changes add up</h3><p>Try adjusting your monthly contribution, rate or time period, then select Calculate to compare the updated estimate.</p><span><Check size={13} /> Results and graph use submitted inputs</span></div>
          </div>
        </section>}

        {showSchedule && <section className="detail-section table-section">
          <div className="section-heading detail-heading"><div><span className="section-kicker">YEAR BY YEAR</span><h2>Watch consistency add up.</h2><p>Calculated checkpoints based on your submitted inputs.</p></div></div>
          <div className="table-scroll"><table><thead><tr><th>Year</th><th>Invested</th><th>Estimated growth</th><th>Total value</th></tr></thead><tbody>{schedule.map((row) => <tr key={row.year}><td>Year {row.year}</td><td>{currency.format(row.invested)}</td><td>{currency.format(row.value - row.invested)}</td><td>{currency.format(row.value)}</td></tr>)}</tbody></table></div>
        </section>}

        <section className="formula-section">
          <div className="detail-section">
            <div className="section-heading detail-heading"><div><span className="section-kicker">THE METHOD</span><h2>How the {calculator.title.toLowerCase()} works</h2><p>A transparent formula, with your own inputs.</p></div></div>
            <div className="formula-card"><div className="formula-equation">{calculator.formula}</div><div className="formula-notes"><p><strong>P</strong> is the principal or periodic contribution.</p><p><strong>r</strong> is the rate of return or interest per period.</p><p><strong>n</strong> is the number of periods in the selected time frame.</p></div></div>
            <div className="feature-cards"><div><strong>Easy to adjust</strong><p>Change an input to see a new estimate.</p></div><div><strong>Made for comparison</strong><p>Explore different scenarios side by side.</p></div><div><strong>Clear by design</strong><p>See the assumptions behind the result.</p></div></div>
          </div>
        </section>

        <section className="detail-section faq-section">
          <div className="section-heading detail-heading"><div><span className="section-kicker">GOOD TO KNOW</span><h2>{calculator.title}, your questions, answered.</h2></div></div>
          <div className="faq-list">{calculator.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<ChevronDown size={16} /></summary><p>{faq.answer}</p></details>)}</div>
        </section>

        <section className="related-section detail-section">
          <div className="section-heading detail-heading"><div><span className="section-kicker">EXPLORE MORE</span><h2>Your next useful calculation.</h2></div></div>
          <div className="related-grid">{related.map((item) => <Link className="related-card" href={item.path} key={item.path}><span>{item.category}</span><strong>{item.title}</strong><p>{item.shortDescription}</p><ArrowRight size={15} /></Link>)}</div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function CalculatorIcon() {
  return <img alt="" aria-hidden="true" height="15" src="/assets/calculator-action.svg" width="15" />;
}

function ShieldIcon() {
  return <Check aria-hidden="true" size={14} />;
}
