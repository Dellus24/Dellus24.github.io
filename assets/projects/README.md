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
| `color` | no | the project's ink, e.g. `color: #b3261e`. See below |
| `background` | no | the surface behind the ink, e.g. `background: #fbeeed` |
| `line` | no | `solid` (default), `double` or `dashed`. Parsed and published, but **nothing renders it yet** — reserved |
| `model` | no | **only needed if `models/` holds more than one `.glb`.** Otherwise the single `.glb` is found automatically, with its real casing |
| `gallery:` | no | block list, one file per line, see below |
| `slides:` | no | block list — **you almost never want this.** Omit it and every file in `slides/` is used, in numeric order |

Everything after `---` is the description. Blank lines inside it are kept.

### `color:` and `background:` — the project's two colours

The whole site works in exactly two colours: an ink and a background. A project
simply owns its own pair.

```
color:      #b3261e     the ink — text, lines, the 3D render
background: #fbeeed     the surface behind it
```

- **Open the project** and that pair becomes the whole page — menu, windows,
  text, model, everything. Uniform: the page and the inside of the windows are
  the same colour.
- **On the landing** every window shares the landing's own background; what
  differs per project is the **ink** — each window's border, title and ASCII.
  The background only shifts once you go into a project and that project owns
  the page.

`#rgb` or `#rrggbb`. A bad value is a build **error**, so it can never reach the
live site. Both keys are optional; whatever a project does not set stays as the
page already was, so colours can be added one project at a time.

A visitor can override either colour from the Theme window's *Colour project*
row; that override lives in their browser and never touches these files. Their
own *Ink colour* choice is borrowed while a project is open and handed back
untouched afterwards.

### The landing — `content/landing.txt`

Separate from the projects, but it points at them. It lists the windows a first
visitor is met by, each borrowed from a real project:

```
windows:
  re-possessing-industrial  model
  get-lost                  image  thumbs/03.webp
---
The text shown in the landing's own window.
```

`model` opens that project's own `.glb` (the one marked `*` if it has several)
and takes no filename. `image` takes a file from that project's `gallery/`; a
`thumbs/` prefix loads the 400px derivative, which is 5-20 KB against 500-800 KB
for the full-size original. Unknown projects and missing files are build errors.

**Weight is the constraint.** The site's initial load is ~404 KB; models on disk
run from 14 KB to 3.0 MB. Three large models plus three full-size images would
make the front door ten times heavier. The file itself carries the current
per-file numbers in a comment.

`landing.txt` also takes its own `color:` and `background:` — the pair the site
wears before any project is opened, and the one it returns to on Home.

### Composing the landing — `?layout`

Positions and sizes are not meant to be typed by hand. Open the site with
`?layout` on the end of the URL:

```
http://localhost:8899/?layout        (or https://dellus.xyz/?layout)
```

A black bar appears along the bottom. Drag and resize the landing windows until
the composition is right, press **Copy**, and paste the block it gives you over
the `windows:` block in `content/landing.txt`:

```
windows:
  text                                      at 75.3 62.4 size 23.3 35.4
  re-possessing-industrial  model           at 20.1 6.5  size 37 89.3
  get-lost  image thumbs/03.webp            at 59 3.1    size 14.9 96
```

`at x y` and `size w h` are **percentages of the screen**, so a composition
holds its proportions on any display. `text` is the landing's own text window
and takes no project or filename.

Two things worth knowing:

- **Geometry is all-or-nothing.** Unless every window has both `at` and `size`,
  the landing ignores the numbers and auto-tiles instead — so a half-finished
  composition never renders half-placed.
- **An authored size wins over an image's own dimensions.** Without one, an
  image window sizes itself to the picture; with one, it does what you said.

The bar exists **only** when `?layout` is in the URL. A visitor cannot reach it
and never loads it.

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
