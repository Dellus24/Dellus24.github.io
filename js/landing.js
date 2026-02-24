document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.circle-container');
    if (!container || typeof words === 'undefined' || typeof layouts === 'undefined') return;

    const total = words.length;

    // Pick a random layout
    const layout = layouts[Math.floor(Math.random() * layouts.length)];

    words.forEach((wordData, index) => {
        const pos = layout.position(index, total);

        const el = document.createElement('div');
        el.classList.add('word');
        el.style.left = pos.x + '%';
        el.style.top = pos.y + '%';
        el.style.transform = 'translate(-50%, -50%)';

        if (wordData.link) {
            const link = document.createElement('a');
            link.href = wordData.link;
            link.classList.add('word-link');
            link.textContent = wordData.text;
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
            popup.appendChild(arrowLink);

            el.appendChild(popup);

            // Position popup smartly
            if (pos.y > 60) {
                popup.style.bottom = '100%';
                popup.style.marginBottom = '8px';
            } else {
                popup.style.top = '100%';
                popup.style.marginTop = '8px';
            }

            if (pos.x > 60) {
                popup.style.right = '0';
            } else {
                popup.style.left = '0';
            }

            // Hover events
            el.addEventListener('mouseenter', () => {
                link.style.color = wordData.color;
                popup.classList.add('active');
            });

            el.addEventListener('mouseleave', () => {
                link.style.color = '';
                popup.classList.remove('active');
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
});