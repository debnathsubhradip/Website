---
last_mapped_commit: 86cbcd9e894880655b09a7734cdb4c9cec6b5863
last_mapped_at: 2026-11-21
---
# External Integrations

**Analysis Date:** 2026-11-21

## APIs & External Services

**CDN — Scripts & Stylesheets (client-side, loaded from `index.html`):**
- Tailwind CSS (CDN) - Utility CSS engine for the entire home page.
  - SDK/Client: `https://cdn.tailwindcss.com` (no SDK; browser-side JIT compiler)
  - Loaded at: `index.html:11`
  - Auth: None
- Font Awesome 6.4.0 - All iconography on the home page (`fas fa-*`, `fab fa-*`).
  - SDK/Client: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
  - Loaded at: `index.html:17`
  - Auth: None
- AOS 2.3.1 - Scroll-reveal animation.
  - SDK/Client: `https://unpkg.com/aos@2.3.1/dist/aos.css` (`index.html:15`) and `https://unpkg.com/aos@2.3.1/dist/aos.js` (`index.html:545`)
  - Auth: None
- typed.js 2.0.12 - Hero typewriter effect.
  - SDK/Client: `https://cdn.jsdelivr.net/npm/typed.js@2.0.12`
  - Loaded at: `index.html:546`
  - Auth: None
- Google Fonts - Inter + Outfit.
  - SDK/Client: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;600;700&display=swap`, preconnected to `fonts.googleapis.com` and `fonts.gstatic.com` (`index.html:12-14`)
  - Auth: None
- Google Fonts (secondary set) - Open Sans, Raleway, Poppins, used only by the template page.
  - SDK/Client: `https://fonts.googleapis.com/css?family=Open+Sans:...|Raleway:...|Poppins:...`
  - Loaded at: `portfolio-details.html:17`
  - Auth: None

**Content delivery / external documents:**
- Google Drive - Hosts the downloadable CV.
  - URL: `https://drive.google.com/file/d/1l1vL149lS_y-3UDAITHqSOxYx03R7qD8/view` (`index.html:238`)
  - Auth: None — public shared file, opened in a new tab
- DOI resolver (`doi.org`) - Canonical links for two publications.
  - `https://doi.org/10.15864/ijelts.2315` (`index.html:440`)
  - `https://doi.org/10.1002/9781119792253.ch7` (`index.html:438`)
- IJCAES (Smart Society) - Third publication PDF.
  - `https://ijcaes.smartsociety.org/volume1_issue4.pdf` (`index.html:439`)

**Social / contact (outbound links only, no API calls):**
- Twitter/X - `https://twitter.com/subh_official` (`index.html:233`, `index.html:537`)
- LinkedIn - `https://www.linkedin.com/in/thesubhradip/` (`index.html:234`, `index.html:538`)
- Instagram - `https://www.instagram.com/subhradip_official/` (`index.html:235`, `index.html:539`)
- Telegram - `https://t.me/socialistalex` (`index.html:522`)
- Email (`mailto:`) - `contact@subhradip.xyz` (`index.html:236`, `index.html:519`)

**Search engines:**
- Google Search Console - site-verification token file `google42d4a0a6e148cf47.html` at the domain root. Verification only; no Search Console API integration.

**Third-party libraries with no network dependency (self-hosted):**
- Bootstrap 5.1.3, Bootstrap Icons, Boxicons, GLightbox 3.1.1, Swiper 7.3.0, Isotope 3.0.6, PureCounter 1.1.4, Waypoints 4.0.1, typed.js, AOS — all vendored under `assets/vendor/` and loaded from `portfolio-details.html`. They make no outbound requests.

**Not integrated:**
- reCAPTCHA — supported by `assets/vendor/php-email-form/validate.js` (reads `data-recaptcha-site-key` and calls `grecaptcha.execute`), but no form in the repository declares that attribute and the Google reCAPTCHA script tag is not loaded anywhere.
- Google Analytics / any analytics or tag manager — no `gtag`, `googletagmanager`, `plausible`, `umami`, or `clarity` snippet present.

## Data Storage

**Databases:**
- None. No database, no ORM, no schema, no migration tooling anywhere in the repository.

**Content storage:**
- `data.json` - static JSON content manifest (about, education, languages, hobbies, publications, experience, certifications). It is **not** consumed by any first-party code: there is no `fetch('data.json')`, `XMLHttpRequest`, or jQuery-style AJAX reference in `index.html`, `portfolio-details.html`, or `assets/js/main.js`. Content in the rendered pages is duplicated as literal HTML in `index.html`.
- `sitemap.xml` - static XML URL manifest for search engines.

**File Storage:**
- Local filesystem only for site assets: `assets/img/` (photos, favicon, testimonial images) and `assets/vendor/` (vendored libraries).
- One external hosted document: the CV PDF on Google Drive (`index.html:238`). A local copy also exists at `Subhradip_Debnath_CV.pdf`, but the page links to the Drive URL, not the local file.
- `assets/vendor/bootstrap-icons/index.html` is a 189 KB vendor demo page published alongside the site.

**Caching:**
- None. No service worker, no cache headers, no CDN cache configuration, no localStorage/sessionStorage/IndexedDB usage.

## Authentication & Identity

**Auth Provider:**
- None. The site has no login, session, token, or user identity of any kind — it is entirely public and static.
- No OAuth/OIDC provider, no JWT, no cookie-based session, no client-side API keys.

**Server-side identity (form path only):**
- `forms/contact.php` derives sender identity from the submitted form fields: `$contact->from_name = $_POST['name']` and `$contact->from_email = $_POST['email']` (`forms/contact.php:22-23`). These are unauthenticated, user-supplied strings used as the `From` address of the outgoing mail.
- `forms/contact.php:22-24` reads `$_POST['name']`, `$_POST['email']`, `$_POST['subject']`, and `$_POST['message']` with no validation, sanitisation, CSRF token, or rate limiting at this layer.
- The only validation in the pipeline is the client-side BootstrapMade validator (`assets/vendor/php-email-form/validate.js`), which is trivially bypassable.

**Mailbox identity (form path only):**
- Receiving address: `debnath.subhradip@gmail.com`, hardcoded at `forms/contact.php:10`. The public-facing contact address on the site is a different domain, `contact@subhradip.xyz` (`index.html:236`, `index.html:519`).

## Monitoring & Observability

**Error Tracking:**
- None. No Sentry, Rollbar, Bugsnag, or equivalent.

**Logs:**
- None. No server, client, or analytics logging. The only console-adjacent output is AOS's internal `console.info` notice in `assets/vendor/aos/aos.js` when `MutationObserver` is unavailable.

**Uptime / Health:**
- None. No uptime monitor or health endpoint is configured in the repository.

**Client-side error surfacing (form path only):**
- `assets/vendor/php-email-form/validate.js` renders PHP failures into the form's `.error-message` element via `displayError()`. Because `forms/contact.php` is not executed on GitHub Pages, a real submission attempt against the live site would surface a static-server response instead of the expected `OK` sentinel.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (static hosting, project site published from the repository).
  - Repository: `git@github.com:debnathsubhradip/Website.git` (origin)
  - Publishing branch: `github_pages` (current branch; `origin/HEAD` also points at `github_pages`)
  - Custom domain: `subhradip.xyz`, declared in `CNAME`
  - Deployment mechanism: GitHub's built-in Pages build — no custom workflow

**CI Pipeline:**
- None. No `.github/` directory, no workflow YAML, no pre-commit hooks, no lint/test gate.

**Release Process:**
- Manual: commit to `github_pages` and push to `origin`; GitHub Pages rebuilds from the branch contents.

**Custom domain / DNS:**
- The apex `subhradip.xyz` resolves to GitHub Pages via the `CNAME` file. No DNS configuration is stored in the repository.
- The site also references `www`-less canonical URLs in `sitemap.xml`; no redirect or `www`→apex rule is defined in-repo.

## Environment Configuration

**Required env vars:**
- Not detected. The static site requires no environment variables; there is no `.env` file and no build-time substitution.

**Secrets location:**
- None present. No API keys, tokens, or credentials exist in the repository.
- The SMTP credential block in `forms/contact.php:27-34` is entirely commented out and contains only placeholders (`host: 'example.com'`, `username: 'example'`, `password: 'pass'`, `port: '587'`). Enabling it would put live SMTP credentials in a committed file — prefer environment-variable injection or a server-level secret store.

**Server-side configuration for the form path:**
- `$contact->ajax = true` (`forms/contact.php:19`) makes the handler return a bare `OK` string that the client validator compares against.
- The library it depends on, `assets/vendor/php-email-form/php-email-form.php`, is **not present** in the repository (only the client-side `validate.js` is vendored). `forms/contact.php:12-16` therefore executes `die('Unable to load the "PHP Email Form" Library!')` on every request.
- `forms/Readme.txt` confirms the working PHP/AJAX form backend is a paid pro-version component of the MyResume template.

**Mail transport:**
- Default path is PHP's built-in `mail()` function via the PHP Email Form library, with no authentication — it relies on the host's default MTA.
- The commented SMTP block (`forms/contact.php:27-34`) would switch the transport to authenticated SMTP over port 587 if the library is obtained and configured.
- Effective delivery path today: **none in production** — GitHub Pages does not execute PHP, and the vendored library file is absent.

## Webhooks & Callbacks

**Incoming:**
- `forms/contact.php` — intended POST endpoint for the AJAX contact form, expected to receive `name`, `email`, `subject`, and `message` fields. It is server-side only; it is never invoked by a browser-loaded script and cannot be executed by the GitHub Pages host.
- No form element in the repository posts to it: `index.html` contains no `<form>` tag at all, and `portfolio-details.html` includes the validator script but ships no `.php-email-form` markup. The client-side handler in `assets/vendor/php-email-form/validate.js` binds only to `document.querySelectorAll('.php-email-form')`, so it binds zero elements as the site stands.
- No third-party webhook receivers (Stripe, GitHub, Zapier, etc.) are configured.

**Outgoing:**
- SMTP email via PHP `mail()` (or the optional commented SMTP transport) to `debnath.subhradip@gmail.com`, triggered only by a successful `forms/contact.php` request. Not reachable on the current host.

---

*Integration audit: 2026-11-21*
