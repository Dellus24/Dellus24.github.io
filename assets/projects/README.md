# Adding / editing a project

**Edit the `.txt` files. Never edit `js/config.js` — it is generated.**

Each project's content lives in a plain text file inside its own folder:

```
assets/projects/<project-id>/project.txt
content/about.txt   content/cv.txt   content/contact.txt
```

`js/config.js` is built from those by `tools/build-content.mjs`. It is still
what the live site loads, it is still committed, but it is **output**. Anything
you type into it by hand is overwritten by the next build.

## The loop

1. Drop your files into the project folder (`slides/`, `gallery/`, `models/`).
2. Edit `project.txt`.
3. Commit in VS Code. The pre-commit hook rebuilds `js/config.js`, adds it to
   your commit, and **stops the commit if anything is wrong**, naming the file
   and the line.
4. Push. That's the deploy.

To see the result before committing, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>
in VS Code (or run `node tools/build-content.mjs`), then:

```
python -m http.server 8765        # from the repo root
```

and open <http://localhost:8765/index.html>. A `file://` open will not work —
the page is an ES module.

> **If the hook isn't running** (fresh clone — git never tracks hooks):
> `cp tools/pre-commit .git/hooks/pre-commit`

## The format

```
title: 101 Gates
year: 2024
category: academic
location: Jerusalem, Israel
participants: Nir Dellus
type: Studio 9-10
order: 10
gallery:
  01.webp | Details Model

---

The conservative religious space of the community in Geulim, Jerusalem…

Guided by Ifat Finkelman and Deborah Pinto Fdeda.
```

Header of `key: value` lines, then a line that is exactly `---`, then the
description. A line starting with `#` is a comment.

### Keys

| Key | Required | Notes |
|---|---|---|
| `title` | yes | shown in the menu and window titles |
| `year` | yes | |
| `category` | yes | `academic` or `employment` — drives sidebar grouping |
| `location` | yes | |
| `participants` | yes | |
| `type` | yes | free text, e.g. `Studio 9-10` |
| `order` | yes | menu position, low to high. Spaced by 10 so you can insert between without renumbering |
| `hidden` | no | `hidden: yes` drops the project from the site entirely, files and all. Nothing is deleted — remove the line to bring it back |
| `model` | no | **only needed if `models/` holds more than one `.glb`.** Otherwise the single `.glb` is found automatically, with its real casing |
| `gallery:` | no | block list, one file per line, see below |
| `slides:` | no | block list — **you almost never want this.** Omit it and every file in `slides/` is used, in numeric order |

Everything after `---` is the description. Blank lines inside it are kept.

### The `gallery:` block

Indent one filename per line. Order is exactly what you write — it is a
curatorial choice, so the builder never guesses it. An optional label goes
after a `|`:

```
gallery:
  cast.webp
  mold_draft.webp
  01.webp | Details Model
```

If a file sits in `gallery/` but isn't listed, the build **warns** and the file
does not appear. That is the safety net: adding an image to the folder and
forgetting to list it can't silently do nothing.

### Slides are automatic

Don't list them. Put `01.webp`, `02.webp`, … in `slides/` and they are picked
up in numeric-aware order, gaps and all — `stor-e-age` skips 68 and 69 and
needs no configuration for it. Mixed extensions are fine
(`horizontal-modernism` has a `.gif` at 47).

Add a slide: drop the file in, commit. Remove one: delete it, commit.

## What the build checks

The commit is stopped for any of these:

- a missing required key, or a `category` that isn't `academic`/`employment`
- two projects claiming the same `order`
- a `gallery:` entry naming a file that isn't in `gallery/`
- **a `model:` whose casing doesn't match the file on disk** — this used to be
  the classic bug: works on Windows, 404s on GitHub Pages
- more than one `.glb` in `models/` with no `model:` line saying which
- a missing `---` separator

And it warns (without blocking) about a gallery image with no `thumbs/`
derivative, a file on disk that no `.txt` mentions, an empty description, or a
project folder with no `project.txt` at all.

## Conventions

- **Project ID** = folder name = kebab-case, no spaces. There is no `id:` key —
  the folder name *is* the id.
- To hide a project, use `hidden: yes`. (A `_` folder prefix still works too.)
- Images are `.webp`; originals live outside the repo in `_local/backups/originals/`.
- **Gallery grids load `gallery/thumbs/` 400px derivatives, never the
  originals.** After adding gallery images run `make-thumbs.mjs` (it lives
  outside the repo, at `D:/projects/Website/_local/tools/`, and needs `sharp`). The
  build warns when a thumbnail is missing.

## 3D models — folder layout

One subfolder per model, named after it, so a project can hold several models
without their source files getting mixed together:

```
assets/projects/<id>/models/
    silo.glb          <- web-ready model. PUSHED. Found automatically.
    Silo/             <- Rhino/Blender sources. LOCAL ONLY, never pushed.
        Silo.3dm  Silo.obj  Silo.mtl  Silo.3dmbak
```

**Handled automatically by `.gitignore` — no per-model edits:**

- a `.glb` sitting **directly** in `models/` is pushed and deploys
- **anything in a subfolder of `models/` stays local**

A model carries its own deconstruction, views and part names **inside the
`.glb`** — authored in Blender, never in a config table. See `.claude/CONTEXT.md`.

`.3dm.rhl` files are Rhino lock files — safe to delete once Rhino has closed the
document. They're ignored either way.

## Why it works this way

There used to be a `text/meta.md` in every project folder duplicating these
fields. Those were deleted (2026-09-04) because **nothing read them** and they
had drifted badly — `stor-e-age`'s copy still claimed the title `101 Gates`.

This is the opposite arrangement, not a return to it: `project.txt` is the only
place the content is authored, and `config.js` is mechanically derived from it.
There is one copy, and the build fails rather than letting the two disagree.
