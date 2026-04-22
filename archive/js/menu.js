/* === SITE MENU — font slider + color palette, persisted via localStorage === */
(function () {
    'use strict';

    // Background color palettes (paper/canvas tones — all light, monochrome-text-safe)
    // Adapted from BrandingCard color-swatch concept: each entry is one swatch.
    const PALETTES = [
        { id: 'paper',   bg: '#f5fccc', label: 'Paper'   },
        { id: 'cream',   bg: '#f0ede5', label: 'Cream'   },
        { id: 'slate',   bg: '#e8ecf0', label: 'Slate'   },
        { id: 'rose',    bg: '#f0e4e4', label: 'Rose'    },
        { id: 'mint',    bg: '#e4f0e6', label: 'Mint'    },
        { id: 'warm',    bg: '#f5f0e8', label: 'Warm'    },
    ];

    const FONT_MIN     = 0.75;
    const FONT_MAX     = 1.50;
    const FONT_DEFAULT = 1.00;
    const FONT_STEP    = 0.05;

    // Detect if we're inside the /pages/ subdirectory
    const inPages = /\/pages\//.test(location.pathname);
    const root    = inPages ? '../' : '';

    // Identify current page for active nav highlight
    const p = location.pathname;
    const currentPage = (p.endsWith('index.html') || p.endsWith('/') || p === '')
        ? 'home'
        : p.includes('projects') ? 'projects'
        : p.includes('/cv')      ? 'cv'
        : '';

    // ── Apply helpers ──────────────────────────────────────────────────────────

    function applyBg(hex, save, id) {
        document.documentElement.style.setProperty('--bg', hex);
        document.body.style.background = hex;

        document.querySelectorAll('.menu-swatch[data-id]').forEach(s => {
            s.classList.toggle('active', s.dataset.id === (id || '__custom__'));
        });

        if (save) {
            localStorage.setItem('site-bg-id',  id  || '__custom__');
            localStorage.setItem('site-bg-hex', hex);
        }
    }

    function applyFontScale(scale, save) {
        document.documentElement.style.fontSize = (scale * 16) + 'px';
        document.documentElement.style.setProperty('--font-scale', scale);
        if (save) localStorage.setItem('site-font-scale', scale);
    }

    // ── Build DOM ──────────────────────────────────────────────────────────────

    function sep() {
        const d = document.createElement('div');
        d.className = 'menu-sep';
        return d;
    }

    function buildMenu() {
        const menu = document.createElement('div');
        menu.id = 'site-menu';
        menu.setAttribute('role', 'toolbar');
        menu.setAttribute('aria-label', 'Site controls');

        // ── Navigation group ──
        const navGroup = document.createElement('div');
        navGroup.className = 'menu-group menu-nav';

        [
            { label: 'Home',     href: root + 'index.html',        id: 'home'     },
            { label: 'Projects', href: root + 'pages/projects.html', id: 'projects' },
            { label: 'CV',       href: root + 'pages/cv.html',       id: 'cv'       },
        ].forEach(item => {
            const a = document.createElement('a');
            a.href      = item.href;
            a.className = 'menu-nav-item' + (item.id === currentPage ? ' menu-nav-active' : '');
            a.textContent = item.label;
            navGroup.appendChild(a);
        });

        menu.appendChild(navGroup);
        menu.appendChild(sep());

        // ── Font slider group ──
        const fontGroup = document.createElement('div');
        fontGroup.className = 'menu-group menu-font-ctrl';

        const labelSm = document.createElement('span');
        labelSm.className   = 'menu-label';
        labelSm.textContent = 'Aa';
        labelSm.title       = 'Font size';

        const slider = document.createElement('input');
        slider.type      = 'range';
        slider.className = 'menu-slider';
        slider.min       = FONT_MIN;
        slider.max       = FONT_MAX;
        slider.step      = FONT_STEP;
        slider.value     = FONT_DEFAULT;
        slider.setAttribute('aria-label', 'Font size');
        slider.addEventListener('input', () => applyFontScale(parseFloat(slider.value), true));

        const labelLg = document.createElement('span');
        labelLg.className   = 'menu-label-lg';
        labelLg.textContent = 'Aa';
        labelLg.title       = 'Font size';

        fontGroup.appendChild(labelSm);
        fontGroup.appendChild(slider);
        fontGroup.appendChild(labelLg);
        menu.appendChild(fontGroup);
        menu.appendChild(sep());

        // ── Color palette group ──
        const colorGroup = document.createElement('div');
        colorGroup.className = 'menu-group menu-colors';

        PALETTES.forEach(p => {
            const btn = document.createElement('button');
            btn.className        = 'menu-swatch';
            btn.dataset.id       = p.id;
            btn.title            = p.label;
            btn.style.background = p.bg;
            btn.setAttribute('aria-label', p.label + ' theme');
            btn.addEventListener('click', () => applyBg(p.bg, true, p.id));
            colorGroup.appendChild(btn);
        });

        // Custom color "+" button
        const customLabel = document.createElement('label');
        customLabel.className = 'menu-swatch menu-swatch-custom';
        customLabel.title     = 'Custom color';
        customLabel.setAttribute('aria-label', 'Custom background color');
        customLabel.textContent = '+';

        const colorInput = document.createElement('input');
        colorInput.type      = 'color';
        colorInput.className = 'menu-color-input';
        colorInput.value     = '#f5fccc';
        colorInput.addEventListener('input', () => {
            applyBg(colorInput.value, true, '__custom__');
        });

        customLabel.appendChild(colorInput);
        colorGroup.appendChild(customLabel);
        menu.appendChild(colorGroup);

        document.body.appendChild(menu);
        return slider;
    }

    // ── Restore saved preferences ─────────────────────────────────────────────

    function restore(slider) {
        // Font scale
        const savedScale = parseFloat(localStorage.getItem('site-font-scale'));
        if (!isNaN(savedScale) && savedScale >= FONT_MIN && savedScale <= FONT_MAX) {
            slider.value = savedScale;
            applyFontScale(savedScale, false);
        }

        // Background color
        const savedId  = localStorage.getItem('site-bg-id');
        const savedHex = localStorage.getItem('site-bg-hex');
        if (savedId && savedHex) {
            applyBg(savedHex, false, savedId);
        } else {
            // Mark default palette entry as active
            const defaultSwatch = document.querySelector('.menu-swatch[data-id="paper"]');
            if (defaultSwatch) defaultSwatch.classList.add('active');
        }
    }

    // ── Init ──────────────────────────────────────────────────────────────────

    function init() {
        const slider = buildMenu();
        restore(slider);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
