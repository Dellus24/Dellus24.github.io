#!/usr/bin/env node
// ============================================================================
// build-content.mjs — generates js/config.js from the .txt content sources.
//
//   node tools/build-content.mjs           write js/config.js
//   node tools/build-content.mjs --check   verify it is up to date (exit 1 if not)
//
// SOURCES (the things you edit):
//   assets/projects/<id>/project.txt   one per project
//   content/{about,cv,contact}.txt     the static panels
//
// OUTPUT (generated — never hand-edit):
//   js/config.js
//
// Plain Node, no dependencies. Format is documented in assets/projects/README.md.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const HEAD_KEYS = ['title', 'year', 'category', 'location', 'participants', 'type'];
const CATEGORIES = ['academic', 'employment'];
const STATIC_KEYS = ['about', 'cv', 'contact'];   // hard-coded in the menu markup
const BLOCK_KEYS = ['gallery', 'slides', 'models', 'credit', 'windows', 'view'];

// HEAD_KEYS above are REQUIRED — every one is checked for presence. Optional
// single-line keys are handled individually further down, like `credit`.
const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const LINE_STYLES = ['solid', 'double', 'dashed'];
// Landing window kinds. The first group belongs to a project and is written
// `<project-id> <kind> [file]`; the second stands alone on its own line.
const PROJECT_KINDS = ['image', 'model', 'gallery', 'slides', 'box'];
const SOLO_KINDS = ['text', 'menu', 'about', 'cv', 'contact'];

// A saved 3D view. The same keys wherever one is written: on a project (how
// its model opens from the menu) or on a landing `model` line (how it opens
// there). Returns [view, leftovers] so the caller can name what did not parse.
function parseView(text) {
    const v = {};
    let rest = ' ' + text + ' ';
    const eat = (re, fn) => { const m = rest.match(re); if (m) { fn(m); rest = rest.replace(m[0], ' '); } };
    eat(/\bangle\s+(-?[\d.]+)\s+(-?[\d.]+)/i, m => { v.angle = [parseFloat(m[1]), parseFloat(m[2])]; });
    eat(/\bpan\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)/i, m => { v.pan = [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]; });
    eat(/\bzoom\s+(-?[\d.]+)/i,  m => { v.zoom  = parseFloat(m[1]); });
    eat(/\bspin\s+(-?[\d.]+)/i,  m => { v.spin  = parseFloat(m[1]); });
    eat(/\bdecon\s+(-?[\d.]+)/i, m => { v.decon = parseFloat(m[1]); });
    eat(/\bres\s+(-?[\d.]+)/i,   m => { v.res   = parseFloat(m[1]); });
    eat(/\bwidth\s+(-?[\d.]+)/i, m => { v.width = parseFloat(m[1]); });
    eat(/\bmode\s+(ascii|wireframe|solid)\b/i, m => { v.mode   = m[1].toLowerCase(); });
    eat(/\blines\s+(edges|all|hidden)\b/i,     m => { v.lines  = m[1].toLowerCase(); });
    eat(/\bchars\s+([A-Za-z]+)/i,               m => { v.chars  = m[1]; });
    eat(/\binvert\s+(on|off)\b/i,               m => { v.invert = m[1].toLowerCase() === 'on'; });
    eat(/\bedges\s+(on|off)\b/i,                m => { v.edges  = m[1].toLowerCase() === 'on'; });
    return [v, rest.trim().split(/\s+/).filter(Boolean)];
}
const VIEW_KEYS = /\b(angle|pan|zoom|spin|decon|res|width|mode|lines|chars|invert|edges)\b/i;
const VIEW_HELP = 'mode: ascii|wireframe|solid, lines: edges|all|hidden, invert/edges: on|off, ' +
                  'angle/pan/zoom/spin/decon/res/width take numbers';

// Numeric-aware sort: a plain string sort puts '100.webp' before '99.webp'.
const natCmp = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const listFiles = (dir) =>
    fs.existsSync(dir)
        ? fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile()).sort(natCmp)
        : [];

// ── Parser ──────────────────────────────────────────────────────────────────
// A header of `key: value` lines (plus indented block lists), then a line that
// is exactly `---`, then the description body. `#` starts a comment line.
function parseTxt(text, where) {
    const norm = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    const lines = norm.split('\n');

    let sep = lines.findIndex(l => l.trim() === '---');
    if (sep === -1) {
        err(`${where}: no "---" separator line between the header and the description`);
        sep = lines.length;
    }

    const head = {};
    const blocks = {};
    let openBlock = null;

    for (let i = 0; i < sep; i++) {
        const raw = lines[i];
        if (!raw.trim() || raw.trim().startsWith('#')) continue;

        // An indented line continues the block opened above it.
        if (/^\s/.test(raw) && openBlock) { blocks[openBlock].push(raw.trim()); continue; }
        openBlock = null;

        const m = raw.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
        if (!m) { err(`${where}:${i + 1}: cannot parse header line: ${JSON.stringify(raw)}`); continue; }

        const [, key, value] = m;
        if (BLOCK_KEYS.includes(key) && value.trim() === '') {
            blocks[key] = [];
            openBlock = key;
        } else if (key in head) {
            err(`${where}:${i + 1}: duplicate key "${key}"`);
        } else {
            head[key] = value.trim();
        }
    }

    const body = lines.slice(sep + 1).join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
    return { head, blocks, body };
}

// ── Projects ────────────────────────────────────────────────────────────────
const projectsDir = path.join(REPO, 'assets/projects');
const projects = [];
const seenOrder = new Map();

for (const id of fs.readdirSync(projectsDir).sort(natCmp)) {
    const dir = path.join(projectsDir, id);
    if (!fs.statSync(dir).isDirectory()) continue;
    if (id.startsWith('_')) continue;                      // legacy hide-by-prefix

    const txt = path.join(dir, 'project.txt');
    if (!fs.existsSync(txt)) {
        warn(`${id}/: no project.txt — folder skipped, nothing from it reaches the site`);
        continue;
    }

    const where = `assets/projects/${id}/project.txt`;
    const { head, blocks, body } = parseTxt(fs.readFileSync(txt, 'utf8'), where);

    if (/^(yes|true)$/i.test(head.hidden || '')) continue;  // hidden: yes

    for (const k of HEAD_KEYS) if (!head[k]) err(`${where}: missing required key "${k}"`);
    if (head.category && !CATEGORIES.includes(head.category)) {
        err(`${where}: category "${head.category}" must be one of ${CATEGORIES.join(' | ')}`);
    }

    const order = Number(head.order);
    if (!head.order || !Number.isFinite(order)) {
        err(`${where}: missing or non-numeric "order" (it sets the menu position)`);
    } else if (seenOrder.has(order)) {
        err(`${where}: order ${order} is already used by ${seenOrder.get(order)}`);
    } else {
        seenOrder.set(order, id);
    }

    if (!body) warn(`${where}: description is empty`);

    const rec = {
        id,
        order,
        ...Object.fromEntries(HEAD_KEYS.map(k => [k, head[k]])),
        description: body,
    };

    // credit: the trailing attribution — "Guided by …", "Curated by …",
    // "Supported and funded by …". Kept OUT of the description so it can be set
    // like the other metadata rather than read as a last paragraph. Write it on
    // one line, or as an indented block when it runs to several:
    //     credit: Guided by Helle Blom.
    //     credit:
    //       Role: research assistant, prototyping and manufacturing.
    //       Curated by Edith Kofsky and Oren Eldar.
    const credit = blocks.credit ? blocks.credit.join('\n') : (head.credit || '');
    if (credit) rec.credit = credit;

    // ── color / line: the project's signature (2026-09-29).
    //
    //    A project owns TWO colours, exactly like the rest of the site does:
    //    an ink (`color`) and a background. They apply to this project's
    //    windows on the landing, and to the ENTIRE page once the project is
    //    opened — menu, chrome, text and the 3D render alike.
    //
    //        color:      #b3261e     the ink
    //        background: #fbf1f0     the surface behind it
    //        line:       double
    //
    //    All three are OPTIONAL. A project with neither colour never tints
    //    anything, so the feature is invisible until a colour is authored.
    //
    //    `line` is parsed and published but nothing renders it yet — reserved
    //    so the format does not have to change when it is wanted.
    for (const k of ['color', 'background']) {
        if (!head[k]) continue;
        if (!HEX.test(head[k])) {
            err(`${where}: ${k} "${head[k]}" must be a hex colour like #b3261e or #b31`);
        } else {
            rec[k] = head[k].toLowerCase();
        }
    }
    // view: how this project's model opens FROM THE MENU. One line or a block:
    //
    //     view: mode wireframe chars Parts decon 30
    //     view:
    //       angle -40 22  zoom 4.1  spin 0
    //       mode wireframe  chars Parts
    //
    // The CAMERA comes from the .glb when the model carries one - Nir's rule
    // that view data lives in the model. Anything written here applies on top,
    // so angle/zoom here override an authored camera, and give a model with no
    // camera somewhere to start.
    const viewText = blocks.view ? blocks.view.join(' ') : (head.view || '');
    if (viewText) {
        const [v, leftovers] = parseView(viewText);
        if (leftovers.length) {
            err(`${where}: view - did not understand "${leftovers.join(' ')}" (${VIEW_HELP})`);
        } else if (v.decon !== undefined && (v.decon < 0 || v.decon > 100)) {
            err(`${where}: view - decon is a percentage, expected 0-100`);
        } else if (!Object.keys(v).length) {
            warn(`${where}: view: is empty`);
        } else {
            rec.view = v;
        }
    }

    if (head.line) {
        if (!LINE_STYLES.includes(head.line)) {
            err(`${where}: line "${head.line}" must be one of ${LINE_STYLES.join(' | ')}`);
        } else if (head.line !== 'solid') {
            rec.line = head.line;          // solid is the default; don't emit it
        }
    }

    // ── models: a project can carry several. One .glb needs no authoring at
    //    all — it is auto-discovered, which also takes its casing FROM DISK,
    //    and a hand-typed path that differs in case works on Windows and 404s
    //    on GitHub Pages. Several need a `models:` block saying the order and
    //    which one opens; mark the default with a leading `*`.
    //
    //        models:
    //          * Cabine.glb
    //          Bridge.glb
    //
    //    Dropped names come from the filename (Nir, 2026-09-28) — there is
    //    deliberately no label field to drift from what is on disk.
    const modelsDir = path.join(dir, 'models');
    const glbs = listFiles(modelsDir).filter(f => f.toLowerCase().endsWith('.glb'));

    const resolveGlb = (name) => {
        if (glbs.includes(name)) return name;
        const near = glbs.find(g => g.toLowerCase() === name.toLowerCase());
        err(near
            ? `${where}: model "${name}" is a case mismatch — the file on disk is "${near}" (paths are case-sensitive live)`
            : `${where}: model "${name}" not found in models/ (present: ${glbs.join(', ') || 'none'})`);
        return null;
    };

    let modelFiles = [];          // ordered; index 0 is the one that opens
    if (blocks.models) {
        const listed = [];
        let defaultIdx = -1;
        for (const line of blocks.models) {
            const isDefault = line.startsWith('*');
            const name = line.replace(/^\*\s*/, '').trim();
            if (!name) continue;
            if (listed.includes(name)) { err(`${where}: model "${name}" listed twice`); continue; }
            if (isDefault) {
                if (defaultIdx !== -1) err(`${where}: two models marked "*" — only one opens`);
                defaultIdx = listed.length;
            }
            if (resolveGlb(name)) listed.push(name);
        }
        // The marked one opens; with none marked the first line does.
        if (defaultIdx > 0) listed.unshift(...listed.splice(defaultIdx, 1));
        modelFiles = listed;
        for (const g of glbs) {
            if (!listed.includes(g)) warn(`${where}: models/${g} is on disk but not listed — it will not appear`);
        }
    } else if (head.model) {
        if (resolveGlb(head.model)) modelFiles = [head.model];
    } else if (glbs.length === 1) {
        modelFiles = [glbs[0]];
    } else if (glbs.length > 1) {
        err(`${where}: ${glbs.length} .glb files in models/ — add a "models:" block listing them, ` +
            `marking the one that opens with a leading "*" (present: ${glbs.join(', ')})`);
    }

    if (modelFiles.length) {
        // `model` stays a plain string so everything that already reads it keeps
        // working; `models` only appears when there is genuinely more than one.
        rec.model = `assets/projects/${id}/models/${modelFiles[0]}`;
        if (modelFiles.length > 1) {
            rec.models = modelFiles.map(f => ({
                src:   `assets/projects/${id}/models/${f}`,
                label: f.replace(/\.glb$/i, ''),
            }));
        }
    }

    // ── gallery: explicit. The order is curated and the labels live here.
    const galleryDir = path.join(dir, 'gallery');
    const onDisk = listFiles(galleryDir);
    if (blocks.gallery) {
        rec.images = [];
        const listed = new Set();
        for (const line of blocks.gallery) {
            const [file, ...rest] = line.split('|');
            const name = file.trim();
            const label = rest.join('|').trim();
            if (!onDisk.includes(name)) err(`${where}: gallery file "${name}" is not in gallery/`);
            if (listed.has(name)) err(`${where}: gallery file "${name}" is listed twice`);
            listed.add(name);
            const im = { src: `assets/projects/${id}/gallery/${name}` };
            if (label) im.label = label;
            rec.images.push(im);
        }
        for (const f of onDisk) {
            if (!listed.has(f)) warn(`${where}: gallery/${f} is on disk but not listed — it will not appear`);
        }
        // PERF-01: grids load gallery/thumbs/ derivatives, never the originals.
        const thumbs = new Set(listFiles(path.join(galleryDir, 'thumbs')));
        const noThumb = [...listed].filter(f => !thumbs.has(f));
        if (noThumb.length) {
            warn(`${id}: ${noThumb.length} gallery image(s) have no thumbs/ derivative — run _local/tools/make-thumbs.mjs, outside the repo (${noThumb.slice(0, 3).join(', ')}${noThumb.length > 3 ? ', …' : ''})`);
        }
    } else if (onDisk.length) {
        warn(`${where}: gallery/ holds ${onDisk.length} file(s) but the txt has no "gallery:" block — none will show`);
    }

    // ── slides: auto-scanned from the folder, in numeric-aware order.
    const slidesOnDisk = listFiles(path.join(dir, 'slides'));
    if (blocks.slides) {
        for (const f of blocks.slides) {
            if (!slidesOnDisk.includes(f)) err(`${where}: slide "${f}" is not in slides/`);
        }
    }
    const slideFiles = blocks.slides ?? slidesOnDisk;
    if (slideFiles.length) rec.slides = slideFiles.map(f => `assets/projects/${id}/slides/${f}`);

    projects.push(rec);
}

projects.sort((a, b) => a.order - b.order);

// ── Static panels ───────────────────────────────────────────────────────────
const STATIC = {};
for (const key of STATIC_KEYS) {
    const file = path.join(REPO, 'content', `${key}.txt`);
    if (!fs.existsSync(file)) {
        err(`content/${key}.txt is missing — the menu links to it (data-static="${key}")`);
        continue;
    }
    const { head, body } = parseTxt(fs.readFileSync(file, 'utf8'), `content/${key}.txt`);
    if (!head.title) err(`content/${key}.txt: missing "title"`);
    if (!body) warn(`content/${key}.txt: body is empty`);
    STATIC[key] = { title: head.title, body };
}

// ── Landing ─────────────────────────────────────────────────────────────────
// content/landing.txt describes what greets a first visitor: a set of ORDINARY
// windows borrowed from real projects, each wearing its project's colour, plus
// one text window holding the body. Nothing new is opened — these go through
// the same openImage / open3D factories as everything else.
//
//     windows:
//       re-possessing-industrial  model
//       get-lost                  image  bridge.webp
//       101-gates                 image  thumbs/Spring_01.webp
//     ---
//     The text a visitor reads first.
//
// Every line is resolved against the real folders, so a typo is a build error
// rather than a silent 404 live. The file is optional: without it the site
// boots to the collapsed menu exactly as it did before.
//
// WEIGHT IS THE REAL CONSTRAINT. Models run 14 KB to 3.0 MB and full-size
// gallery images 500-800 KB, against a 404 KB initial load today — so a
// thumbs/ path is accepted here precisely so a landing image can cost 5-20 KB.
let LANDING = null;
const landingFile = path.join(REPO, 'content/landing.txt');
if (!fs.existsSync(landingFile)) {
    warn('content/landing.txt is missing — the site will boot to the collapsed menu alone');
} else {
    const where = 'content/landing.txt';
    const { head, blocks, body } = parseTxt(fs.readFileSync(landingFile, 'utf8'), where);
    const byId = new Map(projects.map(p => [p.id, p]));
    const windows = [];

    // A window line is `<project> <kind> [file]`, optionally followed by a
    // position and size in PERCENT of the viewport:
    //
    //     get-lost   image  thumbs/03.webp   at 62 4  size 34 40
    //     get-lost   gallery                 at 4 4   size 30 40
    //     stor-e-age slides                  at 36 4  size 30 40
    //     about                              at 62 48 size 34 46
    //     text                               at 4 48  size 30 40
    //
    // A project line is `<project-id> <kind> [file]` where kind is one of
    // image | model | gallery | slides | box. `about`, `cv`, `contact`, `text`
    // and `menu` stand alone. Every one of them is a window the site already
    // knows how to open — the landing opens them through the same factories.
    //
    // Percent rather than pixels so a composition holds on any screen. These
    // numbers are not meant to be typed by hand — open the site with ?layout,
    // drag the windows into place and copy the block out (see README).
    //
    // `text` is the landing's own text window; it takes no project or file and
    // may appear once. Geometry is all-or-nothing: unless EVERY window carries
    // both `at` and `size`, the landing falls back to auto-tiling, so a
    // half-finished composition never renders half-placed.
    const seenSolo = new Set();
    const seenPair = new Set();
    for (const raw of blocks.windows || []) {
        let line = raw;
        const geo = {};
        const mAt = line.match(/\bat\s+(-?[\d.]+)\s+(-?[\d.]+)/i);
        if (mAt) { geo.at = [parseFloat(mAt[1]), parseFloat(mAt[2])]; line = line.replace(mAt[0], ' '); }
        const mSz = line.match(/\bsize\s+(-?[\d.]+)\s+(-?[\d.]+)/i);
        if (mSz) { geo.size = [parseFloat(mSz[1]), parseFloat(mSz[2])]; line = line.replace(mSz[0], ' '); }

        // A saved 3D view, for a `model` line - same keys as a project's own
        // `view:` block. See parseView.
        let view = {}, hasView = false;
        {
            const mv = line.match(VIEW_KEYS);
            if (mv) {
                const tail = line.slice(mv.index);
                const [v, left] = parseView(tail);
                view = v; hasView = Object.keys(v).length > 0;
                line = line.slice(0, mv.index) + ' ' + left.join(' ');
            }
        }

        if (geo.at && geo.at.some(v => v < -50 || v > 150)) {
            err(`${where}: "${raw.trim()}" — at x y are percentages of the screen, expected roughly 0-100`);
        }
        if (geo.size && geo.size.some(v => v <= 0 || v > 200)) {
            err(`${where}: "${raw.trim()}" — size w h are percentages of the screen, expected 1-100`);
        }

        const parts = line.trim().split(/\s+/).filter(Boolean);
        if (!parts.length) continue;
        if (hasView && parts[1] !== 'model') {
            err(`${where}: "${raw.trim()}" — a saved view belongs on a "model" line`);
        }
        // Anything left over is a key that did not parse — almost always a bad
        // value, e.g. `mode cartoon`. Without this it falls through and is read
        // as a filename, which reports a baffling error about models.
        const maxTokens = ['image', 'model', 'slides'].includes(parts[1]) ? 3 : 2;
        if (!SOLO_KINDS.includes(parts[0]) && parts.length > maxTokens) {
            err(`${where}: "${raw.trim()}" — did not understand ` +
                `"${parts.slice(maxTokens).join(' ')}" (${VIEW_HELP})`);
            continue;
        }

        // ── stands alone: text | menu | about | cv | contact ──────────────
        if (SOLO_KINDS.includes(parts[0])) {
            const kind = parts[0];
            if (parts.length > 1) err(`${where}: "${raw.trim()}" — "${kind}" takes no project or filename`);
            if (seenSolo.has(kind)) err(`${where}: "${kind}" is listed twice — it is one window`);
            seenSolo.add(kind);
            windows.push({ kind, ...geo });
            continue;
        }

        // ── belongs to a project ──────────────────────────────────────────
        const [pid, kind, file] = parts;
        const p = byId.get(pid);
        if (!p) {
            err(`${where}: "${pid}" is not a project or a window kind ` +
                `(projects: ${[...byId.keys()].join(', ')}; kinds: ${SOLO_KINDS.join(', ')})`);
            continue;
        }
        if (!PROJECT_KINDS.includes(kind)) {
            err(`${where}: "${pid} ${kind ?? ''}" — kind must be one of ${PROJECT_KINDS.join(' | ')}`);
            continue;
        }
        // One project can show several images; everything else is one window
        // per project, because they share an openWins key and the second would
        // silently do nothing.
        if (kind !== 'image') {
            const tag = `${pid}/${kind}`;
            if (seenPair.has(tag)) { err(`${where}: "${pid} ${kind}" is listed twice — it is one window`); continue; }
            seenPair.add(tag);
        }

        if (kind === 'image') {
            if (!file) { err(`${where}: "${pid} image" needs a filename from that project's gallery/`); continue; }
            const rel = path.join('assets/projects', pid, 'gallery', file);
            if (!fs.existsSync(path.join(REPO, rel))) { err(`${where}: "${file}" is not in ${pid}/gallery/`); continue; }
            windows.push({ project: pid, kind, src: rel.replace(/\\/g, '/'), ...geo });

        } else if (kind === 'model') {
            if (!p.model) { err(`${where}: "${pid}" has no .glb in models/`); continue; }
            let which = 0;
            if (file) {
                const list = p.models || [{ src: p.model }];
                which = list.findIndex(m => m.src.endsWith('/' + file));
                if (which === -1) {
                    err(`${where}: "${pid} model ${file}" — not one of that project's models ` +
                        `(${list.map(m => m.src.split('/').pop()).join(', ')})`);
                    continue;
                }
            }
            const src = (p.models ? p.models[which].src : p.model);
            windows.push({ project: pid, kind, src, ...(which ? { which } : {}), ...geo, ...(hasView ? { view } : {}) });

        } else {
            // gallery | slides | box — nothing to name, the project has one each
            if (file && kind !== 'slides') err(`${where}: "${pid} ${kind}" takes no filename`);
            if (kind === 'slides' && file) {
                // `slides <file>` opens on that slide. A number is accepted too,
                // but the filename survives slides being inserted or removed.
                const names = (p.slides || []).map(sp => sp.split('/').pop());
                let at = /^\d+$/.test(file) ? parseInt(file, 10) - 1 : names.indexOf(file);
                if (at < 0 || at >= names.length) {
                    err(`${where}: "${pid} slides ${file}" — not a slide in ${pid}/slides/ ` +
                        `(${names.length} slides, first is ${names[0]})`);
                    continue;
                }
                windows.push({ project: pid, kind, ...(at ? { slide: at } : {}), ...geo });
                continue;
            }
            if (kind === 'gallery' && !(p.images && p.images.length)) {
                err(`${where}: "${pid}" has no gallery: block, so it has no gallery window`); continue;
            }
            if (kind === 'slides' && !(p.slides && p.slides.length)) {
                err(`${where}: "${pid}" has no files in slides/`); continue;
            }
            windows.push({ project: pid, kind, ...geo });
        }
    }

    if (!windows.length) warn(`${where}: no "windows:" block — the landing will be the text alone`);
    if (!body) warn(`${where}: body is empty — the landing will be the windows alone`);

    // The landing's own pair — the colours the site wears before any project
    // has been opened, and the ones it returns to on Home.
    const pair = {};
    for (const k of ['color', 'background']) {
        if (!head[k]) continue;
        if (!HEX.test(head[k])) err(`${where}: ${k} "${head[k]}" must be a hex colour like #b3261e or #b31`);
        else pair[k] = head[k].toLowerCase();
    }
    LANDING = { title: head.title || 'Nir Dellus', text: body, windows, ...pair };
}

// ── Emit ────────────────────────────────────────────────────────────────────
const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const tpl = (s) => '`' + String(s).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';

function wrapItems(items, indent) {
    const out = [];
    let line = '';
    for (const it of items) {
        const piece = it + ', ';
        if (line && (indent + line + piece).length > 96) { out.push(indent + line.trimEnd()); line = ''; }
        line += piece;
    }
    if (line) out.push(indent + line.trimEnd().replace(/,$/, ''));
    return out.join('\n');
}

const out = [];
out.push('// ============================================================================');
out.push('// GENERATED FILE — DO NOT EDIT BY HAND.');
out.push('//');
out.push('// Every value here comes from the .txt content sources:');
out.push('//   assets/projects/<id>/project.txt   one per project');
out.push('//   content/{about,cv,contact}.txt     the static panels');
out.push('//');
out.push('// Edit those, then regenerate:   node tools/build-content.mjs');
out.push('// Hand edits to this file are overwritten by the next build.');
out.push('// ============================================================================');
out.push('');
out.push('function imgs(folder, entries) {');
out.push('    return entries.map(e => Array.isArray(e) ? { src: folder + e[0], label: e[1] } : { src: folder + e });');
out.push('}');
out.push('');
out.push('function sl(folder, files) {');
out.push('    return files.map(f => folder + f);');
out.push('}');
out.push('');
out.push('const PROJECTS = [');

let lastCat = null;
for (const p of projects) {
    if (p.category !== lastCat) {
        out.push(`    // ── ${p.category.toUpperCase()} ${'─'.repeat(Math.max(4, 52 - p.category.length))}`);
        lastCat = p.category;
    }
    out.push('    {');
    out.push(`        id:           ${q(p.id)},`);
    out.push(`        title:        ${q(p.title)},`);
    out.push(`        year:         ${q(p.year)},`);
    out.push(`        category:     ${q(p.category)},`);
    out.push(`        location:     ${q(p.location)},`);
    out.push(`        participants: ${q(p.participants)},`);
    out.push(`        type:         ${q(p.type)},`);
    out.push(`        description:  ${tpl(p.description)},`);
    if (p.credit) out.push(`        credit:       ${tpl(p.credit)},`);
    if (p.color) out.push(`        color:        ${q(p.color)},`);
    if (p.background) out.push(`        background:   ${q(p.background)},`);
    if (p.line) out.push(`        line:         ${q(p.line)},`);
    if (p.view) out.push(`        view:         ${JSON.stringify(p.view)},`);
    if (p.model) out.push(`        model:        ${q(p.model)},`);
    if (p.models) {
        out.push('        models:       [');
        for (const m of p.models) out.push(`            { src: ${q(m.src)}, label: ${q(m.label)} },`);
        out.push('        ],');
    }
    if (p.images) {
        const folder = `assets/projects/${p.id}/gallery/`;
        const entries = p.images.map(im => {
            const name = im.src.slice(folder.length);
            return im.label ? `[${q(name)}, ${q(im.label)}]` : q(name);
        });
        out.push(`        images:       imgs(${q(folder)}, [`);
        out.push(wrapItems(entries, '            '));
        out.push('        ]),');
    }
    if (p.slides) {
        const folder = `assets/projects/${p.id}/slides/`;
        out.push(`        slides:       sl(${q(folder)}, [`);
        out.push(wrapItems(p.slides.map(s => q(s.slice(folder.length))), '            '));
        out.push('        ]),');
    }
    out.push('    },');
}
out.push('];');
out.push('');
out.push('// ============================================================================');
out.push('// STATIC PAGES — About / CV / Contact');
out.push('// ============================================================================');
out.push('');
out.push('const STATIC = {');
for (const key of STATIC_KEYS) {
    if (!STATIC[key]) continue;
    out.push(`    ${key}: {`);
    out.push(`        title: ${q(STATIC[key].title)},`);
    out.push(`        body: ${tpl(STATIC[key].body)},`);
    out.push('    },');
}
out.push('};');
out.push('');
out.push('// ============================================================================');
out.push('// LANDING — the windows a first visitor is met by, from content/landing.txt');
out.push('// ============================================================================');
out.push('');
if (LANDING) {
    out.push('const LANDING = {');
    out.push(`    title: ${q(LANDING.title)},`);
    if (LANDING.color) out.push(`    color: ${q(LANDING.color)},`);
    if (LANDING.background) out.push(`    background: ${q(LANDING.background)},`);
    out.push(`    text: ${tpl(LANDING.text)},`);
    out.push('    windows: [');
    for (const w of LANDING.windows) {
        const bits = [];
        if (w.project) bits.push(`project: ${q(w.project)}`);
        bits.push(`kind: ${q(w.kind)}`);
        if (w.src) bits.push(`src: ${q(w.src)}`);
        if (w.which) bits.push(`which: ${w.which}`);
        if (w.slide) bits.push(`slide: ${w.slide}`);
        if (w.view) bits.push(`view: ${JSON.stringify(w.view)}`);
        if (w.at) bits.push(`at: [${w.at.join(', ')}]`);
        if (w.size) bits.push(`size: [${w.size.join(', ')}]`);
        out.push(`        { ${bits.join(', ')} },`);
    }
    out.push('    ],');
    out.push('};');
} else {
    out.push('const LANDING = null;');
}
out.push('');

const generated = out.join('\n');

// ── Report ──────────────────────────────────────────────────────────────────
for (const w of warnings) console.log(`  warn   ${w}`);
for (const e of errors) console.log(`  ERROR  ${e}`);

if (errors.length) {
    console.log(`\n${errors.length} error(s) — js/config.js NOT written.`);
    process.exit(1);
}

const target = path.join(REPO, 'js/config.js');
const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;

if (CHECK) {
    if (current === generated) {
        console.log('js/config.js is up to date.');
        process.exit(0);
    }
    console.log('js/config.js is STALE — run: node tools/build-content.mjs');
    process.exit(1);
}

if (current === generated) {
    console.log(`js/config.js unchanged — ${projects.length} projects.`);
} else {
    fs.writeFileSync(target, generated, 'utf8');
    const slides = projects.reduce((n, p) => n + (p.slides?.length || 0), 0);
    const images = projects.reduce((n, p) => n + (p.images?.length || 0), 0);
    console.log(`js/config.js written — ${projects.length} projects, ${images} gallery images, ${slides} slides auto-scanned.`);
}
if (warnings.length) console.log(`${warnings.length} warning(s) above.`);
