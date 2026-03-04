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

        // Store reference
        wordElements.push({ el, wordData, pos });

        if (wordData.link) {
            const link = document.createElement('a');
            link.href = wordData.link;
            link.classList.add('word-link');
            link.textContent = wordData.text;

            // Intercept click for exit animation
            link.addEventListener('click', (e) => {
                e.preventDefault();
                triggerExitAnimation(wordData.link);
            });

            el.appendChild(link);

            // Create popup
            const popup = document.createElement('div');
            popup.classList.add('word-popup');

            // Popup image
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

            // Popup arrow link
            const arrowLink = document.createElement('a');
            arrowLink.href = wordData.link;
            arrowLink.classList.add('word-popup-arrow');
            arrowLink.textContent = '→';

            // Also intercept arrow click
            arrowLink.addEventListener('click', (e) => {
                e.preventDefault();
                triggerExitAnimation(wordData.link);
            });

            popup.appendChild(arrowLink);
            el.appendChild(popup);

            // Position popup smartly
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

            // Hover behavior
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

        // Fade in one by one with delay
        setTimeout(() => {
            el.classList.add('visible');
        }, 300 + (index * 250));
    });

    // ============================================
    // EXIT ANIMATION
    // ============================================
    let isAnimating = false;

    function triggerExitAnimation(targetLink) {
        if (isAnimating) return;
        isAnimating = true;

        // Hide all popups immediately
        document.querySelectorAll('.word-popup').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        // Get the container rect to calculate absolute positions
        const containerRect = container.getBoundingClientRect();

        // Separate linked and non-linked words
        const linkedWords = wordElements.filter(w => w.wordData.link);
        const nonLinkedWords = wordElements.filter(w => !w.wordData.link);

        // Fade out non-linked words
        nonLinkedWords.forEach((w, i) => {
            w.el.style.transition = `opacity 0.4s ease ${i * 0.03}s`;
            w.el.style.opacity = '0';
        });

        // Calculate target positions for linked words (top-left stack)
        // Target: top-left of the viewport, small nav row
        const targetTop = 20; // px from top of viewport
        const targetLeftStart = 28; // px from left

        // Get linked words sorted in their original order
        const navOrder = linkedWords.sort((a, b) => {
            const orderA = words.indexOf(a.wordData);
            const orderB = words.indexOf(b.wordData);
            return orderA - orderB;
        });

        // Move each linked word to its target position
        navOrder.forEach((w, i) => {
            const el = w.el;
            const currentRect = el.getBoundingClientRect();

            // Calculate where this word needs to go
            // Stack them vertically with small gap
            const targetX = targetLeftStart;
            const targetY = targetTop + (i * 22);

            // Calculate delta from current position
            const deltaX = targetX - currentRect.left;
            const deltaY = targetY - currentRect.top;

            // Apply transition
            el.style.transition = `transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${i * 0.05}s, 
                                   font-size 0.5s ease ${i * 0.05}s,
                                   opacity 0.5s ease ${i * 0.05}s`;
            el.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
            el.style.fontSize = '0.6rem';

            // Remove color/bold from links
            const link = el.querySelector('.word-link');
            if (link) {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });

        // Store transition info and navigate
        sessionStorage.setItem('nav-transition', JSON.stringify({
            from: 'landing',
            target: targetLink,
            linkedWords: navOrder.map(w => ({
                text: w.wordData.text,
                link: w.wordData.link,
                color: w.wordData.color,
            }))
        }));

        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = targetLink;
        }, 600);
    }
});