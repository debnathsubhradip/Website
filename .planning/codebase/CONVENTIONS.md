---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
# Coding Conventions

**Analysis Date:** 2026-11-21

## Scope of Analysis

**First-party files analyzed (these define the conventions):**
- `index.html` — primary page; contains inline `<style>` and inline `<script>` blocks
- `portfolio-details.html` — legacy BootstrapMade template page
- `assets/js/main.js` — legacy BootstrapMade template script (IIFE-wrapped)
- `assets/css/style.css` — hand-written "Modern Minimalistic Theme" stylesheet
- `forms/contact.php` — PHP contact-form handler
- `data.json` — content data file (not referenced by any script)
- `.vscode/launch.json` — editor debug configuration

**Excluded from analysis:**
- `assets/vendor/**` — third-party vendored code (Bootstrap, Bootstrap Icons, Boxicons, Swiper, AOS, GLightbox, Isotope, Typed.js, Waypoints, PureCounter, PHP Email Form). Conventions there are upstream libraries' own and must not be copied or edited.
- `Subhradip_Debnath_CV.pdf` — binary asset.

**Tooling context:** There is **no** linter, formatter config, `package.json`, `.editorconfig`, `tsconfig.json`, `composer.json`, `.gitignore`, or CI config in this repository. Every convention below is *observed practice*, not an enforced rule. Treat them as the house style to match when editing existing files, and as the style to establish when adding new ones.

---

## Naming Patterns

**Files:**
- Lowercase, kebab-case for multi-word names: `portfolio-details.html`, `contact.php`
- Single-word lowercase for the rest: `index.html`, `main.js`, `style.css`, `data.json`
- Directory names are lowercase and descriptive: `assets/`, `assets/css/`, `assets/js/`, `assets/img/`, `forms/`
- No file extensions other than `.html`, `.js`, `.css`, `.php`, `.json`, `.xml`, `.txt`, `.ico`, `.jpg`, `.png`, `.pdf`, `.woff*`

**JavaScript variables and functions:**
- camelCase is the dominant convention: `menuToggle`, `menuClose`, `mobileMenu`, `mobileLinks` (`index.html:558-561`), `portfolioIsotope`, `portfolioFilters`, `toggleBacktotop` (`assets/js/main.js:79`), `navbarlinksActive` (`assets/js/main.js:47`), `scrollto` (`assets/js/main.js:66`)
- Exceptions to camelCase (do not copy these; they are one-off template artifacts):
  - `typed_strings` — snake_case inside an otherwise camelCase file (`assets/js/main.js:143`)
  - `skilsContent` — typo for "skillsContent" (`assets/js/main.js:157`)
  - `navbarlinks` — all-lowercase compound (`assets/js/main.js:46`)
- DOM element references are named after the element's role, not its ID: `menuToggle` for `#menu-toggle`, `mobileMenu` for `#mobile-menu`
- Use `const` by default; use `let` only when a binding is reassigned (`assets/js/main.js:46`, `assets/js/main.js:48`)

**CSS classes:**
- Strictly kebab-case, always: `nav-glass`, `nav-link`, `card-hover`, `skill-pill`, `timeline-line`, `timeline-dot`, `profile-ring`, `btn-primary`, `btn-secondary`, `section-label`, `section-title`, `section-desc`, `social-btn`, `social-icon`, `mobile-menu`, `mobile-link`, `animate-fade-up`, `hero-gradient`, `footer-gradient`, `card-modern`, `section-divider` (`index.html:36-188`, `assets/css/style.css`)
- State modifiers are suffix classes, not `is-`/`has-` prefixes: `.active` (`.mobile-menu.active` at `index.html:167`, `assets/css/style.css:236`), `.filter-active` (`assets/js/main.js:186`)
- Framework utility classes (Tailwind) coexist with custom classes; custom classes always come first or last in the `class` attribute but never in the middle of a utility run — e.g. `class="card-hover bg-gray-50 rounded-2xl p-8 border border-gray-100"` (`index.html:286`)

**CSS custom properties:**
- `--` prefix + kebab-case, defined only in the `:root` block (`assets/css/style.css:2-11`): `--bg-primary`, `--bg-white`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--border`, `--card-shadow`
- Always pair a color variable with a companion hover variable: `--accent` / `--accent-hover`

**PHP variables:**
- snake_case: `$receiving_email_address`, `$php_email_form` (`forms/contact.php:10`, `forms/contact.php:12`)
- The form handler object is always named `$contact` (`forms/contact.php:18`)

**JSON keys:**
- Lowercase single words where possible: `about`, `degree`, `role`, `company`, `duration`, `name`, `title`, `doi`, `status`, `contact`, `credentials`
- Lowercase multi-word keys are written as separate words in camelCase form: `certifications`, `specialization`, `university`, `proficiency`, `credential`, `membership`, `society`, `description` (`data.json`)

**HTML attributes and IDs:**
- `id` values are kebab-case: `menu-toggle`, `menu-close`, `mobile-menu`, `typed-text` (`index.html:203`, `index.html:211`, `index.html:210`, `index.html:230`)
- Section anchor IDs are single lowercase words matching the nav href: `about`, `skills`, `resume`, `contact` (`index.html:245`, `index.html:294`, `index.html:320`, `index.html:505`)
- `id` and `class` attribute values are always double-quoted
- Third-party animation attributes follow the AOS library's own contract: `data-aos="fade-up"`, `data-aos-delay="100"`, `data-aos-duration="800"` (`index.html:223`, `index.html:253`)

---

## Code Style

**Formatting:**
- Formatter: **Not detected** (no Prettier, Biome, or EditorConfig config exists)
- Observed manual formatting rules:
  - Indentation is **2 spaces** in every first-party file — HTML, JS, CSS, PHP. **No tabs** are used anywhere in first-party code.
  - HTML nesting is indented 2 spaces per level; inline `<script>` / `<style>` bodies are indented 2 spaces relative to their tag (`index.html:19-34`, `index.html:36-188`, `index.html:547-566`)
  - CSS declarations are indented 2 spaces inside their rule block; `@keyframes` `from`/`to` blocks are indented 2 spaces (`assets/css/style.css:248-257`)
  - Blank line between top-level rules in CSS and between logical groups in JS
- Line endings are **mixed** across the repo — match the file you are editing:
  - LF: `index.html`, `assets/css/style.css`
  - CRLF: `portfolio-details.html`, `assets/js/main.js`, `forms/contact.php`, `data.json`
- Trailing whitespace is absent from HTML and CSS. One stray whitespace-only line exists at `forms/contact.php:20`.

**Linting:**
- Linter: **Not detected** (no ESLint, no PHP_CodeSniffer, no PHPStan)
- No lint rules are enforced in CI or pre-commit hooks.

**Quotes:**
- JavaScript: **single quotes** everywhere in first-party code — 118 single quotes vs 2 double quotes in `assets/js/main.js`; `index.html:547-566` uses 30 single quotes and 0 double quotes. The only double quotes in `assets/js/main.js` are the `"use strict"` directive (line 8) and the doc-header URL (line 3).
- HTML attribute values: **double quotes** always.
- CSS: single quotes for font family names (`font-family: 'Inter', -apple-system, ...` at `assets/css/style.css:18`).

**Semicolons:**
- `index.html` inline script: **consistently terminated** with semicolons (`index.html:548`, `index.html:550`, `index.html:563-565`)
- `assets/js/main.js`: **inconsistent** — semicolons appear on some statements (`let preloader = select('#preloader');` line 131, `});` line 136) and are omitted after arrow-function assignments and object literals (lines 13-20, 25-34, 39-41, 66-72). This is inherited from the upstream template.
- **When adding new JavaScript, use semicolons consistently** — the `index.html` inline block is the more recent, hand-written style and is the better reference.

**Declaration keywords:**
- `index.html` inline script **mixes `var` and `const` in the same block**: `var typed = new Typed(...)` (`index.html:550`) followed by four `const` declarations (`index.html:558-561`). The `var` is the outlier.
- `assets/js/main.js` uses only `const` and `let`.
- **When adding new JavaScript, use `const` by default and `let` only for reassigned bindings.** Do not introduce new `var` usage.

**Quotes for HTML strings:** N/A — no server-rendered templates.

---

## Import Organization

**Not applicable in the classic sense.** There is no module system, no bundler, and no `import`/`require` anywhere in first-party code.

Instead, the site uses **script-tag ordering as a dependency declaration mechanism**:

- `index.html:545-546` loads AOS then Typed.js from CDN, both as classic scripts, before the inline block at `index.html:547`
- `index.html:11` loads the Tailwind CDN in `<head>` (must precede the `tailwind.config` block at `index.html:19-34`)
- `portfolio-details.html:98-106` loads all vendor scripts in dependency order (PureCounter → AOS → Bootstrap bundle → GLightbox → Isotope → Swiper → Typed → Waypoints → validate.js), then `assets/js/main.js` last (`portfolio-details.html:109`) because it consumes the globals those libraries define
- `index.html` deliberately loads **no** local script files — all of its behavior is inline

**Ordering rule to preserve:** third-party libraries first, `assets/js/main.js` last, inline page-specific scripts last of all.

**Path conventions:**
- `index.html` uses **relative paths with a `./` prefix** for local assets: `./assets/img/me.png` (`index.html:225`), `./assets/css/...`
- `portfolio-details.html` uses **relative paths without the `./` prefix**: `assets/css/style.css` (`portfolio-details.html:28`)
- Prefer the `index.html` form (`./assets/...`) for new work in `index.html`.

---

## Error Handling

**JavaScript:**
- There are **no `try`/`catch` blocks** and **no `fetch`/XHR calls** in any first-party JavaScript.
- `index.html:558-565` performs `document.getElementById(...)` and immediately calls `.addEventListener` on the result with **no null guard**. If any of `#menu-toggle`, `#menu-close`, `#mobile-menu` is removed from the markup, the script throws a `TypeError` and the mobile menu stops working.
- `assets/js/main.js` is the opposite — it is **defensively guarded**. `select()` returns `null` for a miss and every consumer checks:
  - `if (backtotop) {` (`assets/js/main.js:78`)
  - `if (!section) return` (`assets/js/main.js:51-52`)
  - `if (typed) {` (`assets/js/main.js:142`)
  - `if (preloader) {` (`assets/js/main.js:132`)
  - `if (skilsContent) {` (`assets/js/main.js:158`)
  - `if (portfolioContainer) {` (`assets/js/main.js:176`)
  - `if (selectEl) {` inside the `on()` helper (`assets/js/main.js:27`)
- **Convention for new code:** follow `assets/js/main.js` — resolve the element once, guard it with a truthiness check, then attach behavior. Never call a method on an unguarded `getElementById` result.
- No error surface exists for the user: no error banner, no toast, no console output. Failures are silent.

**PHP (`forms/contact.php`):**
- The one explicit failure path uses `die()` with a human-readable message (`forms/contact.php:15`):
  ```php
  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }
  ```
- `$_POST` values are consumed **without validation, sanitization, or `isset()` checks**: `$contact->from_name = $_POST['name'];` (`forms/contact.php:22-24`) and `$_POST['message']` (`forms/contact.php:38`). Missing keys produce PHP notices and inject `null` into the mail body.
- No `htmlspecialchars()` / escaping is applied to user input before it reaches the mail body.
- The handler sends no structured response of its own; it echoes the library's `$contact->send()` result (`forms/contact.php:40`). The AJAX client expects the literal string `OK` on success — see `assets/vendor/php-email-form/validate.js:67` (`if (data.trim() == 'OK')`).
- **Currently non-functional:** the required library `assets/vendor/php-email-form/php-email-form.php` is not present in the repo (only `assets/vendor/php-email-form/validate.js` is vendored), so every request to this script `die()`s. Additionally `index.html` contains **no `<form>` element at all**, so this handler is unreachable from the live site.

---

## Logging

**Framework:** None. There is **no logging library and no `console.*` call anywhere** in first-party code.

- `console.log`, `console.error`, `console.warn`, `console.info` — zero occurrences outside `assets/vendor/**`
- There is no server-side logging configuration for `forms/contact.php`; the only output is the `die()` string and the echoed `$contact->send()` result

**Convention for new code:** prefer *no* logging in a static page (there is no log sink). If diagnostics are genuinely needed, use `console.warn`/`console.error` in `index.html`'s inline script rather than adding a logging dependency, and never log user-submitted form values.

---

## Comments

**When to Comment:**
- **CSS**: a one-line banner comment marks each component group, in Title Case, placed directly above the group (`assets/css/style.css`):
  ```css
  /* Nav */
  /* Hero */
  /* Cards */
  /* Skill Pills */
  /* Timeline */
  /* Buttons */
  /* Section Headers */
  /* Footer */
  /* Mobile Menu */
  /* Animations */
  /* AOS Custom */
  ```
- **HTML**: an `<!-- Comment -->` marker precedes each major block, in Title Case (`index.html:193`, `index.html:221`, `index.html:244`, `index.html:293`, `index.html:319`, `index.html:504`, `index.html:531`):
  ```html
  <!-- Header -->
  <!-- Mobile Menu -->
  <!-- Hero -->
  <!-- About -->
  <!-- Skills -->
  <!-- Resume -->
  <!-- Experience -->
  <!-- Education -->
  <!-- Certifications & Publications -->
  <!-- Contact -->
  <!-- Footer -->
  ```
  Sub-sections use the same pattern one level deeper (`<!-- Experience -->`, `<!-- Education -->` at `index.html:329`, `index.html:370`).
- **JavaScript**: `assets/js/main.js` places a `/** ... */` doc block above every helper and every behavior block (`assets/js/main.js:10-12`, `assets/js/main.js:22-24`, `assets/js/main.js:36-38`). `index.html`'s inline script has **no comments whatsoever**.
- **PHP**: a `/** ... */` doc block at the top of the file explains the library requirement (`forms/contact.php:2-7`); the SMTP block is kept as a commented-out `/* ... */` example (`forms/contact.php:27-34`)

**JSDoc/TSDoc:**
- The `/** ... */` style in `assets/js/main.js` is a short one-line description, not a full `@param`/`@returns` tag set. There are **no** `@param`, `@returns`, or `@type` tags anywhere in the repo.
- **Convention for new code:** a one-line `/** ... */` block above a non-obvious helper is welcome; omit tags for self-explanatory code.

**Do not:**
- Leave commented-out code blocks in HTML or JS (the only exception is the intentionally-instructive SMTP example in `forms/contact.php:27-34`)
- Add `//` line comments — the codebase uses block comments exclusively

---

## Function Design

**Size:**
- All JavaScript functions in the repo are short. The longest is `navbarlinksActive` at 13 lines (`assets/js/main.js:47-59`). The longest inline handler in `index.html` is a single line (`index.html:565`).
- Keep functions under ~15 lines. Extract when a handler needs more than one `if`.

**Parameters:**
- Helpers use **named parameters with defaults** rather than positional flags where possible: `const select = (el, all = false)` (`assets/js/main.js:13`), `const on = (type, el, listener, all = false)` (`assets/js/main.js:25`)
- The `on()` helper's parameter order is **event type first, then selector, then listener** (`assets/js/main.js:25`). Preserve this ordering if you add helpers alongside it.
- `index.html`'s inline handlers take **no parameters** and read `this`/closure variables instead (`index.html:563-565`)

**Return Values:**
- `select()` returns a single element or `null`; with `all = true` it returns an **array** (spread from a NodeList) rather than a live NodeList (`assets/js/main.js:13-20`)
- `on()` returns `undefined` — it is a side-effecting helper
- `scrollto()` returns `undefined` — it calls `window.scrollTo` (`assets/js/main.js:66-72`)
- Arrow functions used as inline event handlers return the result of the expression, e.g. `classList.add('active')` returns `undefined` (`index.html:563`)

---

## Module Design

**Exports:**
- None. There are no `export` statements, no CommonJS `module.exports`, and no ES modules in first-party code.
- `assets/js/main.js` is a **single IIFE** that encapsulates all of its logic:
  ```javascript
  (function() {
    "use strict";
    // ... all behavior ...
  })()
  ```
  (`assets/js/main.js:7-8`, closing at `assets/js/main.js:264`)
- `index.html`'s inline script has **no wrapper** — it runs at top level in the global scope (`index.html:547-566`)

**Barrel Files:**
- None.

**Script placement:**
- `index.html` places its inline `<script>` at the **end of `<body>`**, after the footer (`index.html:547-566`), so all DOM lookups resolve without a `DOMContentLoaded` wrapper.
- `portfolio-details.html` places vendor and local `<script>` tags at the **end of `<body>`** (`portfolio-details.html:98-109`).
- `assets/js/main.js` nevertheless defers heavy initialization to `window.addEventListener('load', ...)` (`assets/js/main.js:60`, `assets/js/main.js:120`, `assets/js/main.js:174`, `assets/js/main.js:255`) so images are laid out before measurements are taken.
- **Convention for new code:** put page-specific script at the end of `<body>`; do not add `<script>` tags in `<head>` other than config blocks that must precede a CDN library.

---

## Drift Between `index.html` and `assets/js/main.js` / `assets/css/style.css`

This is the most consequential convention issue in the repository. The site was rewritten from a BootstrapMade template to a Tailwind design (commits `afca9f1`, `86cbcd9`), and the rewrite left two parallel, inconsistent style systems in the tree.

**Critical fact:** `index.html` loads **neither** `assets/js/main.js` **nor** `assets/css/style.css`. Only `portfolio-details.html` loads them (`portfolio-details.html:28`, `portfolio-details.html:109`). So the two systems never co-apply at runtime, but they are edited side by side and must stay reconcilable.

### JavaScript drift

| Aspect | `index.html` inline script (lines 547-566) | `assets/js/main.js` |
|---|---|---|
| Scope wrapper | none — top-level global | IIFE `(function(){ "use strict"; ... })()` |
| Declaration keyword | mixed `var` (`line 550`) and `const` (lines 558-561) | `const` / `let` only |
| Element lookup | raw `getElementById` / `querySelectorAll` | `select(el, all)` helper |
| Listener attachment | direct `.addEventListener(...)` | `on(type, el, listener, all)` helper |
| Null safety | none | guarded (`if (el)`, `if (!x) return`) |
| Comments | none | `/** ... */` block above each section |
| Semicolons | consistent | inconsistent |
| Function style | arrow consts only | arrow consts **and** `function(e)` expressions |
| Third-party init | immediate, top level (`AOS.init` line 548, `new Typed` line 550) | load-scoped and guarded |
| Scroll handling | none — relies on native `href="#id"` anchors | `scrollto()` helper with a 200px header offset (`assets/js/main.js:48`, `assets/js/main.js:66-72`) |

**Selector overlap:** `assets/js/main.js` targets `.mobile-nav-toggle`, `#navbar .scrollto`, `.typed`, `.skills-content`, `#portfolio-flters li` — **none of which exist in `index.html`**, whose equivalents are `#menu-toggle`, `.mobile-link`, `#typed-text`, and `.skill-pill`. `assets/js/main.js` is inert with respect to the live homepage.

**Unused binding:** `var typed = new Typed('#typed-text', {...})` (`index.html:550`) assigns a variable that is never read. `assets/js/main.js` avoids this by calling `new Typed('.typed', {...})` without assignment (`assets/js/main.js:145`).

### CSS drift

`index.html:36-188` re-declares most of the components that `assets/css/style.css` already owns, using **hard-coded hex values instead of the `:root` custom properties**. `index.html` uses `var(--…)` **0 times**.

| Selector | `index.html` inline `<style>` | `assets/css/style.css` | Status |
|---|---|---|---|
| `.nav-glass` | bg + blur, no border | bg + blur + `border-bottom` | **conflicting** |
| `.btn-primary` | `padding: 14px 28px`; hover `translateY(-2px)`; shadow `rgba(...,0.3)` | `padding: 14px 32px`; hover `translateY(-1px)`; shadow `rgba(...,0.25)` | **conflicting** |
| `.section-label` | `letter-spacing: 0.12em` | `letter-spacing: 0.1em` | **conflicting** |
| `.profile-ring` | gradient + `padding: 4px` | gradient + `padding: 4px` + `.profile-ring img { background: white }` | **partial overlap** |
| `.skill-pill` | `transition` only | full pill treatment (bg, border, color, padding, radius, font) | **partial overlap** |
| `.card-hover` | present | absent — style.css names it `.card-modern` | **renamed** |
| `.social-btn` | present | absent — style.css names it `.social-icon` | **renamed** |

**Color palette is duplicated in two places** — `assets/css/style.css:2-11` (`--accent: #0ea5e9`, `--accent-hover: #0284c7`, `--text-primary: #1a1a2e`, `--text-secondary: #64748b`) and hard-coded in `index.html:24-25`, `index.html:45`, `index.html:56`, `index.html:63`, `index.html:82`, `index.html:91`, `index.html:114`, `index.html:131`, `index.html:143`, and throughout the Tailwind arbitrary-value classes (`text-[#0ea5e9]`, `bg-[#fafbfc]`, `text-[#64748b]`).

### Content drift

`data.json` is a **parallel content source of truth** that no script reads — `grep -rn "data.json"` across all HTML/JS/PHP returns zero hits. It has drifted from the hard-coded HTML:

| Section | `data.json` | `index.html` |
|---|---|---|
| `hobbies` | 3 entries (`data.json:41-45`) | 9 pills (`index.html:452-460`) |
| `certifications` | 11 entries (`data.json:97-109`) | 5 grouped lines (`index.html:424-428`) |
| `experience` | 7 entries (`data.json:60-96`) | 3 timeline entries (`index.html:338-366`) |
| `languages` | 3 with proficiency (`data.json:36-40`) | 3 without (`index.html:469-471`) |
| `ieee` | present (`data.json:7-12`) | **not rendered at all** |

### Other drift and dead code

- `portfolio-details.html` references `assets/img/portfolio/portfolio-details-1.jpg` through `-3.jpg` (`portfolio-details.html:53-61`) — those files were **deleted** in commit `afca9f1`, so the page shows broken images. It also references `assets/img/favicon.png` and `assets/img/apple-touch-icon.png` (`portfolio-details.html:13-14`), neither of which exists.
- `forms/contact.php` is unreachable: `index.html` has no `<form>`, no `<input>`, and no reference to `forms/contact.php`.
- `.vscode/launch.json:11` hardcodes a stale macOS path — `/Users/subhradip/Documents/GitHub/Website/index.html` — which does not resolve on this Windows checkout.
- `data.json` writes booleans as strings: `"active": "true"` (`data.json:2`), `"status": "true"` (`data.json:8`).
- `data.json` indentation is internally inconsistent: 4 spaces at the first level, 6 spaces at the second, 2 spaces before the closing root brace (`data.json:1-111`).

---

## Prescriptive Rules for New Code

1. **Use 2-space indentation, no tabs.** Match the file's existing line endings.
2. **Use single quotes in JavaScript, double quotes in HTML attributes.** End JavaScript statements with semicolons.
3. **Use `const` by default; `let` only for reassigned bindings; never `var`.**
4. **Use camelCase for JS identifiers, kebab-case for CSS classes, `--kebab-case` for CSS custom properties, snake_case for PHP variables.**
5. **Guard every DOM lookup** before use, following `assets/js/main.js` rather than `index.html:558-565`.
6. **Add a `<!-- Section -->` HTML banner or `/* Section */` CSS banner** when introducing a new block.
7. **Reuse the `:root` custom properties in `assets/css/style.css`** for new colors instead of introducing new hex literals.
8. **Do not add new dependencies or a `package.json`** without an explicit decision — the site is currently a zero-build static site and every library is loaded by CDN or vendored.
9. **Do not edit anything under `assets/vendor/**`** — that tree is upstream third-party code.
10. **When a change affects visible behavior, verify it in a browser** (see `TESTING.md`) — there is no automated suite to catch regressions.

---

*Convention analysis: 2026-11-21*
