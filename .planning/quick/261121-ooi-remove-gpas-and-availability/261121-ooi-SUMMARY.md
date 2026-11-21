---
phase: quick
plan: 01
status: complete
quick_id: 261121-ooi
slug: remove-gpas-and-availability
subsystem: ui
tags: [portfolio, html, content, education, layout]

requires: []
provides:
  - Education timeline shows institution and location only, no GPA figures
  - Availability card removed from the home page
  - Hobbies/Languages grid rebalanced to two columns
  - data.json education entries and root object match the rendered page
affects: [index.html, data.json]

actuals:
  tokens: 110
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - index.html
    - data.json

key-decisions:
  - The GPA and the location shared one line ("GPA: 8.6 · Chandigarh, India"). Only the GPA prefix was dropped; the location — real CV data — was kept, and the middot separator went with the GPA it introduced.
  - Removing the Availability card also removed the third column of the "Hobbies, Languages & Availability" grid, so that grid was changed from `md:grid-cols-3` to `md:grid-cols-2`. Leaving it at three would have left an empty third column.
  - Dropped the `cgpa` keys from the five education entries and the whole `availability` object in `data.json`, following the convention set by quick task 261121-oi0: the parallel content record mirrors what is displayed.
---

# Quick Task 261121-ooi: Remove the GPAs and the Availability section

**Description:** Remove the GPA figures and the Availability "Working Hours: 24 Hours Available" section from the portfolio, then push.

**Plan:** `.planning/quick/261121-ooi-remove-gpas-and-availability/261121-ooi-PLAN.md`

## What changed

**`index.html` — education timeline.** Five entries had their GPA and location on one line, separated by a middot. The GPA prefix was dropped and the location kept:

| Before | After |
|---|---|
| `GPA: 8.6 · Chandigarh, India` | `Chandigarh, India` |
| `GPA: 5.25 · Ropar, India` | `Ropar, India` |
| `GPA: 8.9 · Kolkata, India` | `Kolkata, India` |
| `GPA: 9.4 · Haldia, India` | `Haldia, India` |
| `GPA: 9.6 · Haldia, India` | `Haldia, India` |

The MBA entry (`Haryana, India`) had no GPA and was untouched.

**`index.html` — Availability card.** The whole third card of the grid was deleted (the `fa-clock` icon, the "Availability" heading, and the "Working Hours:" / "24 Hours Available" pair). Since that card was the third column, the grid was rebalanced:

```
<!-- Hobbies, Languages & Availability -->              <!-- Hobbies & Languages -->
<div class="grid md:grid-cols-3 gap-8 mt-8">             <div class="grid md:grid-cols-2 gap-8 mt-8">
```

**`data.json`.** The `cgpa` key was removed from five education entries (each keeping its `location`), and the whole `availability` object was deleted.

## Verification

| Check | Result |
|---|---|
| `GPA` in `index.html` | 0 |
| `Availability` / `Working Hours` / `24 Hours Available` in `index.html` | 0 / 0 / 0 |
| Education locations survive | Haryana 1, Chandigarh 1, Ropar 1, Kolkata 2 (education + About card), Haldia 2 |
| Grid class | `md:grid-cols-2 gap-8 mt-8` = 1, `md:grid-cols-3 gap-8 mt-8` = 0 |
| HTML tag balance (div, section, ul, li, p, span, a, h3, h4) | balanced |
| `data.json` | valid JSON; no GPA key; `availability` gone; 6 education entries, every one with a `location` |
| Browser render | body has no "GPA", no "Availability", no "Working Hours"; all six education cards show degree + institution + location; Hobbies/Languages grid has exactly 2 children rendered side by side (x=24, x=509, equal width); Soft Skills block intact; 0 console errors |
| Live site | see below |

## Commit

`f1121d5` — `fix(index): remove gpa figures and availability card` (2 files changed, 12 insertions, 28 deletions)

## Notes

- Two of the plan's `verify` expectations were written imprecisely and did not match the code: `grep -c "Kolkata, India"` returns 2 (one in the education timeline, one in the pre-existing About card), and the HTML comment uses a bare `&` rather than `&amp;` because comments are not entity-parsed. The code was correct in both cases; the expectations were checked by hand afterwards.
- The GPAs remain in the source CV (`assets/cv/Subhradip_Debnath_CV.pdf`) and in the CV's own record — only the website display and `data.json` were changed.
- `data.json` is still not fetched by any page — it remains a parallel content record rather than a render input. See `.planning/codebase/CONCERNS.md`.
