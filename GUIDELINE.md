# GUIDELINE.md

This document explains the project architecture, every important file, how routing/content works, and how to maintain the site long-term.

## 1) Project purpose

This is a static Astro portfolio + blog site with:

- Home page (`/`) showing intro, projects, and recent posts.
- Blog index (`/blog`) listing all published posts.
- Blog detail pages (`/blog/<slug>`) rendered from Markdown.
- Tag archive pages (`/tags/<tag>`) generated from post tags.
- Light/dark theme toggle and keyboard navigation shortcuts.

## 2) Runtime model

- Astro builds static HTML at build time (`npm run build`).
- Markdown posts from `src/content/blog/*.md` are parsed via Astro Content Collections.
- No backend/database is used.
- Deployment target is static hosting (Cloudflare Pages recommended).

## 3) File map (what matters)

### Root config and docs

- `package.json`: scripts and dependencies.
- `astro.config.mjs`: Astro framework configuration.
- `tsconfig.json`: TypeScript checking configuration.
- `README.md`: usage/deployment guide.
- `GUIDELINE.md`: this deep technical guide.

### Source code

- `src/layouts/Layout.astro`: global shell (header/footer/theme toggle/global CSS/shortcuts).
- `src/pages/index.astro`: home page.
- `src/pages/blog/index.astro`: blog listing page.
- `src/pages/blog/[slug].astro`: dynamic post page.
- `src/pages/tags/[tag].astro`: dynamic tag archive page.
- `src/content.config.ts`: content schema for blog posts.
- `src/utils/tags.ts`: tag slug normalization helper.
- `src/content/blog/*.md`: markdown blog posts.

### Legacy/unused starter files

- `src/components/Welcome.astro`: old Astro starter component, currently unused.
- `src/assets/astro.svg`, `src/assets/background.svg`: starter assets, currently unused.

### Generated files (do not edit manually)

- `.astro/*`: Astro generated metadata/types.
- `dist/*`: build output.
- `node_modules/*`: dependencies.

## 4) Line-by-line explanation (project code)

## 4.1 `package.json`

- `name`: package/project name.
- `type: module`: enables ESM imports.
- `version`: project version.
- `scripts.dev`: starts Astro dev server.
- `scripts.build`: static production build.
- `scripts.preview`: preview built site locally.
- `scripts.astro`: raw Astro CLI passthrough.
- `dependencies.astro`: core framework version.

## 4.2 `astro.config.mjs`

- `// @ts-check`: enable type-checking for JS config.
- `defineConfig` import: typed helper from Astro.
- `export default defineConfig({})`: default config, no extra adapters/integrations yet.

## 4.3 `tsconfig.json`

- `extends: astro/tsconfigs/strict`: strict TS defaults for Astro.
- `include`: includes generated types and all source files.
- `exclude: ["dist"]`: ignore build output from type checks.

## 4.4 `src/content.config.ts`

- Imports `defineCollection` and `z` (Zod schema).
- Defines `blog` collection as content-based collection.
- Enforces frontmatter shape:
  - `title`: string (required)
  - `description`: string (required)
  - `date`: converted/coerced to Date
  - `tags`: string[] with default `[]`
  - `draft`: boolean with default `false`
- Exports collections object used by Astro content APIs.

## 4.5 `src/utils/tags.ts`

Function: `toTagSlug(tag: string): string`

Step-by-step:

- `trim()`: remove leading/trailing spaces.
- `toLowerCase()`: normalize case for stable URLs.
- `.replace(/[^a-z0-9\s-]/g, '')`: remove special chars.
- `.replace(/\s+/g, '-')`: convert spaces to hyphens.
- `.replace(/-+/g, '-')`: collapse repeated hyphens.
- `.replace(/^-|-$/g, '')`: remove hyphens at edges.

Result example:

- `"Rust Backend"` -> `"rust-backend"`

## 4.6 `src/layouts/Layout.astro`

### Frontmatter block

- Defines `Props` with optional `title` and `description`.
- Sets defaults:
  - title: `Vivek Banzade | Portfolio`
  - description: short SEO summary.

### `<head>` block

- Charset and viewport meta tags.
- Favicon links.
- Astro generator meta.
- Description meta from props.
- Dynamic page title from props.
- Inline script reads:
  - saved theme from `localStorage`
  - fallback to system theme
  - sets `document.documentElement.dataset.theme`.

### Header structure

- Brand link to `/`.
- Nav links:
  - `[H] Home`
  - `[B] Blog`
- Social icon links:
  - GitHub profile
  - LinkedIn profile
- Theme toggle button:
  - sun icon visible in light mode
  - dracula icon visible in dark mode

### Main and footer

- `<slot />` renders page-specific content.
- Footer shows current year + name.

### Behavior script

- `applyTheme(theme)` writes theme to `data-theme` attribute.
- On load: applies `dark` or `light`.
- On toggle click:
  - flips theme
  - saves in `localStorage`
  - reapplies theme.
- Keyboard shortcuts:
  - `h` -> `/`
  - `b` -> `/blog`
- Ignores shortcuts when typing in input/textarea/contenteditable fields.

### Global CSS (what each section does)

- `:root`: light theme design tokens.
- `:root[data-theme='dark']`: dark theme token overrides.
- Global reset/box sizing.
- `body`: typography, background, top spacing.
- `.page`: centered content column, accent top border, full viewport height strategy.
- `.site-header`: horizontal header layout.
- `.right-rail/nav`: right controls alignment.
- `.icon-link/.theme-toggle`: consistent icon button styling.
- `.icon-sun/.icon-dracula`: conditional icon visibility by theme.
- `main { flex: 1; }`: pushes footer to bottom on short pages.
- `.site-footer`: muted footer styling.
- `.meta`: utility text style used across pages.
- `.prose *`: markdown content styles for headings/code/pre.
- Mobile media query (`max-width: 760px`): stacks header sections.

## 4.7 `src/pages/index.astro`

### Data setup

- Imports `getCollection` and `Layout`.
- Defines `projects` array (currently placeholder items).
- Loads published posts only (`draft !== true`) and sorts newest first.

### Markup

- Uses shared `<Layout>`.
- Intro section with role headline and short summary.
- Projects section:
  - loops over `projects`
  - renders title + description.
- Recent blog section:
  - section header + `All posts` link
  - if no posts, shows fallback
  - otherwise shows date + title rows linking to each post.

### Styles

- Typography sizing for heading.
- Section separators (`border-bottom`).
- List reset and row separators.
- Link hover styling.
- Recent posts two-column layout (date/title).
- Mobile breakpoint collapses to one column.

## 4.8 `src/pages/blog/index.astro`

### Data

- Loads all published posts.
- Sorts by date descending.

### Markup

- Title and intro.
- Post list with date + link.
- Empty-state fallback.

### Styles

- Top border list style.
- Dashed row separators.
- Date monospace style.
- Hover/underline interaction.
- Responsive 1-column layout on small screens.

## 4.9 `src/pages/blog/[slug].astro`

### Route generation

- `getStaticPaths()` fetches published posts.
- Returns each post as one static route param (`slug`).

### Rendering

- `render(post)` turns markdown content into Astro component (`Content`).
- Page shows:
  - date
  - title
  - description
  - full markdown body.
- Tag footer at bottom:
  - each tag links to `/tags/<normalized-tag>/`.

### Styles

- Spacing and title sizing.
- Intro muted style.
- Tag chip container and chips.
- Tag hover accent color.

## 4.10 `src/pages/tags/[tag].astro`

### Route generation logic

- Reads all published posts.
- Builds a `Map` of `tagSlug -> { label, posts[] }`.
- For each post tag:
  - normalizes with `toTagSlug`.
  - appends post to that tag bucket.
- Returns one static path per unique tag.

### Props and rendering

- Receives `tagLabel` and sorted `posts`.
- Renders tag archive title (`#tagLabel`) and associated posts.
- Each post row links back to blog detail page.

### Styles

- Same visual language as blog list.
- Date/title row layout.
- Mobile collapse for readability.

## 4.11 `src/content/blog/*.md`

Each markdown file must include frontmatter:

```md
---
title: ...
description: ...
date: YYYY-MM-DD
tags:
  - tag1
  - tag2
draft: false
---
```

- `draft: true` hides a post from all listing pages and routes.
- Filenames become slugs.

Example:

- `src/content/blog/my-rust-notes.md` -> `/blog/my-rust-notes/`

## 5) Routing summary

- `/` -> `src/pages/index.astro`
- `/blog` -> `src/pages/blog/index.astro`
- `/blog/<slug>` -> `src/pages/blog/[slug].astro`
- `/tags/<tag>` -> `src/pages/tags/[tag].astro`

All routes are static at build time.

## 6) Development workflow

## 6.1 Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## 6.2 Add a blog post

1. Create a new markdown file in `src/content/blog/`.
2. Add valid frontmatter.
3. Write markdown content.
4. Verify local rendering on:
   - `/`
   - `/blog`
   - `/blog/<slug>`
   - `/tags/<tag>`

## 6.3 Build verification

```bash
npm run build
npm run preview
```

- Build must pass before pushing.

## 6.4 Deploy update (Cloudflare Pages)

1. Commit changes.
2. Push to main branch.
3. Cloudflare auto-builds and publishes.
4. Validate live URLs after deployment.

## 7) Maintenance guide

## 7.1 Content maintenance

- Keep dates accurate in frontmatter.
- Use meaningful tags (`rust`, `backend`, `cli`).
- Keep filename slugs clean (`kebab-case`).
- Use `draft: true` for in-progress posts.

## 7.2 Design/system maintenance

- Theme tokens are centralized in `src/layouts/Layout.astro` (`:root` vars).
- Update only variables when tweaking palette.
- Keep list/table spacing consistent across `index`, `blog`, and `tags` pages.

## 7.3 Code maintenance

- Remove unused starter file `src/components/Welcome.astro` when no longer needed.
- Remove unused starter assets if unused permanently.
- Keep dependencies current:

```bash
npm outdated
npm update
```

## 7.4 Regression checklist before deploy

- Theme toggle works and persists after refresh.
- Keyboard shortcuts (`H`, `B`) navigate correctly.
- New post appears on home and blog index.
- Tag chips at post bottom link to correct tag archive.
- Tag archive includes all posts with same normalized tag.

## 8) Common edits cookbook

## 8.1 Update your intro text

- Edit `src/pages/index.astro` intro section paragraph.

## 8.2 Replace placeholder projects

- Edit `projects` array in `src/pages/index.astro`.

## 8.3 Change site name globally

- Edit brand/title defaults/footer text in `src/layouts/Layout.astro`.

## 8.4 Add new top nav link

- Add anchor in `src/layouts/Layout.astro` `<nav>`.

## 8.5 Add new social icon

- Copy an existing `.icon-link` entry in `src/layouts/Layout.astro` and update URL + SVG path.

## 9) Known current technical notes

- `src/components/Welcome.astro` is legacy and unused.
- `src/assets/astro.svg` and `src/assets/background.svg` are legacy starter assets.
- `dist/` and `.astro/` are generated; never manually edit.

## 10) Recommended next cleanup

1. Remove unused starter component/assets.
2. Add `draft: false` explicitly to all post frontmatter for clarity.
3. Add a post template file, e.g. `src/content/blog/_template.md`.
4. Add lint/format scripts if desired.

