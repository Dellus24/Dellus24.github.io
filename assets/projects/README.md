# Adding / editing a project

**`js/config.js` is the single source of truth.** The live site reads it and
nothing else — if a change isn't in `config.js`, it isn't on the site.

There used to be a `text/meta.md` in every project folder duplicating these
fields. Those files were deleted (2026-09-04): nothing read them, and they had
drifted badly — `stor-e-age`'s copy still said `title: 101 Gates`, and two
projects pointed at a `.glb` that doesn't exist. One copy only, from here on.

## Steps

1. **Make the asset folders** under `assets/projects/<your-project-id>/`:

   | Folder | Holds | Notes |
   |---|---|---|
   | `gallery/` | thumbnail-grid images | opens the Gallery window |
   | `slides/` | numbered sequence `01.webp`, `02.webp`, … | opens the Slideshow window |
   | `models/` | `.glb` 3D model | opens the 3D viewer — **see the gitignore note below** |

   Use only the folders you actually need. Each one present adds its window
   when the project is opened.

2. **Drop the files in.** Images should be `.webp` (originals live in the
   sibling `Dellus24-originals-backup/`). Slides must be zero-padded and
   sequential — `01`, `02`, … — so `seq()` can generate the list.

3. **Add the entry to `js/config.js`.** Copy the `TEMPLATE` block in that
   file's header comment (top of the file) — it lists every field, which are
   optional, and how the `seq()` / `imgs()` helpers work. Don't rely on this
   README for field names; `config.js` is authoritative.

4. **Check it locally** before pushing:
   ```
   python -m http.server 8765        # run from the repo root
   ```
   Then open <http://localhost:8765/index.html> and click the project. A
   `file://` open will not work — the page is an ES module.

## Conventions

- **Project ID** = folder name = the `id` field = kebab-case, no spaces.
- **Category** is `academic` or `employment` — it drives sidebar grouping.
- **To hide a project**, prefix its folder with `_` (e.g. `_101-gates`).
- **Gallery labels:** `imgs()` accepts `['01.webp', 'My Label']` tuples as well
  as bare filenames.

## Gitignore note for 3D models

`.gitignore` blocks `assets/projects/*/models/` — models are large and stay
local by default. The only pushed exception is
`assets/projects/101-gates/models/spring.glb`, un-ignored explicitly.

**A new model will not deploy until it has its own exception**, even though it
works locally. Add one, or restructure the rule. (Tracked as `3D-03`.)
