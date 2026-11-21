---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
# Testing Patterns

**Analysis Date:** 2026-11-21

## Test Framework

**Runner:**
- **Not detected.** There is no test runner in this repository.
- No `package.json`, no `package-lock.json`, no `yarn.lock`, no `pnpm-lock.yaml` — the repo has no package manager setup at all.
- No Jest, Vitest, Mocha, Jasmine, Playwright, Cypress, Puppeteer, or Web Test Runner configuration or dependency.
- No PHPUnit, Pest, or any PHP test harness. No `composer.json`.
- No `tests/`, `spec/`, `__tests__/`, or `e2e/` directory anywhere in the tree.
- No files matching `*.test.*`, `*.spec.*`, `*_test.php`, or `test_*.php`.
- No CI configuration: there is no `.github/` directory, no `.gitlab-ci.yml`, no `.circleci/`, no `Jenkinsfile`, no `azure-pipelines.yml`.
- No `Makefile`, no `npm`/`composer` scripts, no task runner of any kind.

**Assertion Library:**
- Not applicable — no assertions exist in the codebase.

**Run Commands:**

```bash

# There is no automated test command.

# The practical verification path is manual — see "Manual Verification Path" below.

```

---

## Test File Organization

**Location:**
- Not applicable — no test files exist.

**Naming:**
- Not applicable — no test files exist.

**Structure:**
- Not applicable — no test files exist.

---

## Test Structure

**Suite Organization:**
- Not applicable — no test files exist.

**Patterns:**
- Not applicable — no test files exist.

---

## Mocking

**Framework:** Not detected.

**Patterns:** Not applicable — no test files exist.

**What to Mock:** Not applicable.

**What NOT to Mock:** Not applicable.

---

## Fixtures and Factories

**Test Data:**
- Not applicable — no test files exist.

**Location:**
- Not applicable — no test files exist.

---

## Coverage

**Requirements:** None enforced. There is no coverage tool, threshold, or report.

**View Coverage:**

```bash

# No coverage command exists.

```

---

## Test Types

**Unit Tests:** Not used. There is no unit-test infrastructure.

**Integration Tests:** Not used. There is no integration-test infrastructure.

**E2E Tests:** Not used. There is no browser-automation harness in the repo.

---

## Manual Verification Path

Because no automated suite exists, **every behavioral change must be verified by hand**. This is the de facto test procedure for this repository.

### 1. Serve the site locally

```bash

# Any static server works. Python is the lowest-friction option:

python -m http.server 8000

# Then open: http://localhost:8000/index.html

```

Opening `index.html` directly via `file://` mostly works (all scripts are CDN or inline, no fetch calls), but a local server is more faithful to the deployed environment and avoids browser file-origin restrictions.

For the deployed equivalent, the site is published at `https://subhradip.xyz/` from branch `github_pages` (remote `git@github.com:debnathsubhradip/Website.git`). Pushes to that branch trigger the GitHub Pages deploy.

### 2. Behavioural checklist for `index.html`

`index.html` is the only page the visitor sees. Its entire runtime behavior lives in three places: the Tailwind config block (`index.html:19-34`), the inline `<style>` block (`index.html:36-188`), and the inline `<script>` block (`index.html:547-566`). Walk each item:

| # | Behaviour | Where to verify | Expected result |
|---|---|---|---|
| 1 | Tailwind config applies | `index.html:19-34` | `accent` (#0ea5e9) and `accent-hover` (#0284c7) resolve; `font-sans` = Inter, `font-display` = Outfit |
| 2 | Hero loads | `index.html:222-242` | Profile image in the gradient ring, name, "Cloud Architect & Software Developer" subtitle |
| 3 | Typed text animation | `index.html:550-556` | `#typed-text` cycles `Engineer.` → `Architect.` → `Tutor.` → `Enthusiast.` with a 2000 ms back delay, looping forever |
| 4 | AOS scroll animations | `index.html:548` | 16 `data-aos="fade-up"` elements fade in once, 800 ms duration, 50 px offset |
| 5 | Desktop nav anchors | `index.html:197-202` | Clicking About / Skills / Resume / Contact jumps to `#about` / `#skills` / `#resume` / `#contact` |
| 6 | Mobile menu opens | `index.html:563` | Clicking `#menu-toggle` (hamburger, < 768 px) adds `.active` to `#mobile-menu` → `opacity: 1; visibility: visible` (`index.html:167-170`) |
| 7 | Mobile menu closes | `index.html:564` | Clicking `#menu-close` (X) removes `.active` → menu fades out |
| 8 | Mobile menu closes on link tap | `index.html:565` | Tapping any `.mobile-link` removes `.active` |
| 9 | Responsive breakpoint | `index.html:197`, `index.html:203` | Desktop nav hidden and hamburger shown below 768 px; reversed above |
| 10 | Hero hover states | `index.html:105-146` | Social icons fill with accent and lift `-2px`; primary button lifts and gains a shadow |
| 11 | Skill pills | `index.html:303-314` | 12 pills; hover turns them accent-filled |
| 12 | Timeline dots | `index.html:336-411` | Dots align on the gradient line in both Experience and Education columns |
| 13 | Contact CTAs | `index.html:519-524` | "Say Hello" opens the mail client for `contact@subhradip.xyz`; Telegram opens in a new tab |
| 14 | CV download | `index.html:238` | Opens the Google Drive CV in a new tab |
| 15 | Social links | `index.html:233-236`, `index.html:537-539` | Twitter / LinkedIn / Instagram open in new tabs; mailto opens the client |
| 16 | Console is clean | DevTools console | **Zero** errors and zero `console.*` output from first-party code |

### 3. Verification for `forms/contact.php`

The contact form is **not wired into the site** — `index.html` contains no `<form>`, no `<input>`, and no reference to `forms/contact.php`. To exercise it you must simulate the AJAX client by hand.

The expected request contract, derived from `assets/vendor/php-email-form/validate.js` (vendored, read-only):

- Method `POST`, body `FormData` from a `<form class="php-email-form">`
- Header `X-Requested-With: XMLHttpRequest`
- Fields read by the handler: `name`, `email`, `subject`, `message` (`forms/contact.php:22-24`, `forms/contact.php:36-38`)
- Success response body must be the literal string `OK` (`assets/vendor/php-email-form/validate.js:67`) — the client compares `data.trim() == 'OK'`
- Any non-`OK` body is thrown as an error and rendered into `.error-message` via `innerHTML` (`assets/vendor/php-email-form/validate.js:79-83`)

To test manually:

```bash

# Serve the repo root so that /forms/contact.php resolves

python -m http.server 8000

# The handler requires a PHP runtime and the PRO library:

#   assets/vendor/php-email-form/php-email-form.php

# That library is NOT in the repo (only validate.js is vendored), so the

# current expected response for ANY request is:

#   Unable to load the "PHP Email Form" Library!

```

**Expected current state:** every request to `forms/contact.php` returns the `die()` string from `forms/contact.php:15`. That is the correct behavior for the repository as it stands — do not treat it as a regression.

If the PRO library is ever added, also verify the failure paths that currently have no coverage: missing `$_POST` keys (PHP notice + empty value injected into the mail body), and a non-`OK` response body surfacing in `.error-message`.

### 4. Verification for `portfolio-details.html`

This page is a leftover from the template rewrite and is **not linked from anywhere in the site**.

```bash

# Direct URL only:

# http://localhost:8000/portfolio-details.html

```

Expect to observe, by design of the current tree:
- **Broken images** — `assets/img/portfolio/portfolio-details-1.jpg` … `-3.jpg` (`portfolio-details.html:53-61`) were deleted in commit `afca9f1`; `assets/img/favicon.png` and `apple-touch-icon.png` (`portfolio-details.html:13-14`) never existed
- Placeholder lorem-ipsum content ("ASU Company", "01 March, 2020")
- A working Swiper slider and a working "back to top" button, both driven by `assets/js/main.js`
- No visible error in the console from the missing images (only failed network requests)

### 5. Content parity check against `data.json`

`data.json` is not read by any script, so nothing in the browser will surface a mismatch. If you change resume content, verify by eye that `index.html` and `data.json` still agree — and be aware they currently do **not** (`data.json` lists 3 hobbies vs 9 in the HTML, 11 certifications vs 5 grouped lines, 7 experience entries vs 3 timeline entries, and an `ieee` block that the page never renders).

### 6. Editor-assisted check

`.vscode/launch.json` provides a Chrome launch configuration named **"Open index.html"**. Its `file` path is stale (`/Users/subhradip/Documents/GitHub/Website/index.html` — a macOS path that does not resolve on this checkout), so the launch config must be repointed at the local `index.html` before it works.

---

## Manual Verification Path

*(Summary of the practical routine, in order of cost.)*

1. Serve locally with `python -m http.server 8000`.
2. Open `http://localhost:8000/index.html`.
3. Walk the 16-row behavioural checklist above in the **browser**, resizing to below 768 px to cover the mobile menu.
4. Open DevTools → Console and confirm **no errors** and **no first-party `console.*` output**.
5. Open DevTools → Network and confirm only the expected CDN requests (`cdn.tailwindcss.com`, `fonts.googleapis.com`, `fonts.gstatic.com`, `unpkg.com/aos`, `cdn.jsdelivr.net/npm/typed.js`, `cdnjs.cloudflare.com` for Font Awesome) plus the local images.
6. Check `portfolio-details.html` separately, expecting the broken images listed above.
7. If `forms/contact.php` is touched, issue a POST and confirm it returns the `die()` string, then add the PRO library and confirm the `OK` contract before relying on it.

**Nothing above is automated or repeatable without a human.** This is the single largest process gap in the repository — see the Test Coverage Gaps section of `CONCERNS.md`'s sibling analysis for the specific behaviors that carry the most risk.

---

## Common Patterns

**Async Testing:**
- Not applicable — no async code paths are under test. The only `fetch()` in the repository is inside the vendored `assets/vendor/php-email-form/validate.js`, which is excluded from first-party analysis.

**Error Testing:**
- Not applicable — no test harness. The manual equivalent is step 4 and step 7 above (watch the console for exceptions; POST the form and read the response body).

---

## Recommended Additions (if a suite is ever introduced)

These are suggestions, not existing conventions — the repo currently enforces nothing.

1. **Add a `package.json`** with a `test` script, even if the only runner is a DOM-level library such as Vitest with `jsdom` or a Playwright smoke test. A single "the page renders and the mobile menu opens" test would have caught most of the drift documented in `CONVENTIONS.md`.
2. **Prioritize tests around the four highest-risk behaviors** in the current code:
   - Mobile menu open/close (`index.html:563-565`) — currently unguarded `getElementById` calls, so a markup rename silently throws
   - Typed.js instantiation (`index.html:550`) — the CDN script must load before the inline block
   - AOS initialization (`index.html:548`) — same CDN-ordering dependency
   - `forms/contact.php` POST contract — the `OK` string is a hard contract with vendored `validate.js`
3. **Guard the DOM lookups** in `index.html:558-561` before adding tests, so the tests assert behavior rather than crash-prevention.
4. **If a linter is added**, enable `no-undef` and `no-unused-vars` — these would have caught the unused `var typed` binding at `index.html:550` and the undefined `Typed`/`AOS` globals.

---

*Testing analysis: 2026-11-21*
