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
const BLOCK_KEYS = ['gallery', 'slides', 'models', 'credit'];

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
