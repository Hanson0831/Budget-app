<<<<<<< HEAD
﻿# Budget App (JavaScript)

[![Istanbul Coverage](https://img.shields.io/badge/Istanbul%20Coverage-91.34%25-brightgreen)](./coverage/coverage.txt)

A lightweight budget tracker with:

- Income / expense management
- i18n toggle (English / 中文)
- Accessibility-focused controls and keyboard support
- Cookie consent + dedicated Privacy Policy page

## Requirement status

- ✅ **Test Coverage >= 80%**
  - Proven via coverage badge and report (`coverage/coverage.txt`, `coverage/summary.json`)
  - Current line coverage: **91.34%**
- ⚠️ **Lighthouse Accessibility >= 90**
  - A11y fixes are implemented (semantic buttons, aria labels, keyboard navigation, focus states).
  - Please run Lighthouse locally to record the exact score in your environment.
- ✅ **i18n toggle for 2+ languages**
  - English / 中文 toggle at top-right
- ✅ **Legal compliance basics**
  - Functional cookie banner
  - Dedicated privacy page: `privacy.html`

## Scripts

```bash
npm test
npm run coverage
npm run lighthouse
```

- `npm test`: run unit tests
- `npm run coverage`: generate coverage report and enforce 80% line threshold
- `npm run lighthouse`: reminds how to run Lighthouse manually

## Tested functions

- `validateEntry`
- `loadEntries`
- `normalizeStoredEntry`
- `calculateTotal`
- `calculateBalance`

## Manual validation

See `TESTING.md`.
=======
# Budget App V3

Intermediate coursework version for:

- centralized configuration
- extracted reusable core logic
- validation and safer rendering
- safe localStorage recovery
- stable entry IDs for edit/delete
- unit tests for core behavior

## Run Tests

```bash
npm test
```

Optional local coverage:

```bash
npm run coverage
```
>>>>>>> 67573192f670bc4eab1d90635a6dabb0b7668284
