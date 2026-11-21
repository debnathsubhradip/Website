---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
# Codebase Structure

**Analysis Date:** 2026-11-21

## Directory Layout

```
D:/Development/Website/
├── index.html                  # Landing page — the whole portfolio (569 lines, self-contained)
├── portfolio-details.html      # BootstrapMade "MyResume" v4.7.0 template detail page
├── data.json                   # Static profile/resume content (8 top-level keys) — not read by any code
├── CNAME                       # GitHub Pages custom domain → subhradip.xyz
├── sitemap.xml                 # SEO sitemap (root URL only)
├── google42d4a0a6e148cf47.html # Google Search Console verification token
├── Subhradip_Debnath_CV.pdf    # Résumé PDF (currently untracked in git)
├── forms/                      # Server-side directory — PHP mail relay
│   ├── contact.php             # POST handler for the (unused) contact form
│   └── Readme.txt              # Notes on the PHP Email Form library
├── assets/
│   ├── css/
│   │   └── style.css           # "Modern Minimalistic Theme" — :root tokens + custom component classes
│   ├── js/
│   │   └── main.js             # BootstrapMade MyResume controller (264-line IIFE)
│   ├── img/
│   │   ├── favicon.ico         # Present, unreferenced (portfolio-details.html asks for favicon.png)
│   │   ├── hero-bg.jpg         # Unreferenced
│   │   ├── me.png              # Referenced: hero avatar + favicon (index.html:16, :225)
│   │   ├── profile-img.jpg     # Referenced: About card (index.html:287)
│   │   └── testimonials/       # 5 images, all unreferenced
│   │       ├── testimonials-1.jpg … testimonials-5.jpg
│   └── vendor/                 # Vendored third-party CSS/JS — 74 files, ~11 MB, DO NOT EDIT
│       ├── aos/                # AOS 2.3.1
│       ├── bootstrap/          # Bootstrap 5.1.3 (css + js bundle)
│       ├── bootstrap-icons/    # bootstrap-icons + woff/woff2 fonts
│       ├── boxicons/           # Boxicons + eot/ttf/woff/woff2/svg fonts
│       ├── glightbox/          # GLightbox lightbox
│       ├── isotope-layout/     # Isotope grid/filter layout
│       ├── php-email-form/     # validate.js only (php-email-form.php NOT present)
│       ├── purecounter/        # PureCounter
│       ├── swiper/             # Swiper bundle
│       ├── typed.js/           # Typed.js
│       └── waypoints/          # Waypoints scroll triggers
├── .vscode/
│   └── launch.json             # Chrome debug config (hardcoded macOS path — stale)
└── .planning/                  # GSD planning artifacts (tooling-owned)
```

## Directory Purposes

**`assets/vendor/`:**
- Purpose: Third-party libraries committed to the repository so pages load without npm.
- Contains: one directory per library, each with its own upstream file layout (`css/`, `js/`, `fonts/`); `.map` source maps and non-minified variants included.
- Key files: `assets/vendor/bootstrap/css/bootstrap.min.css`, `assets/vendor/bootstrap/js/bootstrap.bundle.min.js`, `assets/vendor/aos/aos.js`, `assets/vendor/swiper/swiper-bundle.min.js`
- Rule: treat every file here as read-only. Upgrades replace the whole library directory; never hand-edit a vendored file.

**`assets/css/`:**
- Purpose: Project-owned stylesheet, layered on top of the framework CSS.
- Contains: a single file — `assets/css/style.css` (265 lines), organized as `:root` design tokens, then commented blocks (`/* Nav */`, `/* Hero */`, `/* Cards */`, `/* Skill Pills */`, `/* Timeline */`, `/* Buttons */`, `/* Section Headers */`, `/* Footer */`, `/* Mobile Menu */`, `/* Animations */`, `/* AOS Custom */`).
- Key files: `assets/css/style.css`
- Note: only `portfolio-details.html:28` links this file. `index.html` carries a near-duplicate copy inline at `index.html:36-188`.

**`assets/js/`:**
- Purpose: Project-owned client-side behavior.
- Contains: `assets/js/main.js` only — the upstream BootstrapMade MyResume controller, wrapped in a single IIFE (`assets/js/main.js:7-8`), exposing no globals.
- Key files: `assets/js/main.js`
- Note: loaded by `portfolio-details.html:109` only. `index.html` loads no file from this directory.

**`assets/img/`:**
- Purpose: Site imagery.
- Contains: profile photos (`me.png`, `profile-img.jpg`), a favicon, an unused hero background, and an unused testimonial image set.
- Key files: `assets/img/me.png`, `assets/img/profile-img.jpg`
- Note: `assets/img/portfolio/` is referenced by `portfolio-details.html:53-61` but does not exist.

**`forms/`:**
- Purpose: Server-side endpoints.
- Contains: `forms/contact.php` and `forms/Readme.txt`.
- Note: GitHub Pages does not execute PHP; `forms/contact.php` additionally depends on `assets/vendor/php-email-form/php-email-form.php`, which is absent.

**`.vscode/`:**
- Purpose: Editor helper configuration.
- Contains: `launch.json` — a Chrome debug target pointing at `/Users/subhradip/Documents/GitHub/Website/index.html` (a macOS path that does not exist in this checkout; update it to `D:/Development/Website/index.html` before using it).
- Note: `.vscode/` is committed to git.

## Key File Locations

**Entry Points:**
- `index.html`: Site root (`/`). The landing page and the only page linked from anywhere. Owns the header, mobile overlay, all five content sections, and the footer.
- `portfolio-details.html`: `/portfolio-details.html`. Gallery/detail view. Not linked from any page and not listed in `sitemap.xml`.
- `forms/contact.php`: `/forms/contact.php`. POST endpoint; no form in the repo targets it.

**Configuration:**
- `index.html:19-34`: Inline `tailwind.config` — extends `colors.accent` (`#0ea5e9`), `colors.accent-hover` (`#0284c7`), `fontFamily.sans` (Inter), `fontFamily.display` (Outfit). This is the only Tailwind configuration in the repo.
- `index.html:11-17`: CDN dependency declarations for `index.html` (Tailwind Play CDN, Google Fonts, AOS 2.3.1 CSS, Font Awesome 6.4.0 CSS).
- `index.html:36-188`: Inline custom CSS block (component classes) — duplicates `assets/css/style.css`.
- `index.html:545-566`: Vendor script tags + the page's inline controller (AOS init, Typed.js, mobile menu).
- `portfolio-details.html:20-28`: Vendored CSS declarations (AOS, Bootstrap 5.1.3, bootstrap-icons, boxicons, GLightbox, Swiper) + `assets/css/style.css`.
- `portfolio-details.html:98-109`: Vendored script tags in dependency order + `assets/js/main.js`. Order matters.
- `assets/css/style.css:2-11`: `:root` design tokens — the canonical color/type scale (`--bg-primary`, `--bg-white`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--border`, `--card-shadow`).
- `CNAME`: GitHub Pages custom domain.
- `sitemap.xml`: Search-engine URL list.
- `google42d4a0a6e148cf47.html`: Search Console verification.
- `.vscode/launch.json`: Chrome debug launcher (stale path).

**Core Logic:**
- `assets/js/main.js`: All client-side component wiring — `select()`/`on()`/`onscroll()` helpers (`:13-42`), nav active-state (`:46-61`), `scrollto()` (`:66-72`), back-to-top (`:77-88`), mobile nav toggle (`:93-97`), anchor scrolling (`:102-115`), hash-on-load (`:120-126`), preloader removal (`:129-135`), Typed (`:141-152`), Waypoint skill bars (`:157-169`), Isotope filters (`:174-199`), GLightbox (`:204-215`), Swiper sliders (`:220-250`), AOS init (`:255-262`).
- `index.html:547-566`: The landing page's only controller — AOS init, Typed hero rotator, mobile-menu toggling.
- `data.json`: Content record for the profile (`about`, `ieee`, `education`, `languages`, `hobbies`, `publications`, `experience`, `certifications`).
- `forms/contact.php`: POST field mapping → `PHP_Email_Form` → `send()`.

**Content (hardcoded, not in `data.json`):**
- `index.html:222-242` — Hero (name, title, typed strings, social links, CV download link).
- `index.html:245-291` — `#about` section.
- `index.html:294-317` — `#skills` section (12 hardcoded skill pills).
- `index.html:335-367` — Experience timeline.
- `index.html:376-412` — Education timeline.
- `index.html:418-430` — Certifications card.
- `index.html:437-441` — Publications card.
- `index.html:447-462` / `:464-473` / `:475-483` — Hobbies, Languages, Availability cards.
- `index.html:487-500` — Soft Skills card.
- `index.html:505-528` — `#contact` section (mailto + Telegram; no form).

**Testing:**
- None. There is no test directory, no test runner, no CI configuration (`.github/` does not exist), and no linting or formatting configuration in the repository.

## Naming Conventions

**Files:**
- HTML pages: lowercase kebab-case with `.html` — `index.html`, `portfolio-details.html`.
- Root data/config files: lowercase — `data.json`, `sitemap.xml`.
- Public-domain files: exact token required by the provider — `CNAME`, `google42d4a0a6e148cf47.html`.
- CSS/JS: lowercase, single file per directory, no index — `assets/css/style.css`, `assets/js/main.js`.
- Images: kebab-case, role-prefixed — `me.png`, `profile-img.jpg`, `hero-bg.jpg`; numbered sets use a `-N` suffix — `testimonials-1.jpg` … `testimonials-5.jpg`.
- Vendor directories: lowercase library name, matching upstream layout — `aos/`, `bootstrap/`, `bootstrap-icons/`, `boxicons/`, `glightbox/`, `isotope-layout/`, `php-email-form/`, `purecounter/`, `swiper/`, `typed.js/`, `waypoints/`.
- Binary documents: `Firstname_Lastname_DOCUMENT.pdf` — `Subhradip_Debnath_CV.pdf`.

**Directories:**
- All lowercase; multi-word directories use kebab-case — `assets/vendor/isotope-layout/`, `assets/vendor/php-email-form/`.
- Asset type is encoded by the parent directory — `assets/css/`, `assets/js/`, `assets/img/`, `assets/vendor/`.
- Image sub-folders are plural topic names — `assets/img/testimonials/`, `assets/img/portfolio/`.

**CSS:**
- Class names: kebab-case semantic role — `nav-glass`, `nav-link`, `card-hover`, `skill-pill`, `timeline-line`, `timeline-dot`, `social-btn`, `profile-ring`, `btn-primary`, `btn-secondary`, `mobile-menu`, `section-label`, `section-title`, `section-desc`, `hero-gradient`, `card-modern`, `footer-gradient`, `social-icon`, `section-divider`, `animate-fade-up`.
- Custom properties: `--kebab-case` — `--bg-primary`, `--bg-white`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--border`, `--card-shadow`.
- Framework classes stay untouched and framework-prefixed in meaning: `container` / `row` / `col-lg-8` (Bootstrap), `max-w-6xl` / `mx-auto` / `px-6` (Tailwind).
- CSS is grouped by component with a `/* Component Name */` banner comment (`assets/css/style.css:37`, `:70`, `:84`, `:98`, `:117`, `:136`, `:170`, `:191`, `:216`, `:247`, `:263`).

**HTML:**
- Section ids are single lowercase words matching the nav link text — `about`, `skills`, `resume`, `contact`.
- Element ids are kebab-case — `menu-toggle`, `menu-close`, `mobile-menu`, `typed-text`, `main`, `preloader`.
- Hook classes are kebab-case and reused across pages — `mobile-link`, `scrollto`, `typed`, `back-to-top`, `nav-link`.
- `data-*` attributes are kebab-case — `data-aos`, `data-aos-delay`, `data-aos-duration`, `data-typed-items`, `data-filter`.

**JavaScript:**
- Variables/functions: camelCase — `navbarlinksActive`, `toggleBacktotop`, `portfolioContainer`, `mobileMenu`, `menuToggle` (inline script in `index.html` uses camelCase; the vendored `assets/js/main.js` mixes camelCase and lowercase).
- Strings: single quotes in `assets/js/main.js`; double quotes in `index.html`'s inline script.

**JSON (`data.json`):**
- Top-level keys: lowercase nouns matching section names — `active`, `about`, `ieee`, `education`, `languages`, `hobbies`, `publications`, `experience`, `certifications`.
- Array item fields: camelCase — `degree`, `specialization`, `university`, `school`, `cgpa`, `name`, `proficiency`, `credential`, `type`, `title`, `doi`, `role`, `company`, `duration`.
- Indentation: 4 spaces (differs from the 2-space HTML/CSS/JS).

## Where to Add New Code

This is a flat site with **no build step and no template engine**. There is no `src/`, no bundler, no module graph. Place new code exactly as follows.

**A new page (e.g. `projects.html`):**
1. Create the file at the **repository root** as `projects.html` (lowercase kebab-case). Do not create a `pages/` folder — the repo has no sub-page convention.
2. Copy the `<head>` block from `index.html:4-34` as the starting point (charset, viewport, `<title>`, meta description, Tailwind CDN + `tailwind.config`, Google Fonts, AOS CSS, Font Awesome). Change the `<title>` and `<meta name="description">`.
3. Copy the closing vendor script + inline controller block from `index.html:545-566`.
4. Use `assets/img/...` and `assets/css/style.css` paths; add `<link rel="stylesheet" href="assets/css/style.css">` so the page uses the token/theme layer rather than another inline style block.
5. Add the page to `sitemap.xml` as a `<url><loc>https://subhradip.xyz/projects.html</loc><loc>…</loc></url>` entry with a current `<lastmod>`.
6. Add a link to it from the header nav (`index.html:197-202`) **and** the mobile overlay menu (`index.html:210-218`) — the two lists are maintained separately.

**A new section on the landing page:**
1. Insert a new `<section id="new-section">` inside `<main>`, after the `#contact` section (`index.html:505-528`) and before `</main>` (`index.html:529`).
2. Give it `id="…"` (lowercase, matching the nav label) and the standard section scaffold: `<div class="max-w-6xl mx-auto px-6">` wrapper, a `<span class="section-label">` eyebrow, an `<h2 class="text-3xl md:text-4xl font-display font-semibold text-[#1a1a2e] mt-3">` title, and `data-aos="fade-up"` + `data-aos-delay="…"` on the animated children.
3. Add the matching anchor link to both the desktop `<nav>` (`index.html:197-202`) and the `.mobile-link` list (`index.html:214-217`).
4. If the section's content comes from `data.json`, add a matching top-level key to `data.json` AND write the markup in `index.html` — nothing renders the JSON automatically.

**A new script:**
- Logic that must run on **every** page (including `index.html`): create `assets/js/<name>.js` (lowercase kebab-case) and add `<script src="assets/js/<name>.js"></script>` in the `<head>` (with `defer`) or just before `</body>`. Do **not** put `index.html`-only logic in `assets/js/main.js` — `index.html` does not load that file.
- Logic that must run on **the Bootstrap template page only**: add it inside the `assets/js/main.js` IIFE, following the existing guard style (`if (select('.my-class')) { … }`).
- Interactive behavior needs a library: either a CDN `<script>` in the page `<head>`/`<body>` (matching `index.html`'s CDN-first style) or a vendored copy under `assets/vendor/<library>/`. Add the library to the vendor tree whole; never edit a vendored file.

**New styles:**
- Preferred: add the rule to `assets/css/style.css` and link that file from the page (`<link rel="stylesheet" href="assets/css/style.css">`).
- For a page that cannot link it (currently only `index.html`): the rule must go into the inline `<style>` block (`index.html:36-188`) — and be added to `assets/css/style.css` as well, otherwise the two files stay divergent.
- Use the `:root` tokens (`var(--accent)`, `var(--text-secondary)`, …) rather than raw hex, and add any new token to `assets/css/style.css:2-11`.
- Tailwind theme additions (new color, font family) go in the inline `tailwind.config` at `index.html:19-34` — there is no separate Tailwind config file.

**New images:**
- Put them in `assets/img/` with a kebab-case, role-prefixed name (`project-architecture.png`, `cert-aws.png`).
- A multi-image set goes in its own plural sub-folder: `assets/img/portfolio/`, `assets/img/testimonials/`.
- Reference them with `./assets/img/...` from `index.html` and `assets/img/...` from `portfolio-details.html` — match the file's existing prefix convention.
- Never reference a file that is not committed; `portfolio-details.html` currently 404s on four images because of this.

**New content data:**
- Add/change the fact in `data.json` (top-level lowercase key, camelCase item fields, 4-space indent) **and** in the corresponding hardcoded markup in `index.html`. Both must be updated in the same commit, because `data.json` is not read by any code.
- Long-form documents (CV, publications PDFs) belong at the repository root next to `Subhradip_Debnath_CV.pdf`, with the download link in `index.html:238` updated to point at the new file (currently it points at a Google Drive URL).

**A contact form:**
- Do not add a PHP endpoint to this repository — GitHub Pages does not execute PHP and `forms/contact.php` is already non-functional. Either keep the `mailto:`/`Telegram` links (`index.html:519-524`), or host the endpoint elsewhere and point the `<form action="https://…">` at that URL.
- If a client-side validator is needed, reuse the vendored `assets/vendor/php-email-form/validate.js` (already loaded by `portfolio-details.html:106`) and add the same `<script>` tag to `index.html`.

**A new vendor library:**
- Place it at `assets/vendor/<library-name>/` preserving the upstream folder layout (`css/`, `js/`, `fonts/`).
- Include the minified build and the license/header comment; commit source maps only if the upstream ships them (the Bootstrap, AOS, and Swiper entries here do).
- Add the corresponding `<link>`/`<script>` tags to the page that needs it, keeping `portfolio-details.html`'s script order intact (libraries before `assets/js/main.js`, because `main.js` calls their globals at load time).

**Never edit:**
- `assets/vendor/**` — replaced wholesale on upgrade.
- `forms/contact.php` — non-functional on the current host.

## Special Directories

**`assets/vendor/`:**
- Purpose: Committed third-party libraries (Bootstrap 5.1.3, AOS 2.3.1, Swiper, GLightbox, Isotope, Boxicons, bootstrap-icons, PureCounter, Typed.js, Waypoints, php-email-form validator).
- Generated: No — vendored by hand, but never hand-modified.
- Committed: Yes (74 files, ~11 MB — the bulk of the repository size).
- Note: `assets/vendor/php-email-form/` contains only `validate.js`; the `php-email-form.php` library it depends on is absent.

**`assets/img/testimonials/`:**
- Purpose: Five testimonial photos from the original template.
- Generated: No.
- Committed: Yes.
- Note: Unreferenced by any page — the testimonials Swiper in `assets/js/main.js:237-250` has no matching markup.

**`forms/`:**
- Purpose: PHP endpoint directory.
- Generated: No.
- Committed: Yes.
- Note: Served publicly as static files; PHP is not executed by GitHub Pages.

**`.vscode/`:**
- Purpose: Editor launch configuration.
- Generated: No.
- Committed: Yes.
- Note: Contains a stale macOS absolute path (`/Users/subhradip/Documents/GitHub/Website/index.html`).

**`.planning/`:**
- Purpose: GSD planning artifacts (roadmap, phases, codebase maps).
- Generated: Yes — by GSD tooling, not by hand.
- Committed: Tooling-dependent.

**Repository root as publish root:**
- Purpose: GitHub Pages serves the repository root of branch `github_pages` verbatim.
- Generated: No.
- Committed: Yes.
- Note: every file here is public — including `data.json`, `forms/`, and `Subhradip_Debnath_CV.pdf` once it is committed. There is no `.gitignore` and no `.nojekyll`.

---

*Structure analysis: 2026-11-21*
