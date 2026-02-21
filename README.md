# Vivek Banzade Portfolio (Astro)

Simple portfolio + Markdown blog built with Astro.

## Hosting on Cloudflare Pages (free)

### One-time setup

1. Push this project to a GitHub repository.
2. In Cloudflare Dashboard, go to `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Select your repo and configure build settings:
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Click `Save and Deploy`.
5. Optional: attach your custom domain in the Pages project settings.

After this, every push to your main branch redeploys automatically.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Add a new blog post

All blog posts live in:p

- `src/content/blog/`

### 1) Create a new Markdown file

Example file: `src/content/blog/my-new-post.md`

### 2) Add frontmatter

```md
---
title: My New Post
description: One-line summary of the post.
date: 2026-02-21
tags:
  - astro
  - notes
draft: false
---

Your post content here.
```

### 3) Write content in Markdown

Use normal Markdown headings, lists, code blocks, and links.

### 4) Commit and deploy

After pushing changes, Cloudflare Pages rebuilds the site and the post appears:

- On Home feed
- On `/blog`
- On its own page: `/blog/<slug>`

`<slug>` is generated from the file name.

## Update process (new blog after deployment)

Use this every time you want to publish a post:

1. Create a new markdown file in `src/content/blog/`.
2. Add required frontmatter (`title`, `description`, `date`; keep `draft: false` to publish).
3. Run locally:

```bash
npm run dev
```

4. Verify post is visible on:
   - Home page feed
   - `/blog`
   - Its post page
5. Run a production check:

```bash
npm run build
```

6. Commit and push:

```bash
git add .
git commit -m "Add blog: <post-title>"
git push
```

7. Cloudflare Pages auto-deploys the new version.

## Maintenance checklist

- Keep dependencies updated occasionally:

```bash
npm outdated
npm update
```

- If you want to prepare a post without publishing, use `draft: true`.
- Keep post filenames clean (kebab-case) for better slugs.

## Draft posts

Set `draft: true` to keep a post hidden from published pages.

## Build

```bash
npm run build
npm run preview
```
