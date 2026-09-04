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

## 3D models — folder layout

One subfolder per model, named after it, so a project can hold several models
without their source files getting mixed together:

```
assets/projects/<id>/models/
    silo.glb          <- web-ready model. PUSHED. This is what config.js points at.
    Silo/             <- helper/source files for that model. LOCAL ONLY, never pushed.
        Silo.3dm
        Silo.obj
        Silo.mtl
        Silo.3dmbak
```

Then point `config.js` at the `.glb`:

```js
model: 'assets/projects/re-possessing-industrial/models/silo.glb',
```

**Rules, handled automatically by `.gitignore` (no per-model edits needed):**

- `.glb` files sitting **directly** in `models/` are pushed and deploy.
- **Anything in a subfolder of `models/` stays local** — Rhino files, `.obj`,
  `.mtl`, textures, `.3dmbak`, whatever you want to keep for your own use.

**Paths are case-sensitive on GitHub Pages** even though Windows doesn't care.
`models/Silo/` (folder) and `models/silo.glb` (file) differ only in case, and
that is fine — but the string in `config.js` must match the real filename
exactly, or the model 404s live while working perfectly on your machine.

`.3dm.rhl` files are Rhino lock files — safe to delete once Rhino has closed
the document. They're ignored either way.
