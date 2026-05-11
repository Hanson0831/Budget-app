# 💰 Budget App — CPT304 Research-Led Software Enhancement

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](https://budget-app-rho-one.vercel.app/)
[![Core Test Coverage](https://img.shields.io/badge/Core%20Test%20Coverage-86.57%25-brightgreen)](./coverage/lcov.info)
[![Accessibility](https://img.shields.io/badge/Lighthouse%20Accessibility-100%2F100-brightgreen)](#baseline-standards-evidence)
[![Coursework](https://img.shields.io/badge/CPT304-Coursework%201-blue)](#coursework-context)

## 📌 Project Overview

This repository contains the enhanced version of a front-end **Budget App** selected for **CPT304 Software Engineering 2 Coursework 1**. The original application was a small static web app for recording income and expense entries, calculating total income, total outcome, and balance, and storing records in the browser through `localStorage`.

The coursework goal was not to redesign the application from scratch, but to perform a **research-led software enhancement**. We audited the original source code, identified four concrete software deficiencies, and implemented targeted improvements in security, validation, persistence robustness, state management, maintainability, testing, accessibility, internationalisation, and privacy compliance.

🔗 **Live deployment:** https://budget-app-rho-one.vercel.app/

---

## 🧭 Coursework Context

This project was enhanced according to the CPT304 Coursework 1 requirements:

- Identify and fix **four source-code deficiencies**.
- Support each improvement with technical reasoning and literature in the report.
- Provide **before/after implementation evidence**.
- Deploy the final application to a public URL.
- Achieve **≥80% testing coverage**.
- Achieve **Lighthouse Accessibility ≥90**.
- Add **internationalisation support**.
- Add **cookie/local-storage notice and privacy policy**.
- Provide individual contribution evidence through GitHub commits and Pull Requests.

---

## 🚀 Live Application

The final version is deployed on Vercel:

```text
https://budget-app-rho-one.vercel.app/
```

The deployed app supports:

- Adding income records.
- Adding expense records.
- Editing and deleting records.
- Viewing income-only, expense-only, and all entries.
- Automatic balance calculation.
- Local persistence after user consent.
- English / Chinese language switching.
- Privacy policy access.
- Accessible form controls and semantic buttons.

---

## 🧩 Key Enhancements

### 1. 🛡️ Unsafe User Input Handling: Validation and XSS Prevention

**Original deficiency:**  
The original app only checked whether the title and amount fields were empty. It did not reject whitespace-only titles, overly long titles, non-finite numbers, zero values, or negative values. It also rendered user-controlled titles through HTML string insertion, which created a potential XSS risk.

**Implemented enhancement:**

- Added reusable validation logic for income and expense entries.
- Trimmed user-provided titles before saving.
- Rejected empty, whitespace-only, and overly long titles.
- Rejected `NaN`, `Infinity`, zero, and negative amounts.
- Added user-facing error messages instead of silent failure.
- Replaced unsafe HTML string rendering with `document.createElement()` and `textContent`.
- Ensured HTML-like input such as `<script>alert(1)</script>` is displayed as plain text rather than executable markup.

**Main files involved:**

```text
budget.js
budget-core.js
style.css
```

---

### 2. 💾 Unsafe localStorage Persistence Without Error Recovery

**Original deficiency:**  
The original app directly parsed stored data with `JSON.parse(localStorage.getItem(...))`. If the stored value was corrupted or malformed, the application could crash during initialization.

**Implemented enhancement:**

- Added safe storage loading and saving logic.
- Wrapped JSON parsing in recovery logic.
- Returned fallback data if localStorage was empty, malformed, or unavailable.
- Normalised stored entries before loading them into the app state.
- Filtered invalid entries rather than allowing malformed data to break the UI.
- Preserved app availability even when stored data is manually corrupted.

**Main files involved:**

```text
budget-core.js
budget.js
```

---

### 3. 🔗 State Management Coupled to DOM Indexes

**Original deficiency:**  
The original delete and edit logic used DOM element `id` values as array indexes. This tightly coupled the UI rendering order to the underlying data model and could become fragile if sorting, filtering, or future rendering changes were introduced.

**Implemented enhancement:**

- Added stable entry identifiers.
- Stored entry IDs inside the data model.
- Rendered list items using `data-entry-id` instead of relying on DOM index values.
- Refactored delete and edit logic to find records by stable ID.
- Added migration support for older stored entries that did not already contain IDs.
- Improved data/UI separation and future maintainability.

**Main files involved:**

```text
budget.js
budget-core.js
```

---

### 4. 🧱 Hardcoded Configuration and Scattered Constants

**Original deficiency:**  
The original code scattered values such as storage keys, action names, entry types, validation limits, selectors, and currency symbols directly across the implementation. This increased maintenance cost and made later extension harder.

**Implemented enhancement:**

- Introduced a central configuration structure.
- Consolidated storage keys, entry types, action names, selectors, validation limits, and currency display logic.
- Reduced repeated literal strings across the codebase.
- Improved readability, maintainability, and future extensibility.
- Supported later baseline features such as language switching and privacy notice integration.

**Main files involved:**

```text
budget.js
budget-core.js
```

---

## 🌍 Baseline Standards Evidence

The final version also addresses the required baseline standards.

### ✅ Deployment on Vercel

The app is publicly deployed and accessible at:

```text
https://budget-app-rho-one.vercel.app/
```

Deployment evidence and uptime screenshots are included separately in the repository/report evidence.

---

### ✅ Testing Coverage Above 80%

Automated tests were added for the extracted core logic layer, including validation, calculation, entry normalisation, localStorage recovery, and stable ID migration.

The project uses `c8` to generate an Istanbul-style LCOV coverage report.

Current coverage evidence:

```text
Core Test Coverage: 86.57%
Required Threshold: 80%
Status: Passed
```

Run locally:

```bash
npm install
npm test
npm run coverage
```

Coverage evidence is available in:

```text
coverage/lcov.info
```

> Note: The automated coverage focuses on the extracted core business logic in `budget-core.js`. Browser-level UI behaviour is verified separately through manual testing and Lighthouse accessibility checks.

---

### ✅ Lighthouse Accessibility 90+

The deployed website was audited using Lighthouse / PageSpeed Insights.

Current accessibility result:

```text
Accessibility Score: 100 / 100
Required Score: 90+
Status: Passed
```

Accessibility improvements include:

- Semantic buttons for interactive controls.
- Accessible labels for form inputs and action buttons.
- ARIA-aware tab navigation.
- Accessible description for the chart area.
- Clear text feedback for validation errors.
- Improved keyboard and screen-reader support.

---

### ✅ Internationalisation

The final app supports language switching between:

```text
English
Chinese
```

The language toggle improves usability for a wider user group and supports the coursework baseline requirement for internationalisation.

---

### ✅ Cookie / Local Storage Notice and Privacy Policy

The app includes a local-storage consent notice and a privacy policy page. Since the app stores income and expense records in the browser, the user is informed about local persistence behaviour.

The privacy implementation explains:

- What data is stored locally.
- Why localStorage is used.
- What happens if storage consent is declined.
- That the static app does not upload budget records to a remote server.

Privacy page:

```text
privacy.html
```

---

## 🧪 Testing

The test suite focuses on the extracted core logic to make the most important business rules independently testable.

Covered areas include:

- Valid income/expense entry validation.
- Empty and whitespace-only title rejection.
- Long title rejection.
- Invalid amount rejection.
- Positive amount acceptance.
- Total income/outcome calculation.
- Balance calculation.
- Corrupted localStorage recovery.
- Entry normalisation.
- Stable ID migration for old records.

Run tests:

```bash
npm test
```

Run coverage:

```bash
npm run coverage
```

---

## 🛠️ Technology Stack

```text
HTML5
CSS3
Vanilla JavaScript
localStorage
Node.js test runner
c8 coverage tool
Vercel deployment
Lighthouse / PageSpeed Insights
```

No heavy front-end framework was introduced, keeping the implementation close to the original app while improving its software engineering quality.

---

## 📁 Project Structure

```text
Budget App/
├── coverage/
│   └── lcov.info
├── font/
├── icon/
├── tests/
│   └── budget-core.test.js
├── budget-core.js
├── budget.js
├── chart.js
├── index.html
├── privacy.html
├── style.css
├── package.json
├── package-lock.json
├── README.md
├── LIGHTHOUSE.md
└── TESTING.md
```

---

## ▶️ How to Run Locally

Clone the repository and open the project folder:

```bash
npm install
npm test
npm run coverage
```

To view the app locally, open:

```text
index.html
```

or use a local static server if preferred.

---

## 🔍 Manual Test Checklist

Recommended final manual checks:

- Add valid income, such as `Salary`, `1000`.
- Add valid expense, such as `Food`, `20`.
- Reject empty title.
- Reject whitespace-only title.
- Reject negative amount.
- Reject zero amount.
- Reject non-numeric amount.
- Render `<script>alert(1)</script>` as plain text.
- Delete an entry after several entries have been added.
- Edit both income and expense entries.
- Refresh the page and confirm persistence after consent.
- Decline localStorage consent and confirm entries are not persisted after refresh.
- Switch between English and Chinese.
- Open the privacy policy page.
- Run Lighthouse and confirm Accessibility score remains above 90.

---

## 👥 Contribution and Pull Requests

This project was developed collaboratively. Each group member contributed through task-specific branches and Pull Requests. The coursework submission includes individual contribution evidence, including direct PR links, commit history, and task descriptions.

Suggested contribution mapping:

```text
PR 1: Validation and XSS prevention
PR 2: localStorage recovery and stable ID state management
PR 3: configuration refactor and core logic tests
PR 4: baseline compliance, accessibility, privacy, i18n, coverage, and deployment evidence
```

Detailed individual contribution evidence is provided in the coursework submission package.

---

## 📄 Coursework Evidence Summary

Evidence prepared for the final report includes:

- Before/after code snippets for four deficiencies.
- Vercel live deployment URL.
- Deployment stability screenshots.
- Core test coverage badge and coverage output.
- Lighthouse Accessibility result showing 100 / 100.
- i18n toggle screenshots.
- Cookie/local-storage notice screenshots.
- Privacy policy screenshot.
- Individual contribution form and PR links.

---

## ✅ Final Status

```text
Deployment: Completed
Core Test Coverage: 86.57% Passed
Accessibility: 100 / 100 Passed
Internationalisation: Completed
Cookie / Local Storage Notice: Completed
Privacy Policy: Completed
Four Deficiency Fixes: Completed
```

This final version demonstrates a focused software engineering improvement process: identifying concrete source-code deficiencies, applying targeted fixes, preserving the original app behaviour, and producing verifiable evidence for deployment, testing, accessibility, internationalisation, and privacy compliance.
