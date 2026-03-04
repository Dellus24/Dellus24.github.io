document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.circle-container');
    if (!container || typeof words === 'undefined' || typeof layouts === 'undefined') return;

    const total = words.length;

    // Pick a random layout
    const layout = layouts[Math.floor(Math.random() * layouts.length)];

    // Store element references for exit animation
    const wordElements = [];

    words.forEach((wordData, index) => {
        const pos = layout.position(index, total);

        const el = document.createElement('div');
        el.classList.add('word');
        el.style.left = pos.x + '%';
        el.style.top = pos.y + '%';
        el.style.transform = 'translate(-50%, -50%)';

        wordElements.push({ el, wordData, pos });

        if (wordData.link) {
            const link = document.createElement('a');
            link.href = wordData.link;
            link.classList.add('word-link');
            link.textContent = wordData.text;

            // Intercept click for exit animation
            link.addEventListener('click', (e) => {
                e.preventDefault();
                triggerExitAnimation(wordData);
            });

            el.appendChild(link);

            // Create popup
            const popup = document.createElement('div');
            popup.classList.add('word-popup');

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('word-popup-image');

            if (wordData.image) {
                const img = document.createElement('img');
                img.src = wordData.image;
                img.alt = wordData.text + ' preview';
                img.onerror = () => {
                    imageContainer.innerHTML = '';
                    const placeholder = document.createElement('span');
                    placeholder.classList.add('word-popup-image-placeholder');
                    placeholder.textContent = '[ ' + wordData.text + ' ]';
                    imageContainer.appendChild(placeholder);
                };
                imageContainer.appendChild(img);
            } else {
                const placeholder = document.createElement('span');
                placeholder.classList.add('word-popup-image-placeholder');
                placeholder.textContent = '[ ' + wordData.text + ' ]';
                imageContainer.appendChild(placeholder);
            }

            popup.appendChild(imageContainer);

            const arrowLink = document.createElement('a');
            arrowLink.href = wordData.link;
            arrowLink.classList.add('word-popup-arrow');
            arrowLink.textContent = '→';
            arrowLink.addEventListener('click', (e) => {
                e.preventDefault();
                triggerExitAnimation(wordData);
            });
            popup.appendChild(arrowLink);

            el.appendChild(popup);

            if (pos.y > 60) {
                popup.style.bottom = '100%';
                popup.classList.add('popup-above');
            } else {
                popup.style.top = '100%';
            }

            if (pos.x > 60) {
                popup.style.right = '0';
            } else {
                popup.style.left = '0';
            }

            let hideTimeout;

            el.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                el.classList.add('hovered');
                link.style.color = wordData.color;
                popup.classList.add('active');
            });

            el.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    el.classList.remove('hovered');
                    link.style.color = '';
                    popup.classList.remove('active');
                }, 150);
            });

            popup.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
            });

            popup.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    el.classList.remove('hovered');
                    link.style.color = '';
                    popup.classList.remove('active');
                }, 150);
            });

        } else {
            el.textContent = wordData.text;
        }

        container.appendChild(el);

        setTimeout(() => {
            el.classList.add('visible');
        }, 300 + (index * 250));
    });

    // ============================================
    // EXIT ANIMATION
    // ============================================
    let isAnimating = false;

    function triggerExitAnimation(clickedWord) {
        if (isAnimating) return;
        isAnimating = true;

        // Hide all popups
        document.querySelectorAll('.word-popup').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        const nonLinkedWords = wordElements.filter(w => !w.wordData.link);
        const linkedWords = wordElements.filter(w => w.wordData.link);

        // The clicked word = the page we're going to (e.g. Projects)
        // Other linked words = top-left row nav (About, Contact, CV)
        const clickedEl = linkedWords.find(w => w.wordData.text === clickedWord.text);
        const otherLinked = linkedWords.filter(w => w.wordData.text !== clickedWord.text);

        // 1. Fade out non-linked words
        nonLinkedWords.forEach((w, i) => {
            w.el.style.transition = `opacity 0.4s ease ${i * 0.03}s`;
            w.el.style.opacity = '0';
        });

        // 2. Move OTHER linked words to top-left as a horizontal row
        // Target: top-left corner, small row
        let accumulatedLeft = 28; // px from left edge

        otherLinked.forEach((w, i) => {
            const el = w.el;
            const currentRect = el.getBoundingClientRect();

            const targetX = accumulatedLeft;
            const targetY = 22;

            const deltaX = targetX - currentRect.left;
            const deltaY = targetY - currentRect.top;

            el.style.transition = `transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.05}s, 
                                   font-size 0.5s ease ${i * 0.05}s,
                                   opacity 0.5s ease ${i * 0.05}s`;
            el.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            el.style.fontSize = '0.55rem';

            const link = el.querySelector('.word-link');
            if (link) {
                link.style.color = '';
                link.style.fontWeight = '';
            }

            // Estimate width for next word position
            accumulatedLeft += (w.wordData.text.length * 6.5) + 18;
        });

        // 3. Move CLICKED word to content area position (below the top row)
        if (clickedEl) {
            const el = clickedEl.el;
            const currentRect = el.getBoundingClientRect();

            const targetX = 28;
            const targetY = 70; // below the top nav row

            const deltaX = targetX - currentRect.left;
            const deltaY = targetY - currentRect.top;

            el.style.transition = `transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s, 
                                   opacity 0.5s ease 0.1s`;
            el.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

            const link = el.querySelector('.word-link');
            if (link) {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        }

        // Store transition data
        sessionStorage.setItem('nav-transition', 'true');

        // Navigate after animation
        setTimeout(() => {
            window.location.href = clickedWord.link;
        }, 620);
    }
});