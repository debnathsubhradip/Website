---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
# Codebase Concerns

**Analysis Date:** 2026-11-21

Scope: full repository at `D:/Development/Website` (branch `github_pages`). Live site verified at `https://subhradip.xyz/` (GitHub Pages → Fastly → Cloudflare). All findings below are evidence-backed with file paths and line numbers; CDN byte counts were measured, not estimated.

Severity legend used throughout: **Critical** / **High** / **Medium** / **Low**.

---

## Tech Debt

### Tailwind Play CDN ships a runtime CSS compiler to production

- **Issue:** `index.html:11` loads `https://cdn.tailwindcss.com` — the Tailwind *Play CDN*, which is a browser-side JIT compiler that parses the DOM and generates CSS at runtime. The bundle measures **407,279 bytes raw / 123,340 bytes gzip** and self-reports `cdn.tailwindcss.com should not be used in production` in its own source. The URL is **unversioned** (`cdn.tailwindcss.com` has no `@3.x` pin), so upstream can change the payload without any repo change.
- **Files:** `index.html:11`, inline config `index.html:19-34`
- **Impact:**
  - ~120 KB gzip of render-blocking JavaScript on the critical path for a page whose entire body is 28 KB.
  - The compiler runs after DOM parse, so the page paints unstyled and then restyles → **FOUC** (visible layout shift on every cold load).
  - Zero CSS caching: the generated stylesheet is recomputed on every visit and cannot be cached as a static asset the way a compiled `main.css` could be.
  - If the CDN is unreachable (corporate proxy, ad-blocker, regional block), the page renders **completely unstyled** — Tailwind utility classes carry no fallback CSS.
- **Fix approach:** Install Tailwind CLI as a dev dependency, move the `tailwind.config` object into a real `tailwind.config.js`, add a `content` glob covering `index.html` / `portfolio-details.html`, compile to `assets/css/tailwind.css`, and replace `index.html:11` with `<link rel="stylesheet" href="assets/css/tailwind.css">`. Expected output: ~10–20 KB gzip of plain CSS, no runtime JS, no FOUC. The inline `<style>` block at `index.html:36-188` should be folded into the same build via `@layer components`.

### Two parallel styling systems that have already drifted apart

- **Issue:** `index.html:36-188` carries a 153-line inline `<style>` block; `assets/css/style.css` (266 lines) carries a second copy of the same design system using CSS custom properties. **Ten selectors are defined in both places** — `.nav-glass`, `.nav-link`, `.profile-ring`, `.skill-pill`, `.timeline-line`, `.timeline-dot`, `.btn-primary`, `.section-label`, `.mobile-menu`, `.animate-fade-up` — and their values have diverged:

  | Property | `index.html` inline | `assets/css/style.css` |
  |---|---|---|
  | `.btn-primary` padding | `14px 28px` (`:132`) | `14px 32px` (`:140`) |
  | `.btn-primary:hover` transform | `translateY(-2px)` (`:143`) | `translateY(-1px)` (`:151`) |
  | `.btn-primary:hover` shadow | `rgba(14,165,233,0.3)` (`:145`) | `rgba(14,165,233,0.25)` (`:152`) |
  | `.section-label` letter-spacing | `0.12em` (`:176`) | `0.1em` (`:174`) |
  | `.timeline-dot` border color | `#fafbfc` (`:101`) | `var(--bg-primary)` (`:132`) |

  Additionally `index.html` never loads `assets/css/style.css` at all — the stylesheet is only reachable from `portfolio-details.html:28`, which is an orphan page. Eight classes in `style.css` (`.card-modern`, `.btn-secondary`, `.section-title`, `.section-desc`, `.footer-gradient`, `.social-icon`, `.hero-gradient`, `.section-divider`) are referenced **zero** times in either HTML file.
- **Files:** `index.html:36-188`, `assets/css/style.css:1-266`, `portfolio-details.html:28`
- **Impact:** Editing the wrong copy silently changes nothing on the live page; editing the right one changes the wrong page. Every future style change has a 50% chance of landing in dead code.
- **Fix approach:** Delete the inline `<style>` block from `index.html` and load `assets/css/style.css` instead, then reconcile the values above in favour of `style.css` (it is the more complete, variable-driven copy). Purge the eight unused classes from `style.css`.

### Two competing framework stacks, one of them orphaned

- **Issue:** The repo ships a full BootstrapMade "MyResume v4.7.0" stack (`assets/vendor/` = **11.0 MB**, 74 files) used only by `portfolio-details.html`, while `index.html` uses a completely different stack (Tailwind CDN + Font Awesome + AOS + typed.js from CDNs). `portfolio-details.html` is not linked from `index.html` (`grep -c "portfolio-details" index.html` → **0**), is not listed in `sitemap.xml`, and contains BootstrapMade placeholder content ("ASU Company", "www.example.com", lorem ipsum at `portfolio-details.html:73-83`).
- **Files:** `portfolio-details.html:1-113`, `assets/vendor/**`, `assets/js/main.js:1-264`
- **Impact:** 10.0 MB of the 11.0 MB vendor tree (59 of 74 files) is dead weight — see "Dependencies at Risk". A visitor to `index.html` never requests a single byte of it.
- **Fix approach:** Decide whether `portfolio-details.html` ships. Either (a) delete it and prune `assets/vendor/` down to nothing (the landing page uses zero vendored assets), or (b) rewrite it as a real project detail page in the Tailwind/FA design system and link it from the landing page.

### `data.json` is an orphaned, stale duplicate of content already hardcoded in `index.html`

- **Issue:** `data.json` (111 lines, 3,887 bytes) is a structured copy of the résumé content — `about`, `ieee`, `education`, `languages`, `hobbies`, `publications`, `experience`, `certifications`. **No file in the repo fetches it.** Verified: `grep -rn "data\.json"` across the whole tree returns zero matches, and there is no `fetch()` / `XMLHttpRequest` in any first-party script.
- **Explicit note on the XSS question:** because `data.json` is never loaded, **there is no DOM-injection sink today** — no `innerHTML`, `insertAdjacentHTML`, or `document.write` exists in any first-party code (the only `innerHTML` calls in the repo are inside `assets/vendor/glightbox/js/glightbox.js` and `assets/vendor/typed.js/typed.js`). The real risk is **content drift**, not script injection.
- **Content drift is already present:**
  - `data.json:7-12` declares IEEE membership and `subhradip@ieee.org` — **absent from `index.html`** (0 matches for "IEEE").
  - `data.json:86-89` lists a "Campus Manager, Geeks for Geeks" role — **absent from `index.html`**.
  - `index.html:392-393` lists "Major in Artificial Intelligence — IIT Ropar" — **absent from `data.json`**.
  - `index.html` renders certifications as prose (`:424-428`); `data.json:97-109` holds them as a list of 11 differently-named entries. The two lists do not map 1:1.
  - `data.json:2` and `data.json:8` use the **string** `"true"` rather than the boolean `true` — sloppy typing for any future consumer.
- **Files:** `data.json:1-111`, `index.html:244-502`
- **Impact:** Two sources of truth for the same résumé, already inconsistent. A future maintainer who edits `data.json` sees no change on the live site.
- **Fix approach:** Pick one source of truth. Either delete `data.json` (simplest — the HTML already renders correctly), or make the HTML a rendering target for it, in which case fetch it, render with `textContent`/`createElement` (never `innerHTML`), and validate the shape first.

### No build step, no dependency manifest, no lockfile

- **Issue:** The repository has no `package.json`, no lockfile, no `requirements.txt`, no `Makefile`, and no CI workflow directory (`.github/` does not exist). Every dependency is either a raw CDN URL inside HTML or a hand-copied file under `assets/vendor/`. There is no machine-readable record of which library version is in use.
- **Files:** repo root; `index.html:11-17`, `index.html:545-546`; `assets/vendor/**`
- **Impact:** No way to run `npm audit`, no way to detect a compromised CDN asset, no reproducible local environment, and updates are manual edits to HTML.
- **Fix approach:** Introduce a minimal `package.json` with `tailwindcss` as the only dependency, commit `package-lock.json`, and add a GitHub Actions workflow that builds the CSS and runs an HTML/link check on every push to `github_pages`.

### `index.html` is a 569-line monolith with everything inlined

- **Issue:** `index.html` (28,471 bytes, 569 lines) contains the Tailwind config (`:19-34`), 153 lines of CSS (`:36-188`), the entire document (`:191-543`), and 20 lines of JavaScript (`:547-566`) — plus three separate CDN `<script>` tags. There is no separation between page structure, styling, and behaviour.
- **Files:** `index.html:1-569`
- **Impact:** A single-file site has no partials, so any shared element (nav, footer, social links) is copy-pasted — and the two existing pages have **already diverged** on those shared elements (see below).
- **Fix approach:** Even without a framework, extract the inline `<style>` into `assets/css/style.css`, the inline `<script>` into `assets/js/site.js`, and keep `index.html` as markup only.

### Shared page shell has diverged between the two HTML files

- **Issue:** The two pages were forked from the same BootstrapMade template and now disagree on every shared concern:

  | Concern | `index.html` | `portfolio-details.html` |
  |---|---|---|
  | Fonts | Inter + Outfit (`:14`) | Open Sans + Raleway + Poppins (`:17`) |
  | AOS config | `{duration:800, once:true, offset:50}` (`:548`) | `{duration:1000, easing:'ease-in-out'}` (`assets/js/main.js:256-261`) |
  | typed.js target | `#typed-text` + `new Typed(...)` (`:550-556`) | `.typed` + `data-typed-items` (`assets/js/main.js:141-152`) |
  | Charset casing | `charset="UTF-8"` (`:5`) | `charset="utf-8"` (`:5`) |
  | Nav / footer | Present (`:194-218`, `:532-543`) | **Absent entirely** |
  | Icon system | Font Awesome `<i class="fas fa-…">` | Bootstrap Icons `<i class="bi bi-…">` (`:95`) |

  `index.html` also defines `.card-hover` (`:68-75`) and `.social-btn` (`:105-123`) inline, while `style.css` defines `.social-icon` (`:196-214`) for the same purpose — two names, two hover behaviours, no relation.
- **Files:** `index.html:1-569`, `portfolio-details.html:1-113`, `assets/js/main.js:141-152`, `assets/js/main.js:255-262`
- **Impact:** Any future page added to the site will pick one of two conventions at random, and there is no mechanism to keep them in sync.
- **Fix approach:** Extract nav, footer, and the icon conventions into one source. Without a build step, the simplest honest fix is to delete `portfolio-details.html` and standardise on the `index.html` conventions.

### `assets/js/main.js` is ~95% dead code on the only page that loads it

- **Issue:** `assets/js/main.js` (264 lines, BootstrapMade template) is loaded only by `portfolio-details.html:109`. Every one of its DOM hooks is absent from both pages:

  | Selector in `main.js` | Line | Matches in repo |
  |---|---|---|
  | `#navbar .scrollto` | `:46` | 0 |
  | `.scrollto` | `:102` | 0 |
  | `.mobile-nav-toggle` | `:93` | 0 |
  | `.skills-content` | `:157` | 0 |
  | `.portfolio-container` | `:175` | 0 |
  | `.portfolio-lightbox` | `:204` | 0 |
  | `.portfolio-details-lightbox` | `:211` | 0 |
  | `.testimonials-slider` | `:237` | 0 |
  | `.typed` | `:141` | 0 |
  | `#preloader` | `:131` | 1 (`portfolio-details.html:94`) |

  Additionally `portfolio-details.html:106` loads `assets/vendor/php-email-form/validate.js`, but there is **no `<form>` element anywhere in the repo** (`grep -c "<form"` → 0), so that script can never initialise.
- **Files:** `assets/js/main.js:1-264`, `portfolio-details.html:106-109`
- **Impact:** 6,281 bytes of JavaScript executed on every `portfolio-details.html` visit that produces no observable behaviour; a maintenance surface with no tests and no callers.
- **Fix approach:** Delete `assets/js/main.js` along with `portfolio-details.html`, or replace it with a purpose-written script for the markup that actually exists.

### Missing repository hygiene files

- **Issue:** The public repository has no `.gitignore`, no `.gitattributes`, no `README.md`, no `LICENSE`, no `CONTRIBUTING.md`, no `robots.txt`, and no `404.html`.
- **Files:** repo root (all confirmed absent via `git ls-tree -r --name-only HEAD`)
- **Impact:**
  - **No `.gitignore`** → the untracked `Subhradip_Debnath_CV.pdf` at the repo root is one `git add .` away from being published (see "Security Considerations").
  - **No `.gitattributes`** → line endings are governed by each machine's `core.autocrlf` rather than the repo. The local clone has `core.autocrlf=true`, so the working tree is CRLF (e.g. `forms/contact.php` = 1,349 bytes on disk) while the committed blob is LF (1,308 bytes, matching the deployed `etag: W/"69e1e618-51c"`). Two developers on different settings will produce noisy diffs and can accidentally commit a CRLF blob.
  - **No LICENSE** → the vendored BootstrapMade template (`portfolio-details.html:30-35`, `assets/js/main.js:1-6`) is MIT-licensed and the BootstrapMade attribution is present, but the repository itself grants no rights and includes a copy of a third-party template with a separate commercial license note (`forms/Readme.txt`).
  - **No README** → no onboarding, no local-preview instructions, no statement of what `forms/` and `data.json` are for.
- **Fix approach:** Add `.gitignore` (ignoring `*.pdf` at root, `.DS_Store`, `node_modules/`, `dist/`), `.gitattributes` (`* text=auto eol=lf`, `*.png binary`, `*.jpg binary`), a `README.md` describing the site and its deploy flow, and a `LICENSE`.

### Editor config is machine-specific and hardcoded to a macOS path

- **Issue:** `.vscode/launch.json:9` contains an absolute path to a macOS home directory: `"file": "/Users/subhradip/Documents/GitHub/Website/index.html"`. The "Open index.html" debug configuration therefore fails for every contributor except the original author, and on this Windows checkout.
- **Files:** `.vscode/launch.json:1-14`
- **Impact:** Trivial functionally, but it signals the absence of any onboarding setup and it is the kind of file that should not be committed at all.
- **Fix approach:** Use a relative path (`"file": "${workspaceFolder}/index.html"`) or delete `.vscode/` from the repo and add it to `.gitignore`.

### Hardcoded copyright year

- **Issue:** `index.html:541` hardcodes `&copy; 2026 Subhradip Debnath. All rights reserved.`
- **Files:** `index.html:541`
- **Impact:** Becomes wrong on 1 January each year and requires a manual edit forever.
- **Fix approach:** Inject the year with a one-line script, or accept the manual edit and note it in the README.

---

## Known Bugs

### The contact form endpoint is dead — its required library is not in the repository

- **Symptoms:** `forms/contact.php:12-16` includes `../assets/vendor/php-email-form/php-email-form.php`. That file **does not exist** — `assets/vendor/php-email-form/` contains only `validate.js`. The include therefore fails and the script executes `die( 'Unable to load the "PHP Email Form" Library!' )` at line 15.
- **Files:** `forms/contact.php:12-16`, `assets/vendor/php-email-form/` (only `validate.js` present)
- **Trigger:** Any POST to `/forms/contact.php`.
- **Live confirmation:** `https://subhradip.xyz/assets/vendor/php-email-form/php-email-form.php` → **HTTP 404**.
- **Secondary problem:** even if the library were restored, **no `<form>` element exists in the repo** (`grep -c "<form" index.html portfolio-details.html` → 0). The contact section (`index.html:504-528`) is mailto + Telegram links only. The PHP endpoint is not wired to any markup.
- **Workaround:** None currently; the site directs visitors to `mailto:contact@subhradip.xyz` (`index.html:236`, `:519`).
- **Fix approach:** Either delete `forms/` entirely (the site has no server-side runtime — GitHub Pages does not execute PHP), or move the form to a serverless/static-hosting-compatible service (Formspree, Cloudflare Pages Functions, Netlify Forms) and remove the PHP file.

### The PHP source is published as a downloadable file

- **Symptoms:** GitHub Pages does not execute PHP. It serves the file as a static asset with the MIME type `application/x-httpd-php`.
- **Live confirmation:** `curl -I https://subhradip.xyz/forms/contact.php` returns `200 OK` with `Content-Type: application/x-httpd-php` and `etag: W/"69e1e618-51c"` — the `0x51c` (1,308) byte length matches the committed `forms/contact.php` blob exactly, i.e. the **source code is retrievable verbatim**.
- **Files:** `forms/contact.php:1-41`
- **Impact:** Low-severity information disclosure — the file contains the receiving mailbox `debnath.subhradip@gmail.com` (`forms/contact.php:10`) and the library-path structure. No credentials are present in the file.
- **Fix approach:** Remove `forms/` from the deployed branch (or add it to a Jekyll `exclude` list), and serve the form from a host that actually executes PHP.

### `portfolio-details.html` references five assets that do not exist

- **Symptoms:** Every asset URL in that page was deleted from the repo in commit `afca9f1` ("files updated. new website updated") but the markup was never updated. Confirmed missing on disk:

  | Missing file | Referenced at |
  |---|---|
  | `assets/img/favicon.png` | `portfolio-details.html:13` |
  | `assets/img/apple-touch-icon.png` | `portfolio-details.html:14` |
  | `assets/img/portfolio/portfolio-details-1.jpg` | `portfolio-details.html:53` |
  | `assets/img/portfolio/portfolio-details-2.jpg` | `portfolio-details.html:57` |
  | `assets/img/portfolio/portfolio-details-3.jpg` | `portfolio-details.html:61` |

- **Files:** `portfolio-details.html:13-14`, `portfolio-details.html:53-61`
- **Trigger:** Any visit to `https://subhradip.xyz/portfolio-details.html` — confirmed **HTTP 200**, so the page is live and publicly indexable with three broken images (all with `alt=""`) and two 404 favicon requests.
- **Workaround:** None.
- **Fix approach:** Delete the page, or restore real images with meaningful `alt` text.

### `portfolio-details.html` has no `<h1>`

- **Symptoms:** The page's heading hierarchy starts at `<h3>` ("Project information", `portfolio-details.html:71`). `grep -c "<h1" portfolio-details.html` → **0**.
- **Files:** `portfolio-details.html:70-84`
- **Impact:** Screen-reader users get no page-level heading; search engines get no primary heading signal.
- **Fix approach:** Add an `<h1>` with the project name, or delete the page.

### `portfolio-details.html` loads `style.css` after Bootstrap, silently overriding Bootstrap's components

- **Symptoms:** `portfolio-details.html:21` loads `bootstrap.min.css`; `:28` loads `assets/css/style.css` **after** it. `style.css` redefines `.btn-primary` (`:137-153`), which Bootstrap also defines, and sets `body { font-family: 'Inter', …; background: var(--bg-primary) }` (`:17-22`) overriding Bootstrap's body defaults.
- **Files:** `portfolio-details.html:21`, `portfolio-details.html:28`, `assets/css/style.css:17-22`, `assets/css/style.css:137-153`
- **Trigger:** Currently latent — the page contains no `.btn-primary` element. It becomes a visible defect the moment anyone adds a Bootstrap button to that page.
- **Fix approach:** Consolidate to a single design system (see Tech Debt above).

### Published `data.json` exposes an unlinked email address

- **Symptoms:** `https://subhradip.xyz/data.json` returns **HTTP 200** with `Content-Type: application/json` and the full file body, including `data.json:11` `"contact": "subhradip@ieee.org"`.
- **Files:** `data.json:7-12`
- **Impact:** Low — a professional membership contact address is public information — but the file is published while serving no purpose on the site.
- **Fix approach:** Delete `data.json` or remove the `ieee` block.

### `sitemap.xml` `lastmod` is four years stale and omits a live page

- **Symptoms:** `sitemap.xml` declares `<lastmod>2021-12-25T12:30:16+00:00</lastmod>` while the site's actual content was last changed in commit `86cbcd9` (April 2026). It also lists only the root URL, not `portfolio-details.html` — which is nonetheless live and returns HTTP 200.
- **Files:** `sitemap.xml:11-14`
- **Impact:** Search engines receive a misleading freshness signal, and the orphan page is outside the declared sitemap.
- **Fix approach:** Update `lastmod` on each content change, or drop the field. Add `portfolio-details.html` if the page is kept; remove the page if not.

### No custom 404 page

- **Symptoms:** `https://subhradip.xyz/404.html` → **HTTP 404** with the GitHub Pages default error page. There is no `404.html` in the repo.
- **Files:** repo root (absent)
- **Impact:** Any mistyped URL, or a crawler hitting a stale link, drops the visitor on a generic page with no navigation back into the site.
- **Fix approach:** Add a `404.html` that mirrors the landing page's header/footer and offers the four section anchors.

---

## Security Considerations

### No Subresource Integrity on any third-party script or stylesheet

- **Risk:** All five external resources are loaded without `integrity` / `crossorigin` attributes. Verified: `grep -rn "integrity=\|crossorigin=" index.html portfolio-details.html` → **no matches**.
- **Files:**
  - `index.html:11` — `https://cdn.tailwindcss.com` (JS, **unversioned**)
  - `index.html:15` — `https://unpkg.com/aos@2.3.1/dist/aos.css` (CSS)
  - `index.html:17` — `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` (CSS)
  - `index.html:545` — `https://unpkg.com/aos@2.3.1/dist/aos.js` (JS)
  - `index.html:546` — `https://cdn.jsdelivr.net/npm/typed.js@2.0.12` (JS)
- **Current mitigation:** None in-repo. The site is served through **Cloudflare** (confirmed: `Server: cloudflare`, `cf-cache-status: DYNAMIC`, `CF-RAY` header on every response), which provides edge WAF/DDoS protection but **does not add SRI** — SRI is a browser-enforced attribute that must be present in the markup.
- **Impact assessment (Medium, honestly scoped):** the site currently carries no session, no cookie, no auth, and no user data — a CDN compromise would let an attacker rewrite the page (defacement, phishing clones of the CV download, credential-harvesting overlays), but would not directly exfiltrate anything from the visitor. The risk escalates sharply the moment the site gains a working contact form: `forms/contact.php` posts to it, and a compromised `cdn.jsdelivr.net` script would be able to intercept the submitted name, email, and message.
- **Recommendations:**
  1. Add `integrity="sha384-…"` + `crossorigin="anonymous"` to the four *pinned* resources (AOS CSS/JS, Font Awesome CSS, typed.js). Compute the digests with `openssl dgst -sha384 -binary <file> | openssl base64 -A`.
  2. `cdn.tailwindcss.com` cannot get a meaningful SRI because the payload is unversioned and mutable — this is another reason to compile Tailwind locally (which removes the CDN entirely and makes the page fully self-contained).
  3. Add a restrictive `Content-Security-Policy` at the Cloudflare layer (e.g. `default-src 'self'; script-src 'self' 'sha256-…'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com`). Note the `unsafe-inline` requirement is caused by the inline `<style>` and inline `<script>` blocks — moving them to files removes that need.

### `forms/contact.php` uses raw `$_POST` values in email header fields

- **Risk:** `forms/contact.php:22-24` assigns `$_POST['name']`, `$_POST['email']`, and `$_POST['subject']` straight into `$contact->from_name`, `$contact->from_email`, and `$contact->subject`, and `:36-38` passes `$_POST['name']`, `$_POST['email']`, `$_POST['message']` into `$contact->add_message(...)`. **No `filter_input`, `htmlspecialchars`, `filter_var`, `trim`, `strip_tags`, or length check is applied in this file.** `from_email` and `subject` become mail headers, so unsanitised CRLF sequences in a field would be a header-injection vector if the transport does not sanitise them.
- **Current mitigation — and this is the important part:** the file `die()`s at **line 15**, before any of lines 22-38 are reached, because the required `php-email-form.php` library is absent from the repository. The BootstrapMade library that would normally perform this sanitisation and validation **is not vendored here**, so the code path cannot execute. Additionally the endpoint runs on GitHub Pages, which does not execute PHP at all.
- **Honest severity: Low today / latent by design.** This is a *latent* risk, not a live vulnerability. It becomes live the moment someone (a) vendors the library and (b) points the domain at a PHP host.
- **Also latent, and worth fixing regardless:**
  - `$_POST['name']` etc. are read with no `isset()` / `array_key_exists()` guard → on PHP 8 a missing field raises `Undefined array key` warnings; with `display_errors=On` those warnings leak absolute server paths.
  - **No CSRF token.** The endpoint accepts unauthenticated POSTs from any origin.
  - **No rate limiting and no honeypot.** Once live, it becomes an open relay for spam to `debnath.subhradip@gmail.com`, and a way to launder spam through the site's IP reputation.
  - **No email validation.** `$_POST['email']` is passed straight through as the `From` address; without `filter_var(..., FILTER_VALIDATE_EMAIL)` the field is fully attacker-controlled, which is the classic "spoofed From" mail-abuse vector.
- **Recommendations (in priority order):**
  1. **Delete `forms/contact.php` and `forms/Readme.txt` from the deployed branch.** The site is static; the file cannot work and publishing it exposes its source.
  2. If a form is genuinely wanted, use a static-hosting-compatible form service (Formspree / Cloudflare Pages Functions / Netlify Forms) — that removes PHP, mail(), and the whole header-injection class from the repo.
  3. If PHP must stay: add `filter_input` + `filter_var` validation, `trim`/`strip_tags` on all free-text fields, strip `\r`/`\n` from any header-bound field, a CSRF token, a rate limiter, and a honeypot field.

### Personal CV document sits untracked at the repository root with no `.gitignore`

- **Risk:** `Subhradip_Debnath_CV.pdf` (151,637 bytes) exists at the repository root and is **untracked** — `git status --porcelain` reports `?? Subhradip_Debnath_CV.pdf`. Because there is no `.gitignore`, a routine `git add .` / `git commit -am "update CV"` will commit and publish it. It is a personal document containing home address, phone number, date of birth, and parents' names.
- **Current mitigation:** It is not committed, so it is **not currently deployed** — `https://subhradip.xyz/Subhradip_Debnath_CV.pdf` returns **HTTP 404**, confirmed. The site's "Download CV" button instead links to a Google Drive file (`index.html:238`).
- **Related exposure in history:** earlier CV documents **are** permanently in the git history and have already been pushed to GitHub — `CURRICULUM VITAE.pdf`, `Documents/CURRICULUM VITAE.pdf`, `curriculum_vitae.pdf`, and `wp-content/uploads/2020/08/CURRICULUM-VITAE.pdf` all appear in `git log --all --name-only`. Anyone who clones the repository can retrieve them, and GitHub's public commit view exposes them to anyone.
- **Fix approach:**
  1. Add `.gitignore` with `*.pdf` (root-level), `Subhradip_Debnath_CV.pdf`, `.DS_Store`, `node_modules/` immediately.
  2. Decide deliberately whether the CV should be a published asset — if yes, host it in `assets/` with an intentional name and link it locally; if no, keep it outside the repository entirely.
  3. The already-published historical CVs cannot be removed by a normal commit. If their exposure matters, rewrite history (`git filter-repo --path <path> --invert-paths`) and force-push, or accept it and rotate any sensitive detail they contain. Note the old `wp-content/uploads/2020/08/CURRICULUM-VITAE.pdf` was published on a public WordPress install and may also be cached by third parties.

### Third-party code injected at the CDN edge is not in the repository

- **Risk:** The live HTML served at `https://subhradip.xyz/` contains two scripts that **do not exist in the repo**:
  - `/cdn-cgi/scripts/…/email-decode.min.js` — Cloudflare email obfuscation, which rewrites `mailto:contact@subhradip.xyz` (`index.html:236`, `:519`) into `/cdn-cgi/l/email-protection#…` at runtime.
  - `https://static.cloudflareinsights.com/beacon.min.js/…` — Cloudflare Web Analytics.
- **Impact:** The repository is not the complete description of what executes in a visitor's browser. Cloudflare's email-decode rewrite also means the "Say Hello" / envelope mailto links **break entirely if that script is blocked** — the `href` in the served HTML points at a relative Cloudflare endpoint, not a `mailto:`.
- **Fix approach:** Document the Cloudflare configuration in the README. If the mailto must survive script-blocking, disable Cloudflare's email obfuscation for the site (Cloudflare Dashboard → Scrape Shield → Email Address Obfuscation) or use a `mailto:` that Cloudflare does not rewrite.

### `target="_blank"` links omit `rel="noopener noreferrer"`

- **Risk:** 11 links across `index.html` open in a new tab without `rel="noopener noreferrer"` (e.g. `index.html:233`, `:234`, `:235`, `:238`, `:438-440`, `:522`, `:537-539`).
- **Current mitigation:** All current evergreen browsers imply `noopener` for `target="_blank"`, so the classic reverse-tabnabbing attack is effectively neutralised today. It remains a lint-level defect and a real risk if the site is ever rendered inside an older WebView.
- **Fix approach:** Add `rel="noopener noreferrer"` to every `target="_blank"` anchor.

### No `.env` file and no secrets in the repository

- **Verified:** no `.env`, `*.env`, `credentials.*`, `secrets.*`, `*.pem`, `*.key`, or similar files exist. The only credential-adjacent item is the commented-out SMTP placeholder at `forms/contact.php:27-34`, which contains no real values. Nothing in this document quotes secret material.

---

## Performance Bottlenecks

### 407 KB of runtime CSS compiler on the critical path

- **Problem:** `index.html:11` loads the Tailwind Play CDN — measured **407,279 bytes raw / 123,340 bytes gzip** — as a render-blocking classic script in `<head>`.
- **Files:** `index.html:11`
- **Cause:** No compile step; Tailwind is used purely through its browser runtime.
- **Improvement path:** Compile with the Tailwind CLI. The site's actual utility usage is modest (roughly 200 distinct classes), so a compiled stylesheet should land at **~10–20 KB gzip** — a ~100 KB gzip reduction on the critical path and the complete elimination of the FOUC.

### Font Awesome ships seven font families for two that are used

- **Problem:** `index.html:17` loads `all.min.css` (**18,752 bytes gzip**), which declares 7 `@font-face` families. The page only ever uses `fas` (solid) and `fab` (brands) — 29 `<i class="fas fa-…">` / `fab fa-…` glyph elements and zero `far`, `fal`, `fat`, `fad`, or `fa` (v4 compat).
- **Files:** `index.html:17`
- **Cause:** `all.min.css` is the convenience bundle.
- **Improvement path:** Load `fontawesome.min.css` restricted to the solid + brands subsets, or self-host only `fa-solid-900.woff2` (150,124 bytes) and `fa-brands-400.woff2` (108,020 bytes). A subset build containing only the ~29 glyphs actually used would be **under 10 KB**.

### `me.png` is 15× larger than it is displayed

- **Problem:** `assets/img/me.png` is **501×507 px / 170.2 KB**, but is rendered at `w-32 h-32` (`index.html:225`) = 128×128 CSS px. At 2× DPR that is 256×256 device pixels — the source still carries ~15× the pixel count it needs.
- **Files:** `assets/img/me.png`, `index.html:225`
- **Cause:** No image pipeline; the source file was exported at print resolution.
- **Improvement path:** Resize to 256×256 and export as WebP/AVIF → ~10–15 KB. Saves ~155 KB.

### `me.png` is used as the favicon at 170 KB

- **Problem:** `index.html:16` declares `<link rel="icon" href="./assets/img/me.png" type="image/png">`. Browsers fetch this 170 KB PNG to render a 16–32 px icon.
- **Files:** `index.html:16`, `assets/img/me.png`
- **Cause:** A proper `assets/img/favicon.ico` (52,425 bytes) exists in the repo but is **referenced zero times**.
- **Improvement path:** Use the existing `assets/img/favicon.ico` (and add a 32×32 PNG), and keep the large PNG only for the hero avatar.

### Two unreferenced large images ship to every visitor

- **Problem:** `assets/img/hero-bg.jpg` (**1920×1200, 174.7 KB**) and `assets/img/testimonials/testimonials-1..5.jpg` (**157.3 KB combined**) are tracked in git but referenced **zero times** by any HTML file.
- **Files:** `assets/img/hero-bg.jpg`, `assets/img/testimonials/testimonials-{1..5}.jpg`
- **Cause:** Leftovers from the previous BootstrapMade design; commit `afca9f1` deleted the pages that used them but kept the files.
- **Improvement path:** Delete both. They are served to every visitor who requests them by URL and add 332 KB to the deployable payload for nothing.

### Total first-party page weight

Measured/derived critical path for `index.html`: Tailwind CDN 120 KB gzip + Font Awesome CSS 19 KB gzip + Font Awesome woff2 (solid 150 KB + brands 108 KB) + AOS CSS/JS 6.7 KB gzip + typed.js 3.1 KB gzip + Google Fonts (Inter 400/500/600 + Outfit 500/600/700, 6 woff2 files ≈ 120–150 KB) + `me.png` 170 KB + `profile-img.jpg` 98 KB + `index.html` 28 KB ≈ **750–800 KB** for a single-page portfolio with no framework. A compiled-Tailwind, self-hosted-font, subset-icon, resized-image rebuild would land around **200–250 KB**.

---

## Fragile Areas

### The entire page below the hero depends on a third-party CDN script for visibility

- **Files:** `index.html:15` (AOS CSS from unpkg), `index.html:545` (AOS JS from unpkg), 16 elements carrying `data-aos="fade-up"` (`index.html:223, 247, 253, 296, 302, 322, 330, 371, 418, 432, 447, 464, 475, 487, 507, 513`)
- **Why fragile:** The AOS stylesheet contains `[data-aos^=fade][data-aos^=fade]{opacity:0;transition-property:opacity,transform}` (verified in `assets/vendor/aos/aos.css`, the same file unpkg serves). The `.aos-animate` class that restores `opacity:1` is added **by `aos.js`**. If `aos.css` loads but `aos.js` is blocked, slow, or fails to parse, **16 elements — the hero, the entire About section, Skills, Resume and its 8 sub-blocks, and Contact — remain at `opacity: 0` and are invisible to the visitor**. The page loads fine and shows a header, a blank hero, and nothing else.
- **Safe modification:** Do not add `data-aos` attributes to any element that carries required content until a `no-js` fallback exists.
- **Test coverage:** None. There is no test runner, no link checker, and no CI in this repository.
- **Fix approach:** Add a `<noscript>` override — `[data-aos]{opacity:1 !important}` — and, better, initialise AOS defensively: `if (window.AOS) { AOS.init(...) }` plus a `window.addEventListener('load', …)` fallback that force-removes the `opacity:0` state after a timeout. Compiling AOS locally (it is already vendored at `assets/vendor/aos/`) removes the CDN dependency entirely — though note `index.html` currently prefers the CDN over the vendored copy.

### `portfolio-details.html` is a stack of six libraries with no working assets

- **Files:** `portfolio-details.html:98-109`
- **Why fragile:** The page loads PureCounter, AOS, Bootstrap Bundle, GLightbox, Isotope, Swiper, typed.js, Waypoints, php-email-form/validate.js, and `assets/js/main.js` — 10 scripts — to render a static paragraph of lorem ipsum. None of them have a matching DOM element (verified: 9 of 10 hooks match zero elements in the repo). It also depends on five assets that no longer exist.
- **Safe modification:** Treat the page as a template stub, not a real page. Do not build on it without first deleting the template scaffolding.
- **Test coverage:** None.

### `forms/contact.php` depends on three things that are not in the repo

- **Files:** `forms/contact.php:12-16`, `forms/contact.php:22-24`
- **Why fragile:** It needs (a) a vendored library that is absent, (b) a PHP host — the site is on GitHub Pages, which does not execute PHP, and (c) a PHP mail transport (`mail()` or the commented-out SMTP block at `:27-34`) that must be configured correctly on that host. Any one of the three is a silent failure point: the script does not validate that the host is configured, and `echo $contact->send()` (`:40`) returns the library's status message directly to the caller.
- **Safe modification:** Do not modify until the deployment story is settled. As written, the file is unreachable in production.
- **Test coverage:** None.

### `index.html` is a single file with no test net

- **Files:** `index.html:1-569`
- **Why fragile:** There is no test framework, no HTML validator, no link checker, no preview environment, and no CI. A single misplaced `</div>` or a deleted `<script>` tag ships straight to production. (The current tag balance is correct — 209 open / 209 close for the counted element types in `index.html`, 25 / 25 in `portfolio-details.html` — but nothing enforces that going forward.)
- **Safe modification:** Make a copy-level diff habit: after any edit, re-check that the tailwind config block (`:19-34`), the AOS init call (`:548`), and the `Typed` constructor (`:550-556`) are all still present, and that the mobile-menu listeners (`:563-565`) still reference existing element IDs.
- **Test coverage:** None.

### Git history carries an entire abandoned WordPress installation

- **Files:** `.git/` — the pack is **37.21 MB** (`git count-objects -vH`), of which `wp-content/plugins` alone accounts for **~40 MB / 2,501 files**, `wp-includes/js` ~20 MB / 412 files, `wp-content/themes` ~16 MB / 766 files, plus `wp-admin/*`, `wp-includes/css`, `wp-includes/sodium_compat`, `wp-includes/ID3`, and a stray React build (`static/js/2.c4d2c77a.chunk.js.map`). History also contains `assets/portfolio-labels/research/research.jpg` (1.80 MB), `research2.jpg` (1.46 MB), and `assets/vendor/boxicons/fonts/boxicons.svg` (1.13 MB).
- **Why fragile:** A 37 MB pack for a 205 KB static site means every clone downloads 37 MB and every `git gc`/backup/repo-archive operation carries that weight. It also means the repository's public history contains a full third-party application — including Elementor's editor bundle, the OceanWP theme, and the `wp-includes/zxcvbn.min.js` password-strength library — which is misleading about what this project is and creates a large surface of vendored, unvetted, unmaintained code in the object store.
- **Safe modification:** Do not attempt history rewriting without a backup and a coordinated force-push — a partial rewrite can corrupt the branch.
- **Fix approach (optional, low priority):** `git filter-repo --path wp-content --path wp-includes --path wp-admin --path static --path assets/portfolio-labels --invert-paths`, then force-push. Weigh this against the risk of breaking the `github_pages` deployment. If the history is acceptable, at least document it.

---

## Scaling Limits

### GitHub Pages soft limits and the current deployable payload

- **Current capacity:** The published site is ~205 KB of first-party files plus 11.0 MB of `assets/vendor/`. GitHub Pages allows 1 GB of published content and 100 GB of bandwidth per month. The vendor tree alone is 10.0 MB of unused payload.
- **Limit:** Not a hard ceiling for a site this size, but the deployment footprint and clone cost are ~55× larger than the content actually served. The `.git` pack (37.21 MB) dominates every repository operation.
- **Scaling path:** Pruning `assets/vendor/` and rewriting history would cut the clone size by roughly an order of magnitude. If the site later needs a build step (Tailwind compile), the natural home for it is GitHub Actions (which is free for public repositories) with the `github_pages` branch as the publish root — this also opens the door to a `_headers` file for `Cache-Control` and security headers, which GitHub Pages does not otherwise support.

### Browser-side Tailwind compilation is CPU-bound per visit

- **Current capacity:** The Play CDN JIT-compiles the CSS on every page load, in the main thread, after DOM parse.
- **Limit:** On low-end mobile devices the compile step can add a visible delay before first paint of the styled content, on top of the 120 KB gzip download.
- **Scaling path:** Compiling ahead of time eliminates the cost entirely.

---

## Dependencies at Risk

### `cdn.tailwindcss.com` — unversioned, unpinnable, self-deprecating

- **Risk:** The URL at `index.html:11` carries no version. The payload can change at any time without a repo change, it cannot be given a valid SRI hash, and the bundle's own source states it should not be used in production. Tailwind's Play CDN has been superseded by the standalone browser build and by Tailwind v4's different CDN entry point — a v4 migration would silently break the `tailwind.config` object at `index.html:19-34`.
- **Impact:** Uncontrolled upstream change; no integrity guarantee; a silent styling regression is a single upstream push away.
- **Migration plan:** Compile locally with the Tailwind CLI; move `tailwind.config` to `tailwind.config.js`; delete the CDN tag. This removes the dependency entirely rather than pinning it.

### Font Awesome 6.4.0 (December 2023) — stale, and the free tier excludes Pro glyphs

- **Risk:** `index.html:17` pins `6.4.0`, roughly three years old as of the analysis date. There is no automated update path and no Dependabot/Renovate configuration.
- **Impact:** Missing icon fixes and accessibility improvements shipped in 6.5+/6.7.x. Any future attempt to use a Pro-only glyph silently renders a blank box (the free tier ships Solid + Brands only).
- **Migration plan:** Self-host the CSS + woff2 subsets under `assets/vendor/fontawesome/` with SRI-free local loading, or switch to inline SVGs for the ~29 icons — SVG removes the 258 KB of webfont download and the CDN dependency in one move.

### AOS 2.3.1 (2020) and typed.js 2.0.12 — effectively unmaintained, with a visibility failure mode

- **Risk:** AOS 2.3.1 is five years old; typed.js 2.0.12's last release was in 2020 and the project is effectively dormant. Both are loaded from CDNs without SRI (`index.html:15`, `:545`, `:546`).
- **Impact:** AOS specifically carries the `opacity: 0` failure mode described above — the highest-consequence fragility in the repository.
- **Migration plan:** AOS is already vendored at `assets/vendor/aos/aos.css` and `assets/vendor/aos/aos.js` — serve it locally to eliminate the CDN hop. For typed.js, the effect is a single looping text animation; replacing it with a ~15-line CSS keyframe animation removes the dependency outright. Add a `prefers-reduced-motion` guard to whichever survives.

### Bootstrap 5.1.3 vendored with no upgrade path

- **Risk:** `assets/vendor/bootstrap/` is a frozen copy of Bootstrap 5.1.3 (2022) plus `.map` source maps, RTL variants, grid-only and reboot-only splits — 7.4 MB across 34 files, of which only `bootstrap.min.css` and `bootstrap.bundle.min.js` are ever requested.
- **Impact:** The vendored copy will never receive upstream fixes, and there is no manifest recording the version for tooling to check. The `.map` files also reference `../../js/src/...` paths that do not exist in the repo, so a browser devtools request for them 404s.
- **Migration plan:** If the Bootstrap stack survives at all, prune to the two files in use, record the version in a `vendor/VERSIONS.md`, and add a scheduled manual upgrade check. If `portfolio-details.html` is deleted, the entire 7.4 MB subtree goes with it.

### No automated dependency scanning for any dependency

- **Risk:** There is no `package.json`, no `requirements.txt`, no `dependabot.yml`, and no CI. Every vendored library's version is recorded only in a filename or a comment.
- **Impact:** Upstream security fixes are never surfaced. The only signal is a manual audit.
- **Migration plan:** Introduce `package.json` with the Tailwind CLI and a lockfile, and enable `dependabot` for GitHub Actions + npm ecosystems.

---

## Missing Critical Features

### No structured data (JSON-LD)

- **Problem:** Neither page contains a single `<script type="application/ld+json">` block (`grep -c` → 0 in both files). For a personal portfolio, the `Person` schema is the highest-value structured data available — it feeds knowledge panels, rich-result job/title cards, and AI/LLM answer surfaces.
- **Blocks:** Search-result enrichment and any structured answer about the author's role, employer (`index.html:341-342`), and publications (`index.html:437-441`).
- **Fix:** Add a `Person` JSON-LD block in `index.html` `<head>` with `name`, `url` (`https://subhradip.xyz/`), `jobTitle` ("Cloud Architect"), `worksFor` (TCS), `email` (`mailto:contact@subhradip.xyz`), `sameAs` (the Twitter / LinkedIn / Instagram / Telegram URLs already at `index.html:233-236`, `:522`), and `alumniOf` / `hasCredential` entries drawn from `index.html:376-441`.

### No Open Graph or Twitter Card metadata

- **Problem:** `index.html` and `portfolio-details.html` contain **zero** `og:` or `twitter:` tags. The `<title>` (`index.html:7`) and `<meta name="description">` (`index.html:8`) are the only social metadata.
- **Blocks:** Every link shared on LinkedIn, Twitter/X, Slack, WhatsApp, or Discord renders as a bare text snippet with no image, no author, and no summary card — for a portfolio whose entire purpose is being shared.
- **Fix:** Add `og:type`, `og:title`, `og:description`, `og:url`, `og:image` (an absolute URL to a 1200×630 image — `assets/img/profile-img.jpg` at 800×800 is the wrong aspect ratio and too small; a dedicated OG image is needed), `og:site_name`, and matching `twitter:card = summary_large_image` tags to both pages.

### No canonical URL on either page

- **Problem:** Neither page declares `<link rel="canonical">`. The site is reachable at `https://subhradip.xyz/`, `https://subhradip.xyz/index.html`, `http://subhradip.xyz/` (Cloudflare redirects to HTTPS), and with arbitrary `?query` strings — four URLs serving identical content.
- **Blocks:** Duplicate-content consolidation and correct "preferred URL" attribution in search results.
- **Fix:** Add `<link rel="canonical" href="https://subhradip.xyz/">` to `index.html` and `https://subhradip.xyz/portfolio-details.html` to `portfolio-details.html`.

### Placeholder metadata on the published `portfolio-details.html`

- **Problem:** `portfolio-details.html:8` is `<title>Portfolio Details - Personal Bootstrap Template</title>`, `:9` is `<meta content="" name="description">`, and `:10` is `<meta content="" name="keywords">`. The page is live (HTTP 200 confirmed) and is being published with the template vendor's name in its title and empty descriptions.
- **Blocks:** Search indexing quality for that URL; a competitor-templated title in a portfolio's search presence.
- **Fix:** Populate real metadata, or delete the page.

### No contact mechanism on the site itself

- **Problem:** The contact section (`index.html:504-528`) offers only `mailto:` and a Telegram link. `forms/contact.php` is not connected to any markup (no `<form>` element exists), and its library is missing. The site's only real contact paths are a mail client and a third-party messenger.
- **Blocks:** Visitors without a mail client, and any future need to capture inbound leads on the domain itself.
- **Fix:** Add a static-hosting-compatible form (Cloudflare Pages Functions / Formspree / Netlify Forms) with server-side validation, a honeypot, and rate limiting.

### No security headers and no CSP

- **Problem:** The live response headers (verified via `curl -I https://subhradip.xyz/`) contain only `Content-Type`, `Cache-Control: max-age=600`, `ETag`, `Last-Modified`, `access-control-allow-origin: *`, and the CDN chain headers. There is **no** `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`.
- **Note:** GitHub Pages cannot serve custom headers. The site is already behind **Cloudflare** (confirmed), which is the correct place to add them via Transform Rules / Response Header Modification.
- **Fix:** Add a baseline policy at Cloudflare. Note that a strict CSP will initially fail because of the inline `<style>` and `<script>` blocks in `index.html` — extract them to files first.

### No `robots.txt` under repository control

- **Problem:** `https://subhradip.xyz/robots.txt` returns HTTP 200, but the file is **not in the repository** — it is Cloudflare's managed "content signals" file (verified: the body is Cloudflare's `ai-input` / `ai-train` boilerplate with no `Sitemap:` directive and no `User-agent` rules).
- **Blocks:** The repository cannot express crawl policy or advertise the sitemap. A committed `robots.txt` would also be overwritten by Cloudflare's managed version unless that Cloudflare feature is disabled.
- **Fix:** Decide whether Cloudflare's managed robots.txt is sufficient. If a repo-controlled file is wanted, disable the Cloudflare managed robots.txt and commit `robots.txt` with `User-agent: *`, `Allow: /`, and `Sitemap: https://subhradip.xyz/sitemap.xml`.

### No custom 404 page

- **Problem:** `https://subhradip.xyz/404.html` → HTTP 404 with the GitHub Pages default. No `404.html` in the repo.
- **Blocks:** A dead end for mistyped URLs, stale inbound links, and crawlers.
- **Fix:** Add `404.html` with the landing page's header/footer and the four section anchors.

### No build or deploy automation

- **Problem:** There is no `.github/workflows/` directory. Deployment is a manual `git push` to the `github_pages` branch. There is no CI to validate HTML, check links, or compile assets.
- **Blocks:** Every change is unverifiable before it reaches production.
- **Fix:** Add a GitHub Actions workflow on `github_pages` that compiles Tailwind, runs an HTML validator and a link checker, and fails the push on error. Because GitHub Pages for this repo publishes the branch root directly, the workflow should build into the same tree or switch the repo to the "GitHub Actions" source.

---

## Test Coverage Gaps

### There is no test infrastructure of any kind

- **What's not tested:** Everything. There is no test runner, no test files, no linting configuration, no formatter configuration, no type checking, no HTML validation, no link checking, no accessibility audit, and no CI. `git ls-files` contains zero files matching `*.test.*`, `*.spec.*`, `*.config.js`, or any CI manifest.
- **Files:** entire repository
- **Risk:** Every defect in this document was findable only by manual inspection. Nothing prevents recurrence. Specifically at risk:
  - Broken asset links — 5 already exist on `portfolio-details.html` (`:13`, `:14`, `:53`, `:57`, `:61`) and would not be caught.
  - Missing images and 404s on any new page.
  - The AOS `opacity: 0` invisibility failure mode would not be caught by any smoke test.
  - Tag imbalance in `index.html` (currently 209/209, but unenforced).
- **Priority:** **High** — a link checker plus an HTML validator in CI is cheap and would have caught the `portfolio-details.html` 404s immediately.

### The production rendering path is untested

- **What's not tested:** The site has never been verified under: a blocked/slow CDN (Tailwind, AOS, Font Awesome, typed.js), JavaScript disabled, a 320 px viewport, `prefers-reduced-motion: reduce`, a screen reader, or a headless DOM assertion.
- **Files:** `index.html:11-17`, `index.html:545-566`, `index.html:19-34`, `index.html:36-188`
- **Risk:** The CDN-blocking scenario is the highest-impact untested path — it silently renders a near-empty page (see "Fragile Areas"). Nothing in the repo would reveal this.
- **Priority:** **High** — a single Playwright smoke test that asserts the `About` heading is visible with `aos.js` blocked would close the most valuable gap in the repository.

### No accessibility verification

- **What's not tested:** The site has **zero** `aria-*` attributes in either HTML file (`grep -c "aria-"` → 0 in both), **zero** `aria-hidden` on decorative glyphs, and **zero** `prefers-reduced-motion` handling. 29 Font Awesome `<i>` elements are exposed to assistive technology as unlabelled content. The two icon-only buttons (`index.html:203`, `:211`) have no accessible name — the hamburger and close glyphs are the only content. The nine icon-only social links (`index.html:233-236`, `:537-539`) likewise have no accessible name; a screen reader announces them as empty links. `index.html:287` uses the non-descriptive `alt="Profile"`, and `portfolio-details.html:53/57/61` use `alt=""` on content images.
- **Files:** `index.html:203`, `index.html:211`, `index.html:233-236`, `index.html:269-282`, `index.html:344-346`, `index.html:537-539`, `portfolio-details.html:53-61`
- **Risk:** WCAG 2.1 AA failures on icon-only controls (2.4.4/2.4.6/4.1.2), no reduced-motion support for the AOS and typed.js animations, and no `prefers-reduced-motion` fallback for the `fadeUp` keyframes at `index.html:180-187`.
- **Priority:** **Medium** — add `aria-label` to the icon-only controls, `aria-hidden="true"` to decorative glyphs, a `prefers-reduced-motion` media query, and run `axe` in CI.

### The PHP endpoint has no test coverage and no executable environment

- **What's not tested:** `forms/contact.php` cannot be exercised in this repository — there is no PHP runtime, no `php-email-form.php` library, no mail transport, and no `.htaccess` or host configuration in the repo (a `.htaccess` existed in early history but was removed).
- **Files:** `forms/contact.php:1-41`
- **Risk:** Validation logic (when it exists) is entirely unverified — and the current code has no validation to test.
- **Priority:** **Medium** — but the cheapest correct resolution is to delete the file and use a hosted form service (see "Missing Critical Features").

### No regression protection for content edits

- **What's not tested:** Nothing guards the résumé content against accidental deletion or corruption. The content currently exists in **two** unsynchronised copies (`index.html:244-502` and `data.json:1-111`) with no test, no schema, and no sync mechanism — and they have already drifted (see Tech Debt).
- **Files:** `index.html:244-502`, `data.json:1-111`
- **Risk:** A bad edit to `index.html` silently removes a section (certifications, publications, a language) with no signal.
- **Priority:** **Low** — an HTML smoke test asserting the presence of each `<section id>` and each certification list item would be sufficient.

---

*Concerns audit: 2026-11-21*
