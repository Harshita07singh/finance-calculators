export type CalculatorCategory =
  | "Loans"
  | "Investments"
  | "Savings"
  | "Taxes"
  | "Personal Finance"
  | "Business Finance";

export type InputDefinition = {
  key: string;
  label: string;
  initial: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
};

export type CalculatorDefinition = {
  path: string;
  title: string;
  category: CalculatorCategory;
  shortDescription: string;
  eyebrow: string;
  description: string;
  cardDescription: string;
  inputs: InputDefinition[];
  formula: string;
  faqs: { question: string; answer: string }[];
};

export type DiscoveryItem = {
  label: string;
  path: string;
};

const commonFaqs = (subject: string) => [
  {
    question: `How does the ${subject} calculator work?`,
    answer:
      "Enter your details or adjust the sliders, then select Calculate to see an estimate based on those values."
  },
  {
    question: "Are these results guaranteed?",
    answer:
      "No. Results are estimates for planning and comparison only. Actual rates, returns and charges may differ depending on your provider and the terms of your product."
  },
  {
    question: "Is my information saved?",
    answer:
      "No account is needed. Your calculations run in your browser and are not submitted to a server."
  }
];

function calculator(
  path: string,
  title: string,
  category: CalculatorCategory,
  shortDescription: string,
  eyebrow: string,
  description: string,
  inputs: InputDefinition[],
  formula: string
): CalculatorDefinition {
  return {
    path,
    title,
    category,
    shortDescription,
    eyebrow,
    description,
    cardDescription: shortDescription,
    inputs,
    formula,
    faqs: commonFaqs(title.replace(" Calculator", "").toLowerCase())
  };
}

const homeLoanInputs: InputDefinition[] = [
  { key: "amount", label: "Loan amount", initial: 5000000, min: 100000, max: 20000000, step: 50000, prefix: "₹" },
  { key: "rate", label: "Interest rate", initial: 8.5, min: 1, max: 20, step: 0.1, suffix: "%" },
  { key: "years", label: "Loan tenure", initial: 20, min: 1, max: 30, step: 1, suffix: "years" }
];

const savingsInputs: InputDefinition[] = [
  { key: "amount", label: "Investment amount", initial: 500000, min: 10000, max: 5000000, step: 10000, prefix: "₹" },
  { key: "rate", label: "Expected return", initial: 7.1, min: 1, max: 15, step: 0.1, suffix: "%" },
  { key: "years", label: "Investment period", initial: 10, min: 1, max: 30, step: 1, suffix: "years" }
];

export const calculators: CalculatorDefinition[] = [
  calculator(
    "/loans/home-emi-calculator",
    "Home EMI Calculator",
    "Loans",
    "Plan your home loan with a clear monthly EMI estimate.",
    "A clearer view of your home loan.",
    "Find an estimated monthly payment, see how interest adds up and plan your home loan with more confidence.",
    homeLoanInputs,
    "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)"
  ),
  calculator(
    "/loans/personal-loan-emi-calculator",
    "Personal Loan EMI Calculator",
    "Loans",
    "See monthly payments and total interest before you borrow.",
    "Borrow with a clearer picture.",
    "Estimate your personal loan EMI and understand the total cost of borrowing before you choose a tenure.",
    [
      { key: "amount", label: "Loan amount", initial: 500000, min: 10000, max: 5000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Interest rate", initial: 12, min: 1, max: 36, step: 0.1, suffix: "%" },
      { key: "years", label: "Loan tenure", initial: 3, min: 1, max: 7, step: 1, suffix: "years" }
    ],
    "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)"
  ),
  calculator(
    "/loans/car-loan-emi-calculator",
    "Car Loan EMI Calculator",
    "Loans",
    "Estimate your car loan payment and total interest.",
    "A smoother road to your next car.",
    "Compare monthly payments for different loan amounts, interest rates and repayment periods.",
    [
      { key: "amount", label: "Loan amount", initial: 1000000, min: 50000, max: 5000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Interest rate", initial: 9, min: 1, max: 24, step: 0.1, suffix: "%" },
      { key: "years", label: "Loan tenure", initial: 5, min: 1, max: 10, step: 1, suffix: "years" }
    ],
    "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)"
  ),
  calculator(
    "/loans/education-loan-calculator",
    "Education Loan Calculator",
    "Loans",
    "Plan education loan repayments around your future.",
    "Invest in what comes next.",
    "Estimate repayments for an education loan and explore how the loan amount, rate and tenure affect your monthly budget.",
    [
      { key: "amount", label: "Loan amount", initial: 2000000, min: 100000, max: 10000000, step: 50000, prefix: "₹" },
      { key: "rate", label: "Interest rate", initial: 10, min: 1, max: 24, step: 0.1, suffix: "%" },
      { key: "years", label: "Repayment tenure", initial: 10, min: 1, max: 20, step: 1, suffix: "years" }
    ],
    "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)"
  ),
  calculator(
    "/loans/loan-eligibility-calculator",
    "Loan Eligibility Calculator",
    "Loans",
    "Get a starting estimate of the loan amount you may afford.",
    "Know your numbers before you apply.",
    "Estimate an affordable loan amount based on income, existing EMIs and the monthly payment you can manage.",
    [
      { key: "amount", label: "Monthly income", initial: 100000, min: 10000, max: 1000000, step: 5000, prefix: "₹" },
      { key: "existingEmi", label: "Existing monthly EMIs", initial: 10000, min: 0, max: 500000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Interest rate", initial: 8.5, min: 1, max: 24, step: 0.1, suffix: "%" },
      { key: "years", label: "Loan tenure", initial: 20, min: 1, max: 30, step: 1, suffix: "years" }
    ],
    "Eligible loan = Affordable monthly EMI × repayment factor"
  ),
  calculator(
    "/loans/loan-prepayment-calculator",
    "Loan Prepayment Calculator",
    "Loans",
    "See how extra repayments may reduce interest and tenure.",
    "Small extra payments can make a difference.",
    "Compare your current repayment plan with one that includes an extra monthly or one-time prepayment.",
    [
      { key: "amount", label: "Outstanding loan", initial: 3000000, min: 100000, max: 20000000, step: 50000, prefix: "₹" },
      { key: "rate", label: "Interest rate", initial: 8.5, min: 1, max: 24, step: 0.1, suffix: "%" },
      { key: "years", label: "Remaining tenure", initial: 15, min: 1, max: 30, step: 1, suffix: "years" },
      { key: "extra", label: "Extra monthly payment", initial: 5000, min: 0, max: 100000, step: 1000, prefix: "₹" }
    ],
    "Interest saved = Scheduled interest − interest after prepayment"
  ),
  calculator(
    "/loans/mortgage-calculator",
    "Mortgage Calculator",
    "Loans",
    "Estimate monthly mortgage payments and overall cost.",
    "Make room for a plan that fits.",
    "Explore the estimated monthly cost of a mortgage and how repayment choices change the total amount paid.",
    homeLoanInputs,
    "Monthly payment = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)"
  ),
  calculator(
    "/investments/sip-calculator",
    "SIP Calculator",
    "Investments",
    "See how regular monthly investments could grow over time.",
    "Small steps. Long-term possibilities.",
    "See what a regular monthly investment could grow into. Explore your SIP journey, separate contributions from estimated gains and build a plan around your goals.",
    [
      { key: "amount", label: "Monthly investment", initial: 10000, min: 500, max: 200000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected return", initial: 12, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Investment period", initial: 15, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "FV = P × [((1 + i)ⁿ − 1) / i] × (1 + i)"
  ),
  calculator(
    "/investments/lumpsum-calculator",
    "Lumpsum Calculator",
    "Investments",
    "Estimate the future value of a one-time investment.",
    "One investment. A view of what’s ahead.",
    "Explore how a one-time investment may grow over time with an estimated annual return.",
    savingsInputs,
    "Future value = P × (1 + r)ⁿ"
  ),
  calculator(
    "/investments/mutual-fund-returns-calculator",
    "Mutual Fund Returns Calculator",
    "Investments",
    "Understand absolute and annualised investment returns.",
    "Put your returns in perspective.",
    "Compare your investment amount with its current value to see estimated absolute returns and annualised growth.",
    [
      { key: "amount", label: "Amount invested", initial: 200000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Current value", initial: 300000, min: 1000, max: 20000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Investment period", initial: 5, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Absolute return = (Current value − invested amount) / invested amount"
  ),
  calculator(
    "/investments/cagr-calculator",
    "CAGR Calculator",
    "Investments",
    "Find the annualised growth rate between two values.",
    "Make growth easier to compare.",
    "Calculate the compound annual growth rate of an investment over a chosen period.",
    [
      { key: "amount", label: "Beginning value", initial: 100000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Ending value", initial: 200000, min: 1000, max: 20000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Time period", initial: 5, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "CAGR = (Ending value / Beginning value)^(1 / n) − 1"
  ),
  calculator(
    "/investments/compound-interest-calculator",
    "Compound Interest Calculator",
    "Investments",
    "Explore how compounding can change your investment value.",
    "Let your returns build on themselves.",
    "Estimate the future value of your principal with compound interest and compare different compounding periods.",
    [
      { key: "amount", label: "Principal amount", initial: 100000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Annual interest rate", initial: 8, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time period", initial: 10, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "A = P × (1 + r / n)ⁿᵗ"
  ),
  calculator(
    "/investments/simple-interest-calculator",
    "Simple Interest Calculator",
    "Investments",
    "Calculate simple interest and the total amount payable.",
    "A straightforward view of your interest.",
    "Estimate the interest earned on a principal amount when interest is calculated without compounding.",
    [
      { key: "amount", label: "Principal amount", initial: 100000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Annual interest rate", initial: 8, min: 1, max: 30, step: 0.1, suffix: "%" },
      { key: "years", label: "Time period", initial: 5, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Simple interest = P × r × t"
  ),
  calculator(
    "/investments/xirr-calculator",
    "XIRR Calculator",
    "Investments",
    "Estimate annualised returns for dated cash flows.",
    "A clearer view of irregular investments.",
    "Estimate the annualised return for cash flows that happen on different dates.",
    [
      { key: "amount", label: "Total invested", initial: 250000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Current value", initial: 350000, min: 1000, max: 20000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Investment period", initial: 5, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "XIRR = (Ending value / Beginning value)^(1 / time) − 1"
  ),
  calculator(
    "/investments/stock-returns-calculator",
    "Stock Returns Calculator",
    "Investments",
    "Review stock profit and annualised returns.",
    "See the full picture of a stock investment.",
    "Compare your purchase price with its current value and see the estimated gain.",
    [
      { key: "amount", label: "Amount invested", initial: 100000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Current value", initial: 125000, min: 1000, max: 20000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Holding period", initial: 3, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Total return = (Current value + dividends − amount invested) / amount invested"
  ),
  calculator(
    "/investments/inflation-calculator",
    "Inflation Calculator",
    "Investments",
    "Estimate future costs and purchasing power over time.",
    "Plan for the cost of tomorrow.",
    "See how inflation may affect a future expense and the purchasing power of your money.",
    [
      { key: "amount", label: "Current cost", initial: 100000, min: 1000, max: 10000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Inflation rate", initial: 6, min: 0, max: 20, step: 0.1, suffix: "%" },
      { key: "years", label: "Time period", initial: 10, min: 1, max: 50, step: 1, suffix: "years" }
    ],
    "Future cost = Current cost × (1 + inflation rate)ⁿ"
  ),
  calculator(
    "/savings/fixed-deposit-calculator",
    "FD Calculator",
    "Savings",
    "Estimate fixed deposit maturity and interest earned.",
    "Give your deposit a clearer timeline.",
    "Estimate your fixed deposit maturity amount and interest with a clear view of your investment period.",
    savingsInputs,
    "A = P × (1 + r / n)ⁿᵗ"
  ),
  calculator(
    "/savings/recurring-deposit-calculator",
    "RD Calculator",
    "Savings",
    "See the maturity value of regular recurring deposits.",
    "Small deposits, a clearer destination.",
    "Estimate the maturity value of regular monthly deposits and compare your contributions with interest earned.",
    [
      { key: "amount", label: "Monthly deposit", initial: 5000, min: 500, max: 200000, step: 500, prefix: "₹" },
      { key: "rate", label: "Annual interest rate", initial: 6.5, min: 1, max: 15, step: 0.1, suffix: "%" },
      { key: "years", label: "Deposit period", initial: 5, min: 1, max: 20, step: 1, suffix: "years" }
    ],
    "Maturity value = P × n + interest on regular monthly deposits"
  ),
  calculator(
    "/savings/ppf-calculator",
    "PPF Calculator",
    "Savings",
    "Project Public Provident Fund growth over the long term.",
    "Build long-term habits, one year at a time.",
    "Explore how yearly contributions and the current interest rate may grow in a Public Provident Fund account.",
    [
      { key: "amount", label: "Yearly investment", initial: 150000, min: 500, max: 150000, step: 500, prefix: "₹" },
      { key: "rate", label: "Interest rate", initial: 7.1, min: 1, max: 15, step: 0.1, suffix: "%" },
      { key: "years", label: "Investment period", initial: 15, min: 15, max: 50, step: 1, suffix: "years" }
    ],
    "A = P × (((1 + r)ⁿ − 1) / r) × (1 + r)"
  ),
  calculator(
    "/savings/epf-calculator",
    "EPF Calculator",
    "Savings",
    "Estimate employee provident fund balance at retirement.",
    "Make your future balance easier to picture.",
    "Estimate your EPF balance using your salary, contributions, interest rate and years to retirement.",
    [
      { key: "amount", label: "Monthly basic salary", initial: 30000, min: 5000, max: 500000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Annual interest rate", initial: 8.25, min: 1, max: 15, step: 0.05, suffix: "%" },
      { key: "years", label: "Years to retirement", initial: 20, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Balance = Current corpus + future monthly contributions with interest"
  ),
  calculator(
    "/savings/nps-calculator",
    "NPS Calculator",
    "Savings",
    "Estimate retirement corpus and pension from NPS contributions.",
    "Build your retirement outlook.",
    "Explore an estimated National Pension System corpus based on regular contributions and long-term growth.",
    [
      { key: "amount", label: "Monthly contribution", initial: 10000, min: 500, max: 200000, step: 500, prefix: "₹" },
      { key: "rate", label: "Expected return", initial: 10, min: 1, max: 20, step: 0.1, suffix: "%" },
      { key: "years", label: "Investment period", initial: 25, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Retirement corpus = Monthly contributions compounded over the investment period"
  ),
  calculator(
    "/savings/retirement-calculator",
    "Retirement Calculator",
    "Savings",
    "Estimate the savings you may need for retirement.",
    "Make room for the life you’re building.",
    "Estimate a retirement goal using your current expenses, inflation and expected years in retirement.",
    [
      { key: "amount", label: "Current monthly expenses", initial: 50000, min: 10000, max: 500000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Expected inflation", initial: 6, min: 0, max: 20, step: 0.1, suffix: "%" },
      { key: "years", label: "Years to retirement", initial: 20, min: 1, max: 50, step: 1, suffix: "years" }
    ],
    "Retirement corpus = Annual retirement expenses × retirement years"
  ),
  calculator(
    "/savings/savings-goal-calculator",
    "Savings Goal Calculator",
    "Savings",
    "Find a monthly savings plan for a future goal.",
    "Give your next goal a starting number.",
    "Estimate how much to save regularly to reach a future goal in your chosen time frame.",
    [
      { key: "amount", label: "Savings goal", initial: 1000000, min: 10000, max: 50000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Expected return", initial: 8, min: 0, max: 20, step: 0.1, suffix: "%" },
      { key: "years", label: "Time to goal", initial: 10, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Monthly savings = Goal value / future value factor"
  ),
  calculator(
    "/taxes/income-tax-calculator",
    "Income Tax Calculator",
    "Taxes",
    "Compare estimated tax under the old and new tax regimes.",
    "Compare your estimated tax.",
    "Estimate income tax under the FY 2025–26 old and new regimes. This simplified estimate excludes surcharge and marginal relief.",
    [
      { key: "amount", label: "Annual salary income", initial: 1200000, min: 0, max: 100000000, step: 10000, prefix: "₹" },
      { key: "deductions", label: "Eligible old-regime deductions", initial: 150000, min: 0, max: 10000000, step: 10000, prefix: "₹" }
    ],
    "Tax = progressive slab tax − eligible rebate + 4% health and education cess"
  ),
  calculator(
    "/taxes/hra-exemption-calculator",
    "HRA Exemption Calculator",
    "Taxes",
    "Estimate the house rent allowance exemption available.",
    "Understand your HRA exemption.",
    "Estimate HRA exemption using annual basic salary, HRA received and rent paid. The calculation assumes a metro city.",
    [
      { key: "amount", label: "Annual basic salary", initial: 600000, min: 0, max: 10000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Annual HRA received", initial: 240000, min: 0, max: 5000000, step: 10000, prefix: "₹" },
      { key: "years", label: "Annual rent paid", initial: 240000, min: 0, max: 5000000, step: 10000, prefix: "₹" }
    ],
    "Exemption = minimum of HRA received, rent − 10% of basic, and 50% of basic"
  ),
  calculator(
    "/taxes/gst-calculator",
    "GST Calculator",
    "Taxes",
    "Calculate GST and the total price including tax.",
    "Know the tax in your total.",
    "Enter a taxable amount and GST rate to estimate the tax amount and price including GST.",
    [
      { key: "amount", label: "Taxable amount", initial: 10000, min: 0, max: 100000000, step: 100, prefix: "₹" },
      { key: "rate", label: "GST rate", initial: 18, min: 0, max: 40, step: 0.1, suffix: "%" }
    ],
    "GST = Taxable amount × GST rate; total = taxable amount + GST"
  ),
  calculator(
    "/taxes/capital-gains-calculator",
    "Capital Gains Calculator",
    "Taxes",
    "Estimate a gain and tax using your chosen tax rate.",
    "See the gain behind a sale.",
    "Estimate capital gain tax using your purchase price, sale value and an assumed tax rate. Actual rates depend on the asset and holding period.",
    [
      { key: "amount", label: "Purchase price", initial: 500000, min: 0, max: 100000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Sale value", initial: 750000, min: 0, max: 100000000, step: 1000, prefix: "₹" },
      { key: "taxRate", label: "Assumed tax rate", initial: 12.5, min: 0, max: 40, step: 0.1, suffix: "%" },
      { key: "years", label: "Holding period", initial: 2, min: 1, max: 40, step: 1, suffix: "years" }
    ],
    "Capital gain = sale value − purchase price; estimated tax = positive gain × assumed tax rate"
  ),
  calculator(
    "/taxes/tds-calculator",
    "TDS Calculator",
    "Taxes",
    "Estimate tax deducted at source and the net payment.",
    "Estimate the deduction before payment.",
    "Calculate an indicative tax deducted at source amount from a payment and an assumed TDS rate.",
    [
      { key: "amount", label: "Payment amount", initial: 100000, min: 0, max: 100000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "TDS rate", initial: 10, min: 0, max: 50, step: 0.1, suffix: "%" }
    ],
    "TDS = payment amount × TDS rate; net payment = payment amount − TDS"
  ),
  calculator(
    "/personal-finance/budget-planner",
    "Budget Planner",
    "Personal Finance",
    "Compare monthly income, expenses and your savings target.",
    "Give your monthly money a plan.",
    "Compare take-home income with planned monthly spending and savings to see what remains in your budget.",
    [
      { key: "amount", label: "Monthly take-home income", initial: 100000, min: 0, max: 5000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Monthly expenses", initial: 65000, min: 0, max: 5000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Monthly savings target", initial: 20000, min: 0, max: 5000000, step: 1000, prefix: "₹" }
    ],
    "Available after plan = monthly income − expenses − savings target"
  ),
  calculator(
    "/personal-finance/net-worth-calculator",
    "Net Worth Calculator",
    "Personal Finance",
    "See the difference between your assets and liabilities.",
    "See your financial snapshot.",
    "Estimate your net worth by subtracting liabilities from the value of your assets.",
    [
      { key: "amount", label: "Total assets", initial: 2500000, min: 0, max: 1000000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Total liabilities", initial: 500000, min: 0, max: 1000000000, step: 10000, prefix: "₹" }
    ],
    "Net worth = total assets − total liabilities"
  ),
  calculator(
    "/personal-finance/emergency-fund-calculator",
    "Emergency Fund Calculator",
    "Personal Finance",
    "Estimate an emergency fund target and any remaining gap.",
    "Build a buffer for the unexpected.",
    "Set a monthly essential-expense amount and a target number of months to estimate your emergency fund goal.",
    [
      { key: "amount", label: "Monthly essential expenses", initial: 50000, min: 0, max: 1000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Current emergency savings", initial: 100000, min: 0, max: 50000000, step: 1000, prefix: "₹" },
      { key: "years", label: "Months of expenses to cover", initial: 6, min: 1, max: 24, step: 1, suffix: "months" }
    ],
    "Fund target = monthly essential expenses × months covered"
  ),
  calculator(
    "/business-finance/profit-margin-calculator",
    "Profit Margin Calculator",
    "Business Finance",
    "Calculate profit and profit margin from sales and costs.",
    "Make your margins easier to read.",
    "Enter revenue and costs to estimate profit and profit margin.",
    [
      { key: "amount", label: "Revenue", initial: 1000000, min: 0, max: 1000000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Total costs", initial: 700000, min: 0, max: 1000000000, step: 10000, prefix: "₹" }
    ],
    "Profit margin = (revenue − costs) ÷ revenue × 100"
  ),
  calculator(
    "/business-finance/break-even-calculator",
    "Break-even Point Calculator",
    "Business Finance",
    "Estimate the units and revenue needed to break even.",
    "Find the point where costs are covered.",
    "Estimate how many units you need to sell for revenue to cover fixed and variable costs.",
    [
      { key: "amount", label: "Fixed costs", initial: 250000, min: 0, max: 1000000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Selling price per unit", initial: 1000, min: 0, max: 10000000, step: 10, prefix: "₹" },
      { key: "years", label: "Variable cost per unit", initial: 600, min: 0, max: 10000000, step: 10, prefix: "₹" }
    ],
    "Break-even units = fixed costs ÷ (selling price per unit − variable cost per unit)"
  ),
  calculator(
    "/business-finance/working-capital-calculator",
    "Working Capital Calculator",
    "Business Finance",
    "Estimate working capital from current assets and liabilities.",
    "Check the room in your operations.",
    "Estimate your net working capital by comparing current assets with current liabilities.",
    [
      { key: "amount", label: "Current assets", initial: 1000000, min: 0, max: 1000000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Current liabilities", initial: 650000, min: 0, max: 1000000000, step: 10000, prefix: "₹" }
    ],
    "Net working capital = current assets − current liabilities"
  ),
  calculator(
    "/business-finance/business-loan-emi-calculator",
    "Business Loan EMI Calculator",
    "Business Finance",
    "Estimate monthly repayments for a business loan.",
    "Plan a clearer path to business funding.",
    "Estimate the monthly EMI and total interest for a business loan based on its amount, rate and tenure.",
    [
      { key: "amount", label: "Loan amount", initial: 2500000, min: 100000, max: 50000000, step: 10000, prefix: "₹" },
      { key: "rate", label: "Annual interest rate", initial: 12, min: 1, max: 36, step: 0.1, suffix: "%" },
      { key: "years", label: "Loan tenure", initial: 5, min: 1, max: 20, step: 1, suffix: "years" }
    ],
    "EMI = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)"
  ),
  calculator(
    "/business-finance/invoice-discounting-calculator",
    "Invoice Discounting Calculator",
    "Business Finance",
    "Estimate the discount fee and proceeds from an invoice.",
    "Unlock a clearer view of invoice proceeds.",
    "Estimate the discount fee and net proceeds using an invoice value, annual discount rate and days until payment.",
    [
      { key: "amount", label: "Invoice amount", initial: 500000, min: 1000, max: 100000000, step: 1000, prefix: "₹" },
      { key: "rate", label: "Annual discount rate", initial: 12, min: 0, max: 50, step: 0.1, suffix: "%" },
      { key: "years", label: "Days until payment", initial: 60, min: 1, max: 365, step: 1, suffix: "days" }
    ],
    "Discount fee = invoice amount × annual discount rate × days ÷ 365"
  )
];

export const categories: {
  name: CalculatorCategory;
  description: string;
  calculators: CalculatorDefinition[];
  discoveryItems: DiscoveryItem[];
  exploreLabel: string;
}[] = [
  {
    name: "Loans",
    description: "Borrow with a plan, not a guess.",
    calculators: calculators.filter((item) => item.category === "Loans"),
    discoveryItems: [
      { label: "Home EMI", path: "/loans/home-emi-calculator" },
      { label: "Personal Loan EMI", path: "/loans/personal-loan-emi-calculator" },
      { label: "Car Loan EMI", path: "/loans/car-loan-emi-calculator" },
      { label: "Education Loan", path: "/loans/education-loan-calculator" },
      { label: "Loan Eligibility", path: "/loans/loan-eligibility-calculator" },
      { label: "Prepayment", path: "/loans/loan-prepayment-calculator" },
      { label: "Mortgage", path: "/loans/mortgage-calculator" }
    ],
    exploreLabel: "7 loan calculators"
  },
  {
    name: "Investments",
    description: "Turn long-term goals into numbers.",
    calculators: calculators.filter((item) => item.category === "Investments"),
    discoveryItems: [
      { label: "SIP Calculator", path: "/investments/sip-calculator" },
      { label: "Lumpsum Calculator", path: "/investments/lumpsum-calculator" },
      { label: "Mutual Fund Returns", path: "/investments/mutual-fund-returns-calculator" },
      { label: "CAGR Calculator", path: "/investments/cagr-calculator" },
      { label: "Stock Average", path: "/investments/stock-returns-calculator" }
    ],
    exploreLabel: "Explore investment tools"
  },
  {
    name: "Savings",
    description: "Make room for your next milestone.",
    calculators: calculators.filter((item) => item.category === "Savings"),
    discoveryItems: [
      { label: "Fixed Deposit", path: "/savings/fixed-deposit-calculator" },
      { label: "Recurring Deposit", path: "/savings/recurring-deposit-calculator" },
      { label: "PPF Calculator", path: "/savings/ppf-calculator" },
      { label: "EPF Calculator", path: "/savings/epf-calculator" },
      { label: "Savings Goal", path: "/savings/savings-goal-calculator" }
    ],
    exploreLabel: "Explore savings tools"
  },
  {
    name: "Taxes",
    description: "A clearer view of what you owe.",
    calculators: calculators.filter((item) => item.category === "Taxes"),
    discoveryItems: [
      { label: "Income Tax", path: "/taxes/income-tax-calculator" },
      { label: "HRA Exemption", path: "/taxes/hra-exemption-calculator" },
      { label: "GST Calculator", path: "/taxes/gst-calculator" },
      { label: "Capital Gains", path: "/taxes/capital-gains-calculator" },
      { label: "TDS Calculator", path: "/taxes/tds-calculator" }
    ],
    exploreLabel: "Explore tax tools"
  },
  {
    name: "Personal Finance",
    description: "Put everyday money in perspective.",
    calculators: calculators.filter((item) => item.category === "Personal Finance"),
    discoveryItems: [
      { label: "Budget Planner", path: "/personal-finance/budget-planner" },
      { label: "Net Worth", path: "/personal-finance/net-worth-calculator" },
      { label: "Emergency Fund", path: "/personal-finance/emergency-fund-calculator" },
      { label: "Inflation Calculator", path: "/investments/inflation-calculator" },
      { label: "Retirement Planner", path: "/savings/retirement-calculator" }
    ],
    exploreLabel: "Explore planning tools"
  },
  {
    name: "Business Finance",
    description: "Better numbers for your business.",
    calculators: calculators.filter((item) => item.category === "Business Finance"),
    discoveryItems: [
      { label: "Profit Margin", path: "/business-finance/profit-margin-calculator" },
      { label: "Break-even Point", path: "/business-finance/break-even-calculator" },
      { label: "Working Capital", path: "/business-finance/working-capital-calculator" },
      { label: "Business Loan EMI", path: "/business-finance/business-loan-emi-calculator" },
      { label: "Invoice Discounting", path: "/business-finance/invoice-discounting-calculator" }
    ],
    exploreLabel: "Explore business tools"
  }
];
