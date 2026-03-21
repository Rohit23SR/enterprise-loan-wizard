# Enterprise Loan Wizard

A multi-step loan application wizard built with Angular 20 for the Australian market. Walks users through 5 steps — personal info, business details, financials, document upload, and review — with auto-save, real-time validation, and PDF receipt generation.

## Live Demo

[https://enterprise-loan-wizard.vercel.app](https://enterprise-loan-wizard.vercel.app)

## What it does

Five-step wizard for enterprise loan applications:

1. **Personal Info** — Name, email, phone, DOB (18+ check), TFN (9-digit masked), Australian address
2. **Business Info** — Business name, type, ABN (11-digit masked), industry, revenue, employees, optional separate address
3. **Financial Details** — Loan amount (min $1,000), purpose, term, monthly revenue/expenses, credit score, optional collateral
4. **Document Upload** — Government ID (1+), business registration (1+), bank statements (3+), tax returns (2+)
5. **Review & Submit** — Read-only summary with masked sensitive data, three consent checkboxes, PDF receipt on submit

Auto-saves every 30 seconds to localStorage with 7-day expiration. Files can't be persisted across refreshes.

## Tech Stack

| What | How |
|------|-----|
| Framework | Angular 20 (Standalone Components) |
| Language | TypeScript 5.8 (strict mode) |
| State | Angular Signals + RxJS BehaviorSubject + localStorage |
| Forms | Angular Reactive Forms |
| Masking | ngx-mask (TFN, ABN, phone, postcode) |
| PDF | jsPDF |
| Styling | SCSS with CSS Variables (no frameworks) |
| Testing | Jest 30 + jest-preset-angular |
| Deployment | Vercel |

## Getting Started

```bash
git clone <repo-url>
cd enterprise-loan-wizard
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Scripts

```bash
npm start              # dev server (ng serve)
npm run build          # production build
npm test               # run all tests
npm run test:watch     # watch mode
npm run test:coverage  # coverage report

npm run lint           # eslint check
npm run lint:fix       # eslint auto-fix
npm run format         # prettier format
npm run format:check   # check formatting
```

## Project Structure

```
src/app/
├── components/
│   ├── wizard/              main orchestrator (container component)
│   ├── progress-stepper/    visual step indicator
│   ├── navigation-footer/   back/next/submit buttons
│   ├── success-screen/      post-submission + PDF generation
│   └── steps/
│       ├── personal-info/   step 1: personal details, TFN, address
│       ├── business-info/   step 2: business details, ABN, revenue
│       ├── financial-details/ step 3: loan amount, collateral
│       ├── document-upload/ step 4: file uploads with min counts
│       └── review-submit/   step 5: review all, consent checkboxes
├── services/
│   └── wizard-state.ts      centralized state (signals + rxjs + localStorage)
├── constants/
│   ├── australian-data.ts   shared AU states, country data
│   └── wizard-config.ts     timing, storage keys, min file counts, PDF colors
├── utils/
│   └── formatting.ts        currency (AUD), date, TFN/ABN masking
├── app.routes.ts             2 routes (/, /success)
└── app.config.ts
```

## Testing

332 tests across 10 spec files. Covers the state service, all step components, navigation footer, and success screen.

```bash
npm test               # run all 332 tests
npm run test:coverage  # generate coverage report
```

What's tested:
- **Wizard state** — initialization, form updates, navigation, localStorage persistence, auto-save, validation, submission (128 tests)
- **Step components** — form rendering, field validation, conditional logic (sameAsPersonal, hasCollateral), data binding
- **Document upload** — file add/remove, min count validation, file size formatting
- **Review & submit** — checkbox validation, data masking, formatting methods
- **Navigation footer** — button states, event emission, disabled states
- **Success screen** — PDF generation (mocked), localStorage loading, error handling, cleanup
- **Progress stepper** — step status, clickability, edge cases

## Australian Localization

- TFN: 9 digits, masked display (`*** *** 789`)
- ABN: 11 digits, masked display (`** *** *** 901`)
- Phone: 10 digits (`0412 345 678`)
- Postcode: 4 digits
- States: all 8 (NSW, VIC, QLD, WA, SA, TAS, ACT, NT)
- Currency: AUD (Intl.NumberFormat)
- Dates: Australian format

## Architecture

Container-presenter pattern with hybrid state management:
- **Signals** for reactive UI state (currentStep, progress, computed properties)
- **BehaviorSubject** for complex form data
- **localStorage** for persistence (30s auto-save, 7-day expiry)
- **takeUntil** pattern for subscription cleanup in all components
- No backend — submission simulated client-side, reference number generated locally

## Deployment

Deployed on Vercel with auto-deploy from git. Security headers configured in `vercel.json` (CSP, HSTS, X-Frame-Options, X-XSS-Protection).

## License

Private and proprietary.
