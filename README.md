# 💰 CPT304 Budget App Enhancement

[![Core Test Coverage](https://img.shields.io/badge/Core%20Test%20Coverage-86.57%25-brightgreen)](./coverage/lcov.info)
[![Accessibility](https://img.shields.io/badge/Lighthouse%20Accessibility-100-brightgreen)](https://budget-app-rho-one.vercel.app/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)](https://budget-app-rho-one.vercel.app/)
[![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JavaScript-blue)](#-technology-stack)

## 📋 Overview

This repository contains an enhanced front-end **Budget App** developed for **CPT304 Software Engineering 2 Coursework 1**. The application allows users to record income and expense entries, view financial summaries, switch between income, expense, and all-entry views, and persist budget data locally in the browser.

The coursework objective is not only to make the application functional, but to improve it through **research-led software enhancement**. The original project was audited to identify concrete source-code deficiencies, and the final version addresses issues related to secure input handling, local storage robustness, state management, maintainability, accessibility, internationalisation, testing coverage, and privacy transparency.

🌐 **Live Deployment**: https://budget-app-rho-one.vercel.app/

## ✨ Key Features

### 💵 Budget Tracking
- Add income records with a title and amount.
- Add expense records with a title and amount.
- View total income, total outcome, and current balance.
- Display newly added entries at the top of each list.
- Switch between **Expenses**, **Income**, and **All** views.

### 📊 Visual Summary
- Canvas-based budget chart showing the relationship between income and expenses.
- Automatic chart update when entries are added, edited, or deleted.
- Safe handling of empty-budget states to avoid invalid chart calculations.

### 💾 Local Persistence
- Budget entries are stored through browser `localStorage` after user consent.
- Stored entries are restored when the page is reopened.
- Corrupted or malformed local storage data is handled safely without crashing the app.

### 🌐 Internationalisation
- English and Chinese interface support.
- Language toggle for switching visible UI text.
- Centralised interface text for easier future extension.

### 🔐 Privacy & Consent
- Cookie/local storage consent banner.
- Users can accept or decline local storage persistence.
- Privacy policy page explaining what data is stored and how persistence works.
- If storage consent is declined, the app remains usable but entries are not persisted after refresh.

### ♿ Accessibility
- Semantic buttons for key interactions.
- Accessible labels for form inputs and action buttons.
- ARIA roles and selected states for tab-style navigation.
- Accessible description for the chart area.
- Lighthouse Accessibility score: **100**, exceeding the required 90+ threshold.

## 🧩 Coursework Deficiency Fixes

The project focuses on four source-code deficiencies identified during code review.

### 1. 🛡️ Unsafe User Input Handling: Weak Validation and XSS Risk

**Original issue**: The original application only checked whether income or expense fields were empty. It also rendered user-provided titles using HTML string insertion, which created a potential Cross-Site Scripting risk.

**Enhancement**:
- Added reusable entry validation logic.
- Rejected empty titles, whitespace-only titles, overly long titles, non-finite values, zero, and negative amounts.
- Replaced silent validation failure with user-facing error messages.
- Replaced unsafe HTML insertion with safe DOM creation and `textContent`.
- User input such as `<script>alert(1)</script>` is displayed as plain text rather than interpreted as executable HTML.

### 2. 💾 Unsafe LocalStorage Persistence Without Error Recovery

**Original issue**: The original code directly parsed localStorage data using `JSON.parse()`. If the stored value was corrupted, the page could fail during initialisation.

**Enhancement**:
- Added safe local storage loading and saving helpers.
- Wrapped parsing logic with error handling.
- Returned fallback data when storage was missing, invalid, or corrupted.
- Normalised stored entries before using them in the app state.
- Prevented corrupted browser data from breaking the application.

### 3. 🔗 State Management Coupled to DOM Indexes

**Original issue**: Delete and edit logic depended on DOM element IDs as array indexes. This tightly coupled the UI structure to the data model and made the logic fragile under future sorting, filtering, or rendering changes.

**Enhancement**:
- Added stable IDs to entry objects.
- Rendered list items using `data-entry-id` rather than array-index-based HTML IDs.
- Refactored delete logic to remove entries by stable ID.
- Refactored edit logic to locate entries by stable ID.
- Migrated older entries without IDs during storage normalisation.

### 4. 🧱 Hardcoded Configuration and Scattered Constants

**Original issue**: Important values such as storage keys, entry types, action names, selectors, currency symbols, and validation limits were scattered across the codebase.

**Enhancement**:
- Added a central configuration object.
- Grouped storage key, currency symbol, entry types, actions, selectors, and validation limits.
- Reduced repeated string literals.
- Improved maintainability and prepared the app for later extension, including internationalisation and testing.

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Persistence**: Browser `localStorage`
- **Testing**: Node.js test runner
- **Coverage**: c8 / Istanbul-style LCOV report
- **Deployment**: Vercel
- **Audit Tool**: Google Lighthouse / PageSpeed Insights

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- Modern web browser such as Chrome, Edge, or Firefox

### Installation

```bash
git clone <this-repository-url>
cd Budget-app
npm install
```

### Running the App Locally

The application is a static front-end app. It can be opened directly in a browser:

```bash
open index.html
```

On Windows, double-clicking `index.html` also opens the application in the default browser.

For the deployed version, visit:

```text
https://budget-app-rho-one.vercel.app/
```

## 🧪 Testing & Coverage

The project includes automated tests for the extracted core logic layer, including validation, calculation, storage recovery, and entry normalisation.

### Run Tests

```bash
npm test
```

### Run Coverage

```bash
npm run coverage
```

The final c8 / Istanbul-style core logic coverage result is:

```text
Line coverage: 86.57%
```

This exceeds the coursework requirement of **80%+ test coverage**.

> Note: Automated unit tests focus on the extracted `budget-core.js` logic. Browser-facing behaviours such as rendering, tab switching, consent interaction, language switching, and accessibility were verified through manual testing and Lighthouse/PageSpeed auditing.

## ♿ Accessibility Evidence

The deployed application was audited using Google PageSpeed Insights / Lighthouse. The final Accessibility score is:

```text
Accessibility: 100
```

This exceeds the required **90+ Lighthouse Accessibility score**.

Accessibility improvements include:
- Semantic interactive elements.
- Accessible labels for controls.
- Improved form labelling.
- ARIA-supported tab navigation.
- Accessible chart description.
- Keyboard-friendly interaction structure.

## 🌍 Deployment

The final application is deployed using Vercel:

```text
https://budget-app-rho-one.vercel.app/
```

The deployment provides a public production URL for coursework evaluation and supports the required live-site evidence. The project is designed as a static web application, so no backend server or database configuration is required.

## 📁 Project Structure

```text
Budget-app/
├── coverage/
│   └── lcov.info                 # c8 / Istanbul-style coverage data
├── font/                         # Local font assets
├── icon/                         # UI icons
├── tests/
│   └── budget-core.test.js       # Core logic tests
├── budget-core.js                # Extracted testable core logic
├── budget.js                     # Main UI interaction and app state logic
├── chart.js                      # Canvas chart rendering
├── index.html                    # Main application page
├── privacy.html                  # Privacy policy page
├── style.css                     # Application styling
├── package.json                  # npm scripts and project metadata
├── package-lock.json             # Locked npm dependency versions
├── README.md                     # Project documentation
├── LIGHTHOUSE.md                 # Accessibility audit notes/evidence summary
└── TESTING.md                    # Testing and coverage notes/evidence summary
```

## ✅ Manual Quality Checks

The following behaviours were checked manually as part of final verification:

- Adding valid income entries.
- Adding valid expense entries.
- Rejecting empty titles.
- Rejecting whitespace-only titles.
- Rejecting negative, zero, `NaN`, and infinite amounts.
- Displaying HTML-like user input as plain text.
- Editing income and expense entries.
- Deleting entries using stable IDs.
- Refreshing the page after accepting storage consent.
- Declining storage consent and confirming non-persistent behaviour.
- Switching between English and Chinese UI text.
- Accessing the privacy policy page.
- Running Lighthouse Accessibility audit on the deployed site.

## 🤝 Contribution Workflow

The project was organised using GitHub branches and Pull Requests. Each major enhancement was separated into a verifiable task area:

- Input validation and XSS prevention.
- LocalStorage recovery and stable state handling.
- Configuration refactoring and core logic extraction.
- Baseline compliance features, including i18n, privacy, accessibility, deployment, and testing evidence.

This workflow supports individual contribution verification through authored Pull Requests, task descriptions, and commit history.

## 📄 Academic Context

This repository is prepared for **CPT304 Software Engineering 2 Coursework 1**. The final implementation demonstrates research-led improvement of an existing web application through concrete source-code deficiency detection, targeted implementation, testing, deployment, accessibility auditing, and compliance-related enhancements.

## 🙏 Acknowledgements

- Original Budget App project basis.
- Node.js test runner.
- c8 coverage tooling.
- Google Lighthouse / PageSpeed Insights.
- Vercel deployment platform.
- shields.io badge generation.
