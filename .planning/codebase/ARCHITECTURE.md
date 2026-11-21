---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
<!-- refreshed: 2026-11-21 -->

# Architecture

**Analysis Date:** 2026-11-21

## System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                    ROUTING / DEPLOYMENT LAYER                        │
│   GitHub Pages (branch `github_pages`, repo root = publish root)     │
│   `CNAME` (custom domain) · `sitemap.xml` · `google*.html` (verify)  │
└───────────────────────────────┬──────────────────────────────────────┘
                                │ serves static files over HTTPS
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       PAGE / PRESENTATION LAYER                      │
│  ┌────────────────────────────┐   ┌──────────────────────────────┐  │
│  │ `index.html`               │   │ `portfolio-details.html`    │  │
│  │ Landing page, 569 lines    │   │ BootstrapMade "MyResume"     │  │
│  │ Tailwind CDN + inline CSS  │   │ v4.7.0 template remnant      │  │
│  │ + inline `<script>` blocks │   │ Bootstrap 5.1.3 + vendor JS   │  │
│  └─────────────┬──────────────┘   └──────────────┬───────────────┘  │
└────────────────┼─────────────────────────────────┼─────────────────┘
                 │                                 │
                 ▼                                 ▼
┌────────────────────────────────┐  ┌────────────────────────────────┐
│        STYLING LAYER           │  │        BEHAVIOR LAYER          │
│ Tailwind Play CDN utilities   │  │ Inline `<script>` in           │
│ (`index.html:11`, config       │  │ `index.html:547-566`           │
│  `index.html:19-34`)           │  │   AOS.init / Typed / menu      │
│ Inline `<style>` component     │  │ `assets/js/main.js` IIFE       │
│ classes (`index.html:36-188`)  │  │   (`portfolio-details.html:109`)│
│ `assets/css/style.css`         │  │ Vendored libs (Swiper,         │
│   `:root` design tokens        │  │   GLightbox, Isotope, ...)     │
│   (`portfolio-details.html:28`)│  │                                │
│ Vendored framework CSS         │  │                                │
└────────────────────────────────┘  └────────────────────────────────┘
                 │                                 │
                 ▼                                 ▼
┌────────────────────────────────┐  ┌────────────────────────────────┐
│         DATA LAYER             │  │      SERVER-SIDE LAYER         │
│ `data.json` — static profile  │  │ `forms/contact.php` — PHP mail │
│ content, 8 top-level keys      │  │ relay (non-functional on Pages)│
│ ⚠ NOT read by any code path    │  └────────────────────────────────┘
└────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Landing page | Primary portfolio surface: hero, about, skills, resume, contact, footer. All copy hardcoded in markup. | `index.html` |
| Tailwind theme config | Extends the CDN Tailwind theme with `accent`/`accent-hover` colors and `sans`/`display` font families. | `index.html:19-34` |
| Inline component CSS | Local utility-component classes: `.nav-glass`, `.nav-link`, `.card-hover`, `.skill-pill`, `.timeline-line`, `.timeline-dot`, `.social-btn`, `.profile-ring`, `.btn-primary`, `.mobile-menu`, `.section-label`, `.animate-fade-up`. | `index.html:36-188` |
| Inline page script | `AOS.init` (`:548`), Typed.js hero rotator (`:550-556`), mobile menu open/close wiring (`:558-565`). | `index.html:547-566` |
| Portfolio detail page | Leftover BootstrapMade "MyResume" v4.7.0 template page with a Swiper gallery and placeholder project metadata. | `portfolio-details.html` |
| Custom theme stylesheet | Canonical "Modern Minimalistic Theme" stylesheet: `:root` CSS custom properties + the same component classes as the inline block, plus `.hero-gradient`, `.card-modern`, `.btn-secondary`, `.section-title`, `.section-desc`, `.footer-gradient`, `.social-icon`, `.section-divider`. | `assets/css/style.css` |
| Vendor behavior script | BootstrapMade MyResume v4.7.0 controller: `select()`/`on()` helpers, nav active-state, back-to-top, preloader removal, Typed, Waypoint skill bars, Isotope filters, GLightbox, Swiper sliders, AOS init. | `assets/js/main.js` |
| Static profile data | Canonical JSON snapshot of resume content: `active`, `about`, `ieee`, `education`, `languages`, `hobbies`, `publications`, `experience`, `certifications`. | `data.json` |
| PHP mail relay | Reads `$_POST` fields (`name`, `email`, `subject`, `message`) and hands them to the PHP Email Form library. | `forms/contact.php` |
| Deployment routing | Custom domain pointer for GitHub Pages. | `CNAME` |
| SEO discovery | Single-URL sitemap for `https://subhradip.xyz/`. | `sitemap.xml` |
| Search verification | Google Search Console site-verification token file. | `google42d4a0a6e148cf47.html` |

## Pattern Overview

**Overall:** Static multi-page site with runtime-enhanced markup ("progressive enhancement over hand-authored HTML"), deployed as-is by GitHub Pages.

**Key Characteristics:**
- **No build step.** No `package.json`, no bundler, no transpiler, no `.nojekyll`. Files in the repo root are the files the server serves. GitHub Pages runs its own Jekyll pass, which ignores `assets/`, `forms/`, and root HTML without front-matter.
- **Self-contained pages.** Each HTML file carries its own `<head>` stylesheet set, its own markup, and its own inline `<script>`. There is no shared layout, partial, or include mechanism.
- **Two independent styling systems coexist.** `index.html` is a Tailwind-Play-CDN + Font Awesome page; `portfolio-details.html` is a Bootstrap 5.1.3 + bootstrap-icons + boxicons page. They share no grid system, no icon set, and no color token source.
- **CDN-first, vendored-second.** `index.html` pulls Tailwind, AOS, Typed.js, Font Awesome, and Google Fonts from CDNs. `portfolio-details.html` pulls equivalent libraries from the committed `assets/vendor/` tree.
- **Content is hardcoded in markup, with a parallel JSON copy.** The DOM text is authored directly in `index.html`; `data.json` holds a shadow copy of the same facts but is never fetched (see "Data Flow" below).

## Layers

**Routing / Deployment Layer:**
- Purpose: Map a public URL to a file and advertise the site to crawlers.
- Location: repo root (`CNAME`, `sitemap.xml`, `google42d4a0a6e148cf47.html`)
- Contains: custom-domain pointer, sitemap, Search Console verification file
- Depends on: GitHub Pages serving the `github_pages` branch root of `git@github.com:debnathsubhradip/Website.git`
- Used by: the browser (URL resolution) and search engines (sitemap/verification)

**Page / Presentation Layer:**
- Purpose: Author the visible DOM structure of each page.
- Location: `index.html`, `portfolio-details.html`
- Contains: semantic HTML5 (`header`, `main`, `section`, `footer`), section anchors, static copy
- Depends on: styling layer (CSS) + behavior layer (JS)
- Used by: visitors

**Styling Layer:**
- Purpose: Define visual presentation; split across Tailwind utilities, inline component CSS, a custom theme stylesheet, and vendored framework CSS.
- Location: `index.html:11` (Tailwind CDN), `index.html:36-188` (inline `<style>`), `assets/css/style.css`, `assets/vendor/**/css/*`
- Contains: utility class strings in markup, CSS custom properties in `:root`, framework resets/grids
- Depends on: nothing inside this repo (Tailwind ships a Play CDN build; Bootstrap is vendored)
- Used by: both pages, but never the same set of files — see "Split Between Styling Systems" below

**Behavior Layer:**
- Purpose: Client-side interactivity — scroll animations, typewriter effect, mobile navigation, sliders, filters, lightboxes.
- Location: inline `<script>` in `index.html:547-566`; `assets/js/main.js` (loaded only by `portfolio-details.html`)
- Contains: `AOS.init`, `new Typed(...)`, DOM class toggling, an IIFE with `select()`/`on()`/`onscroll()` helpers
- Depends on: globals exposed by the library scripts (`AOS`, `Typed`, `Swiper`, `GLightbox`, `Isotope`, `Waypoint`)
- Used by: visitors

**Data Layer:**
- Purpose: Hold the structured profile/resume facts.
- Location: `data.json` (single JSON document, 111 lines, 8 top-level keys)
- Contains: `about`, `ieee`, `education`, `languages`, `hobbies`, `publications`, `experience`, `certifications`, plus an unused `active` flag
- Depends on: nothing
- Used by: **no code path in this repository** — see "Data Flow"

**Server-Side Layer:**
- Purpose: Accept a contact-form POST and relay it to email.
- Location: `forms/contact.php`
- Contains: `$_POST` field mapping and a `PHP_Email_Form` invocation
- Depends on: `assets/vendor/php-email-form/php-email-form.php` — **this file is not present**; the script `die()`s with `'Unable to load the "PHP Email Form" Library!'` (`forms/contact.php:12-16`). GitHub Pages also does not execute PHP.
- Used by: nothing — `index.html` has no `<form>` element; the contact section offers `mailto:` and Telegram links only (`index.html:519-524`).

## Data Flow

### Primary Request Path — Landing Page

1. Browser requests `/` → GitHub Pages serves `index.html` from the `github_pages` branch root.
2. `<head>` parses: Tailwind Play CDN loads (`index.html:11`), Google Fonts + AOS CSS + Font Awesome load from CDNs (`index.html:12-17`), inline `tailwind.config` extends the theme (`index.html:19-34`), inline `<style>` defines component classes (`index.html:36-188`).
3. Body markup parses: fixed glass header (`index.html:194-207`), hidden mobile overlay menu (`index.html:210-218`), hero with `<span id="typed-text">` placeholder (`index.html:222-242`), then `#about` (`:245-291`), `#skills` (`:294-317`), `#resume` (`:320-502`), `#contact` (`:505-528`), footer (`:532-543`).
4. Tailwind's Play CDN scans the DOM at runtime and generates the utility CSS for the class strings found in the markup.
5. AOS JS + Typed.js load from CDN (`index.html:545-546`), then the inline script runs: `AOS.init({duration: 800, once: true, offset: 50})` (`:548`) attaches scroll-reveal behavior to every `[data-aos]` element; `new Typed('#typed-text', {...})` (`:550-556`) rotates the hero subtitle strings; menu listeners (`:558-565`) toggle the `.active` class on `#mobile-menu` and auto-close it when a `.mobile-link` is clicked.
6. Output: a fully static DOM whose only runtime mutation is animation classes, the typed string, and the mobile overlay's `active` class.

**State Management:**
- No framework, no store, no global application state. The only mutable state is CSS class names on DOM nodes (`.active` on `#mobile-menu`, `.aos-animate` on AOS targets) and the Typed.js internal string index.
- All content state is literal text in the HTML source.

### Secondary Flow — Portfolio Details Page

1. Browser requests `/portfolio-details.html` → GitHub Pages serves the file directly.
2. `<head>` loads vendored CSS: AOS, Bootstrap 5.1.3, bootstrap-icons, boxicons, GLightbox, Swiper (`portfolio-details.html:20-25`), then the custom theme `assets/css/style.css` (`:28`).
3. Body renders one `#portfolio-details` section containing a `.portfolio-details-slider` Swiper with three slides (`portfolio-details.html:43-90`) plus a `#preloader` and `.back-to-top` element (`:94-95`).
4. Vendored JS loads in order: PureCounter, AOS, Bootstrap bundle, GLightbox, Isotope, Swiper, Typed, Waypoints, php-email-form validator (`portfolio-details.html:98-106`), then `assets/js/main.js` (`:109`).
5. `assets/js/main.js` executes as one IIFE (`assets/js/main.js:7-8`): it removes `#preloader` on load (`:129-135`), initializes the portfolio Swiper (`:220-232`) and the testimonials Swiper (`:237-250`, no matching markup on this page), creates two GLightbox instances (`:204-215`), and calls `AOS.init` (`:255-262`).
6. Output: a gallery page whose images currently 404 (see "Fragile Areas" in `CONCERNS.md`).

### Data Flow — `data.json`

`data.json` is **not part of any live request path**. A repository-wide search for `data.json`, `fetch(`, `JSON.parse`, and `XMLHttpRequest` returns matches only inside vendored libraries (`assets/vendor/php-email-form/validate.js:53`, `assets/vendor/isotope-layout/isotope.pkgd.js:746`). No page loads `data.json`.

The file is a **parallel content model** that duplicates facts already hardcoded in `index.html`. The mapping between JSON keys and rendered sections is maintained by hand:

| `data.json` key | Corresponding DOM section in `index.html` | Wired by code? |
|---|---|---|
| `about.description` | `#about` intro paragraph (`index.html:250`) | No — text is copied |
| `about.certifications` | `#resume` → Certifications card (`index.html:418-430`) | No — vendor-grouped copy |
| `ieee` (`status`, `membership`, `society`, `contact`) | **No corresponding DOM** | No — not rendered anywhere |
| `education[]` | `#resume` → Education timeline (`index.html:376-412`) | No — 4 hand-written cards |
| `languages[]` | `#resume` → Languages card (`index.html:464-473`) | No |
| `hobbies[]` | `#resume` → Hobbies card (`index.html:447-462`) | No — page shows 9, JSON has 3 |
| `publications[]` | `#resume` → Publications card (`index.html:437-441`) | No |
| `experience[]` | `#resume` → Experience timeline (`index.html:335-367`) | No — page shows 3 grouped entries, JSON has 7 |
| `certifications[]` | `#resume` → Certifications card (`index.html:418-430`) | No — page lists vendor groups, JSON lists 11 named certs |
| `active` | **No corresponding DOM** | No — unused flag |

**Implication for future work:** any content change must be applied in two places (`index.html` markup and `data.json`) until a rendering layer reads the JSON. Treat `data.json` as the canonical content record and `index.html` as its manual presentation, or vice versa — but do not expect the JSON to update the page.

## Key Abstractions

**Section Anchor:**
- Purpose: A stable `id` on a `<section>` that both the header nav and the mobile menu link to (`#about`, `#skills`, `#resume`, `#contact`).
- Examples: `index.html:245`, `index.html:294`, `index.html:320`, `index.html:505`
- Pattern: plain in-page anchor with `scroll-behavior` left to the browser default. `assets/js/main.js:66-72` provides a `scrollto()` helper with header offset, but that helper only runs on `portfolio-details.html`, where no `#navbar` exists — so `index.html` uses native anchor jumps.

**Component Class (`.card-hover`, `.skill-pill`, `.timeline-dot`, …):**
- Purpose: Semantic styling hooks shared between markup and CSS.
- Examples: defined in `index.html:36-188` and mirrored in `assets/css/style.css:37-265`
- Pattern: Tailwind utilities handle layout/spacing; a named class handles stateful or pseudo-element behavior (hover, gradient, ring, underline animation).

**Design Token (`--accent`, `--bg-primary`, `--text-secondary`, …):**
- Purpose: Single source of color truth for the custom theme.
- Examples: `assets/css/style.css:2-11`
- Pattern: CSS custom properties on `:root`. **Only `portfolio-details.html` loads this stylesheet**, so `index.html` renders with hardcoded hex values instead (`#0ea5e9`, `#64748b`, `#fafbfc`) that duplicate the token values.

**Vendor Script Globals (`AOS`, `Typed`, `Swiper`, `GLightbox`, `Isotope`, `Waypoint`):**
- Purpose: Third-party behavior attached to the DOM without an import graph.
- Examples: `index.html:548`, `index.html:550`, `assets/js/main.js:145`, `assets/js/main.js:177`, `assets/js/main.js:204`, `assets/js/main.js:220`
- Pattern: `<script>` tags establish window globals; `assets/js/main.js` consumes them unqualified. Load order in `portfolio-details.html:98-109` is the dependency order.

**JSON Key Convention:**
- Purpose: Flat, section-named top-level keys that read as a document outline.
- Examples: `data.json:3` (`about`), `data.json:13` (`education`), `data.json:60` (`experience`)
- Pattern: top-level keys are lowercase nouns; array item fields are camelCase (`degree`, `specialization`, `university`, `cgpa`, `proficiency`, `credential`, `duration`, `doi`).

## Entry Points

**`index.html` (site root, `/`):**
- Location: `index.html`
- Triggers: any request to the custom domain root or `https://subhradip.xyz/`
- Responsibilities: renders the entire portfolio; bootstraps Tailwind, AOS, Typed.js, Font Awesome; owns the mobile navigation overlay; hosts all resume content as hardcoded markup.

**`portfolio-details.html` (`/portfolio-details.html`):**
- Location: `portfolio-details.html`
- Triggers: direct navigation only — no link to it exists anywhere in the site (verified: no `href` in `index.html` points at it, and `sitemap.xml` lists only the root URL)
- Responsibilities: renders a template gallery/detail view; loads the vendored framework stack and `assets/js/main.js`.

**`forms/contact.php` (`/forms/contact.php`):**
- Location: `forms/contact.php`
- Triggers: an HTTP POST with `name`, `email`, `subject`, `message` — no form in the repo submits to it
- Responsibilities: maps `$_POST` fields onto `PHP_Email_Form` and sends mail. Non-functional on GitHub Pages (no PHP execution) and missing its library dependency.

**`assets/js/main.js`:**
- Location: `assets/js/main.js`
- Triggers: `<script src="assets/js/main.js">` — present only in `portfolio-details.html:109`
- Responsibilities: bootstraps every vendored library's UI behavior for the template page.

## Architectural Constraints

- **Execution model:** single-threaded browser event loop, no server-side rendering, no hydration. All DOM exists in the source HTML; JS only toggles classes and text.
- **Global state:** window globals established by vendor scripts — `AOS`, `Typed`, `Swiper`, `GLightbox`, `Isotope`, `Waypoint` (and `PureCounter` in `portfolio-details.html`). `assets/js/main.js` reads them as free variables with no imports, no namespacing, and no dependency declaration. `index.html` additionally relies on the `tailwind.config` global (`index.html:20`).
- **Circular imports:** none — there is no module graph. Everything is classic `<script>` tag loading.
- **Module system:** none. `assets/js/main.js` is a single 264-line IIFE with no `import`/`export`; the inline script in `index.html` is a bare top-level block.
- **No build/dependency manifest:** there is no `package.json`, lockfile, or version pin for the CDN scripts. CDN URLs hardcode versions (`aos@2.3.1`, `typed.js@2.0.12`, Font Awesome `6.4.0`) but Tailwind and Google Fonts are unversioned (`https://cdn.tailwindcss.com`).
- **Publish root = repo root.** `CNAME`, `sitemap.xml`, `index.html`, `portfolio-details.html`, `data.json`, `google42d4a0a6e148cf47.html`, `forms/`, and `assets/` are all served publicly. `Subhradip_Debnath_CV.pdf` is currently untracked but would be published if committed.
- **Branch coupling:** only `github_pages` exists locally and on the remote (`git branch -a` → `github_pages`, `origin/github_pages`); `origin/HEAD` points at it. Any publish must land on that branch.

## Anti-Patterns

### Orphaned Data Source

**What happens:** `data.json` is committed at the repo root and maintained across commits (`34e62e7 data.json`, `4a9a65d data file updated`, `5d4d654 data and index updated`), but no code reads it. `index.html` hardcodes the same content.

**Why it's wrong here:** two sources of truth for the same facts, already divergent — `data.json` lists 7 experience entries and 3 hobbies while `index.html` shows 3 grouped experience entries and 9 hobbies. Content edits silently leave the JSON stale, and any tool that reads `data.json` gets a different resume than visitors see.

**Do this instead:** add a render layer — a `assets/js/portfolio.js` that `fetch('data.json')`, maps each key to a `<section id>` container, and populates it; call it from `index.html` before `</body>`. Until that exists, treat `index.html` as canonical and update `data.json` in the same commit, or delete `data.json`.

### Duplicated Style Systems Between One File and the Shared Stylesheet

**What happens:** `index.html:36-188` inlines a `<style>` block that re-declares `.nav-glass`, `.nav-link`, `.profile-ring`, `.skill-pill`, `.timeline-line`, `.timeline-dot`, `.btn-primary`, `.mobile-menu`, `.section-label`, and the `fadeUp` keyframes — the same selectors that already exist in `assets/css/style.css:37-265`. `index.html` never links `assets/css/style.css`.

**Why it's wrong here:** the two copies have already drifted (inline `.btn-primary` uses `padding: 14px 28px` at `index.html:133` vs `14px 32px` at `assets/css/style.css:140`; inline `.nav-link::after` uses `letter-spacing 0.12em` vs `0.1em` in the stylesheet's `.section-label`). The `:root` design tokens in `assets/css/style.css:2-11` are inert for the landing page, which hardcodes `#0ea5e9`, `#64748b`, `#fafbfc`, `#e2e8f0` instead.

**Do this instead:** add `<link rel="stylesheet" href="assets/css/style.css">` to the `index.html` `<head>` (after the Font Awesome link at `index.html:17`), delete the duplicated rules from the inline `<style>` block, and replace hardcoded hex values with the token names (`text-[var(--accent)]`) or add the colors to the Tailwind config at `index.html:19-34`.

### Two Competing Framework Stacks in One Repository

**What happens:** `index.html` uses the Tailwind Play CDN with Font Awesome 6.4.0 icons (`<i class="fas fa-cloud">`). `portfolio-details.html` uses Bootstrap 5.1.3 with `bootstrap-icons` and `boxicons` (`<i class="bi bi-arrow-up-short">`).

**Why it's wrong here:** the two pages share no layout primitive (Tailwind `max-w-6xl mx-auto px-6` vs Bootstrap `.container .row .col-lg-8`), no icon font, and no color system. Any new page has to guess which stack it belongs to, and a shared header or footer cannot be reused between them.

**Do this instead:** pick one stack for new work. For the landing page's direction, standardize on Tailwind utilities plus the `assets/css/style.css` component classes, and port `portfolio-details.html` to it before adding features to that page.

### Server-Side PHP in a Static-Hosting Repository

**What happens:** `forms/contact.php` sits inside a GitHub Pages repository that never executes PHP. It also requires `assets/vendor/php-email-form/php-email-form.php`, which is not in the repository — only the client-side `validate.js` is vendored. `index.html` contains no `<form>` element at all.

**Why it's wrong here:** the file cannot work in the deployed environment and cannot work locally without the pro library; it reads `$_POST` without any `isset`/validation guard, and it hardcodes the receiving address (`forms/contact.php:10`).

**Do this instead:** drop the server-side form path — use the `mailto:` link already present at `index.html:519` — or move the endpoint to a real PHP host outside this repo. If a form is added later, host the endpoint under `forms/<name>.php` on that host and point the form's `action` at it.

### Copy-Paste Page Shell

**What happens:** each HTML file repeats the full `<head>` boilerplate (charset, viewport, favicon links, font links, vendor CSS, vendor JS, script tags). `portfolio-details.html:4-35` and `index.html:4-188` share nothing structurally, and there is no template mechanism to change the header, meta tags, or asset list in one place.

**Why it's wrong here:** adding a third page means hand-copying ~40 lines of `<head>` and ~10 `<script>` tags, and it is easy to miss the favicon, the sitemap entry, or the vendor ordering.

**Do this instead:** for a new page, copy `index.html`'s `<head>` block (`index.html:4-34`) as the starting point, keep the vendor `<script>` order, and add the new page to `sitemap.xml`. If more than one more page is added, introduce a build step (e.g. a small Node script that assembles pages from a shared partial) — there is currently no such tooling, so do not assume a template engine exists.

### Referencing Assets That Do Not Exist

**What happens:** `portfolio-details.html` points at `assets/img/favicon.png` (`:13`), `assets/img/apple-touch-icon.png` (`:14`), and `assets/img/portfolio/portfolio-details-1..3.jpg` (`:53`, `:57`, `:61`). None of these files exist; the `assets/img/portfolio/` directory does not exist at all.

**Why it's wrong here:** every one of those requests 404s, so the page renders with a broken favicon and three empty gallery slides.

**Do this instead:** create `assets/img/portfolio/` and add the three images, or change the `<img src>` values to files that exist (`assets/img/favicon.ico` is present).

## Error Handling

**Strategy:** None in the application's own code. The site has no try/catch, no error boundary, and no user-facing error state.

**Patterns:**
- **Guard-by-null-check** in `assets/js/main.js`: `if (backtotop)` (`:78`), `if (preloader)` (`:132`), `if (typed)` (`:142`), `if (skilsContent)` (`:158`), `if (selectEl)` (`:27`) — behavior is skipped silently when the expected element is absent. This is why the page does not crash despite loading libraries for sections that do not exist.
- **Silent catch-all** in the `on()` helper (`assets/js/main.js:25-34`) — a selector that matches nothing is a no-op, not an error.
- **PHP fatal** in `forms/contact.php:15` — `die('Unable to load the "PHP Email Form" Library!')` prints a raw string to the response body.
- **Unhandled network failure** — the vendored form validator (`assets/vendor/php-email-form/validate.js:53`) rejects the `fetch` without a visible error path.

## Cross-Cutting Concerns

**Logging:** None. No `console.*` calls in `index.html`, `portfolio-details.html`, `assets/js/main.js`, or `assets/css/style.css`. Production errors are silent.

**Validation:** Only client-side HTML-form validation, and it is inert here — `assets/vendor/php-email-form/validate.js` (vendored, loaded by `portfolio-details.html:106`) validates `name`/`email`/`subject`/`message` fields, but no `<form>` markup exists in the repository. Server-side, `forms/contact.php` reads `$_POST['name']`, `$_POST['email']`, `$_POST['subject']`, `$_POST['message']` directly with no `isset()` checks (`:22-24`, `:36-38`).

**Authentication:** None. The site is fully public; there are no accounts, tokens, or protected routes.

**Accessibility:** Presentational and partial — `alt` text on every `<img>` (`index.html:225`, `:287`), semantic landmarks (`header`/`main`/`section`/`footer`), and `aria`-free controls (the mobile toggle button at `index.html:203` has no `aria-expanded`/`aria-label`). `assets/css/style.css:264-266` forces `[data-aos] { pointer-events: auto !important; }` to keep animated elements clickable.

**Performance:** `index.html` ships four blocking third-party CDN requests in `<head>` (`index.html:11`, `:14`, `:15`, `:17`) and no `<link rel="preload">` for the hero image; the Tailwind Play CDN JIT-compiles utility CSS in the browser at runtime, which is slower than a prebuilt stylesheet. Images are unoptimized (no `loading="lazy"`, no `srcset`, no width/height attributes).

**SEO:** Per-page `<title>` and `<meta name="description">` exist on `index.html:7-9` but are empty on `portfolio-details.html:8-10`. `sitemap.xml` lists only the root URL with a `lastmod` of `2021-12-25`. `google42d4a0a6e148cf47.html` provides Search Console verification.

**Content duplication:** the highest-impact cross-cutting concern — resume facts live in `index.html` markup, in `data.json`, and (for the CV) in `Subhradip_Debnath_CV.pdf`, with no single source of truth.

---

*Architecture analysis: 2026-11-21*
