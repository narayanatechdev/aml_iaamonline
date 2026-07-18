# Challenge Divisions & Article Upload — Feature Guide

_Last updated: 2026-07-18_

This document describes the Challenge Divisions CMS features and the article
upload/mapping tools added to the AML journal platform, and how to operate
them as an admin.

---

## 1. Challenge Divisions (homepage CMS)

The "Challenge Divisions" homepage section is fully editable from the admin
homepage builder — nothing about it is hardcoded anymore.

**Where:** Admin → Content → Homepage → *Challenge Divisions* → pencil (edit) icon.

**What you can edit:**

| Field | Notes |
|---|---|
| Section heading | Defaults to "Challenge Divisions" |
| Intro paragraph | Text under the heading |
| Link label / URL | The top-right link (default "All divisions →" → `/divisions`); blank label hides it |
| Divisions (repeating cards) | Add, remove, reorder. Each card: **name** (required to appear), description, image (URL or direct upload), article count label, optional link override |

**Behavior:**

- The edit form prefills with the currently live values, so you always edit
  real content, not blanks.
- A card's link defaults to its own division page (`/divisions/<slug>`, slug
  derived from the name — renaming a division changes its URL). The optional
  "Link URL" field on a card overrides this.
- Public pages revalidate every ~30 seconds, so edits appear within half a
  minute without a redeploy.

**Public pages driven by this content:**

- Homepage — the scrollable divisions section; every card is clickable.
- `/divisions` — grid of all divisions (linked from the navbar and the
  section's "All divisions →" link).
- `/divisions/<slug>` — one page per division: banner image, description,
  article-count label, CTAs, and the list of **articles mapped to that
  division** (see §3). Unknown slugs return 404.

**Code:**

- Shared defaults + content resolver: `aml_iaamonline-frontend/components/homepage/challenge-divisions-data.ts`
  (kept free of `'use client'` so server pages can import it)
- Homepage block: `components/homepage/challenge-divisions.tsx`
- Pages: `app/divisions/page.tsx`, `app/divisions/[slug]/page.tsx`
- Admin editor fields: `app/admin/content/homepage/page.tsx`
  (`CONTENT_FIELDS.challenge_divisions` + `DivisionsEditor`)

---

## 2. Adding a single article

**Where:** Admin → Articles → **Add Article** (top right).

The modal takes: title (required), type, subject, volume, issue, year, DOI,
abstract, a **Challenge Division** dropdown, and an optional **PDF upload**
(max 30 MB). The article is created as *published*.

Notes:

- New articles automatically get the next numeric legacy id (public URL
  `/article/<legacy_id>`, continuing the existing 25xxx sequence).
- DOI is optional; articles without one can be added freely (the `doi`
  column is nullable, and duplicates of real DOIs are rejected).
- Division choices in all dropdowns load live from the homepage CMS
  divisions block, so they always match the public site.

---

## 3. Mapping existing articles to divisions

**Where:** Admin → Articles → click a row to expand → **Challenge Division**
dropdown in the Details panel.

Selecting a division saves immediately (spinner → checkmark). "Not mapped"
clears it. The mapping powers the "Articles in this division" list on each
public `/divisions/<slug>` page (updates within ~30 s).

Note: the article-count shown on division cards is still a manually entered
label in the homepage builder — it is **not** computed from the mapping.

---

## 4. Bulk upload (CSV / XML)

**Where:** Admin → Articles → **Bulk Upload**.

Upload a `.csv` or `.xml` file (max 10 MB, up to 1,000 rows) and optionally
pick a **default Challenge Division** applied to rows that don't set their
own. Valid rows import even when other rows fail; the result panel lists
each failed row with the reason (missing title, non-numeric year, duplicate
DOI, …).

**Recognised fields** (case-insensitive; only `title` is required):

```
title, type (or document_type), subject, division, abstract, keywords,
doi, volume, issue, pages_from, pages_to, year (or publish_year),
publish_month, publish_date, pdf_url, corresponding_author
```

**CSV example** (first row must be a header):

```csv
Title,Type,Division,Year,DOI,Volume,Issue
Perovskite stability under humidity,Research Article,Sustainable Materials,2026,10.5185/amlett.2026.1001,17,3
AI-guided alloy discovery,Review,Digital & AI-Designed Materials,2026,,17,3
```

**XML example:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<articles>
  <article>
    <title>Perovskite stability under humidity</title>
    <type>Research Article</type>
    <division>Sustainable Materials</division>
    <year>2026</year>
    <doi>10.5185/amlett.2026.1001</doi>
  </article>
</articles>
```

---

## 5. API reference (added endpoints)

All `/admin/*` endpoints require a Sanctum bearer token and the
`article:edit` permission.

| Method & path | Purpose |
|---|---|
| `POST /api/admin/articles` | Create one article (JSON body; auto legacy_id) |
| `POST /api/admin/articles/bulk` | Multipart: `file` (csv/xml), optional `default_division`; returns `{total_rows, created, failed, errors[]}` |
| `POST /api/admin/articles/{id}/pdf` | Multipart `pdf` upload; sets `pdf_url` |
| `PATCH /api/admin/articles/{id}` | Now also accepts `division` |
| `GET /api/articles?division=<name>` | Public list filtered by mapped division |

---

## 6. Database changes

| Migration | Change |
|---|---|
| `2026_07_18_130018_add_division_to_articles_table` | `articles.division` — nullable string, indexed |
| `2026_07_18_132000_make_articles_doi_nullable` | `articles.doi` nullable; existing `''` values converted to `NULL` (the unique constraint ignores NULLs, so many DOI-less articles can coexist) |

---

## 7. Deployment notes

- Frontend: `cd aml_iaamonline-frontend && npm run build && pm2 restart aml-frontend`
- Backend migrations: `cd aml_iaamonline-backend && php artisan migrate --force`
- The public site fetches the API at `https://amljournal.iaamonline.org/api`
  (`NEXT_PUBLIC_API_URL` in `aml_iaamonline-frontend/.env.local`).
- Homepage/division pages cache API responses for 30 s (`next.revalidate`).
