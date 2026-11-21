---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
# Technology Stack

**Analysis Date:** 2026-11-21

## Languages

**Primary:**
- HTML5 - `index.html` (569 lines, single-page portfolio), `portfolio-details.html` (113 lines, template detail page)
- CSS3 - `assets/css/style.css` (265 lines, CSS custom-property theme), plus a 152-line inline `<style>` block in `index.html:36-188`
- JavaScript (ES6+) - `assets/js/main.js` (263 lines, IIFE module), plus inline `<script>` blocks in `index.html:547-566`

**Secondary:**
- PHP 7/8 - `forms/contact.php` (41 lines) — server-side mail handler; **not executed** on the GitHub Pages host (see Platform Requirements)
- JSON - `data.json` (111 lines) — static content manifest; **not loaded by any client-side code** (no `fetch()` reference anywhere in first-party files)
- XML - `sitemap.xml` (search-engine URL manifest)
- Shell-free config - `CNAME` (custom domain), `google42d4a0a6e148cf47.html` (Search Console verification token)

## Runtime

**Environment:**
- Browser-only. The published site is static HTML/CSS/JS served by GitHub Pages — no application runtime, no server process, no SSR.
- PHP 7.x/8.x is required **only** if `forms/contact.php` is exercised; the live host (GitHub Pages) does not execute PHP.

**Package Manager:**
- Not detected — there is no `package.json`, `composer.json`, `requirements.txt`, `go.mod`, or `Cargo.toml`.
- Lockfile: Not detected (no `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `composer.lock`).
- Dependency resolution is entirely manual: CDN URLs in HTML `<head>` and hand-copied files under `assets/vendor/`.

## Frameworks

**Core:**
- Tailwind CSS (CDN JIT build, `https://cdn.tailwindcss.com`) - Primary styling engine for `index.html`; compiles utilities in the browser at runtime. Configured inline at `index.html:20-34`.
- Bootstrap 5.1.3 (self-hosted) - Grid + components for `portfolio-details.html` only (`assets/vendor/bootstrap/css/bootstrap.min.css`, `assets/vendor/bootstrap/js/bootstrap.bundle.min.js`).
- BootstrapMade "MyResume" template v4.7.0 - Structural/visual base for `portfolio-details.html` and `assets/js/main.js`; attribution header at `portfolio-details.html:30-35` and `assets/js/main.js:1-6`.

**Testing:**
- Not detected — no test runner, no test files, no coverage configuration.

**Build/Dev:**
- Not detected — no bundler, transpiler, minifier, linter, or formatter. Files are hand-authored and committed as-is.
- VS Code Chrome debugger config: `.vscode/launch.json` (launches `index.html`; contains a hardcoded macOS absolute path).

## Key Dependencies

**Critical (CDN-loaded in `index.html`):**
- Tailwind CSS (CDN, unversioned) - `index.html:11`. Ships the JIT compiler to the client; a CDN outage or Tailwind v4 CDN breaking change alters the whole layout. Configured inline at `index.html:20-34` (`accent: #0ea5e9`, `accent-hover: #0284c7`, `font-sans: Inter`, `font-display: Outfit`).
- Font Awesome 6.4.0 - `index.html:17` (cdnjs). Source of every `fas fa-*` / `fab fa-*` icon in `index.html`.
- AOS 2.3.1 - `index.html:15` (CSS) and `index.html:545` (JS) from unpkg. Scroll-reveal animations; initialised at `index.html:548`.
- typed.js 2.0.12 - `index.html:546` (jsDelivr). Hero typewriter effect; instantiated at `index.html:550-556`.
- Google Fonts - `index.html:14`. Inter (400/500/600) and Outfit (500/600/700), preconnected at `index.html:12-13`.

**Self-hosted (vendored under `assets/vendor/`, used by `portfolio-details.html`):**
- Bootstrap 5.1.3 - CSS grid/reboot/utilities + `bootstrap.bundle.min.js` (includes Popper)
- Bootstrap Icons - version not embedded in the vendored files (`assets/vendor/bootstrap-icons/`); CSS + woff/woff2 fonts
- Boxicons - version not embedded in the vendored files (`assets/vendor/boxicons/`)
- GLightbox 3.1.1 - lightbox for portfolio galleries
- Swiper 7.3.0 - sliders (portfolio details, testimonials)
- Isotope 3.0.6 - portfolio filter/grid layout
- PureCounter 1.1.4 - animated counters
- Waypoints 4.0.1 - scroll-trigger hooks
- typed.js - vendored copy (`assets/vendor/typed.js/`); the `index.html` page instead uses the CDN 2.0.12 copy
- AOS - vendored copy (`assets/vendor/aos/`); the `index.html` page instead uses the CDN 2.3.1 copy
- PHP Email Form validator 3.2 - `assets/vendor/php-email-form/validate.js`, client-side AJAX submission + optional reCAPTCHA hook

**Infrastructure:**
- Not applicable — no backend, database, queue, cache, or object-storage service is referenced by the site.

## Configuration

**Environment:**
- No environment variables, `.env` file, or runtime config are used by the static site — Not detected.
- The PHP mail handler hardcodes its recipient in source: `forms/contact.php:10` (`$receiving_email_address = 'debnath.subhradip@gmail.com'`). No secret is present in the repository.
- Tailwind theme tokens are declared inline in `index.html:20-34` rather than in a `tailwind.config.js` file.
- CSS design tokens are declared as custom properties in `assets/css/style.css:1-12` (`--bg-primary`, `--text-primary`, `--text-secondary`, `--accent`, `--accent-hover`, `--border`, `--card-shadow`). These duplicate the values hardcoded in the inline `<style>` block at `index.html:36-188`.

**Build:**
- Not detected — no `Makefile`, no build script, no CI workflow, no `_config.yml`, no `.nojekyll` file.

**Domain / Deployment metadata:**
- `CNAME` - `subhradip.xyz`, the GitHub Pages custom domain.
- `sitemap.xml` - single-URL sitemap for `https://subhradip.xyz/`, `lastmod` `2021-12-25T12:30:16+00:00` (stale relative to the current content).
- `google42d4a0a6e148cf47.html` - Google Search Console site-verification token file.

**Repo hygiene:**
- `.gitignore` - Not detected. `assets/vendor/` (source maps, `*.svg` sprite fonts, `index.html` demo pages) is committed in full.

## Platform Requirements

**Development:**
- Any static file server is sufficient; no specific tooling is mandated by the repo.
- PHP 7.4+/8.x with `mail()` (or an SMTP transport) is needed to exercise `forms/contact.php` locally.
- VS Code is assumed for the Chrome debug profile in `.vscode/launch.json` (its `file` path points to `/Users/subhradip/Documents/GitHub/Website/index.html` and must be edited per machine).
- No dependency installation step — clone and serve.

**Production:**
- GitHub Pages, served from branch `github_pages` of `git@github.com:debnathsubhradip/Website.git`, with the custom domain `subhradip.xyz` declared in `CNAME`.
- GitHub Pages runs Jekyll by default and there is no `.nojekyll` marker; only files/directories beginning with `_` are excluded by that pipeline, so `assets/` and `forms/` are published as-is.
- **PHP is not executed by GitHub Pages.** `forms/contact.php` is published as source text and is non-functional in production; a PHP-capable host (or a serverless mail proxy) would be required for the form path.
- No CDN/proxy layer, no caching headers, and no CI pipeline are configured in the repository.

---

*Stack analysis: 2026-11-21*
