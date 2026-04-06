# CLAUDE.md

## Workflow

- Commit after every feature or change. Do not batch multiple changes into one commit.

## Commands

```bash
pnpm dev      # dev server
pnpm build    # production build
pnpm lint     # eslint
```

## Architecture

Next.js Pages Router (not App Router). Key directories:
- `src/content/projects/*.md` — one file per project; frontmatter drives homepage cards
- `src/content/thoughts/*.md` — blog posts
- `src/pages/projects/[id].js` — project detail renderer
- `src/components/` — shared components (ProjectCard, TimelineItem, Layout, Navbar)
- `src/lib/assets.js` — `getAssetUrl()` wraps all image paths for Vercel Blob

## Key Patterns

**Project frontmatter fields:** `title`, `description`, `ranking` (controls homepage sort order), `image`, `images[]`, `icon`, `technologies[]`, `demo`, `github`, `website`, `deck`. Set `ignore: true` to hide a project.

**Images:** Always use `getAssetUrl("/images/...")` — never raw paths. Images are hosted on Vercel Blob.

**Embed diagrams:** Certain project pages embed interactive HTML diagrams via iframe. Add a fenced marker in the `.md` file (e.g. ` ```abyss-embed``` `) and wire up a matching API route in `src/pages/api/` + an entry in the `embeds` array in `[id].js`. Diagram HTML lives in `src/content/`.
