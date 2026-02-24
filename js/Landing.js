document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.circle-container');
    if (!container || typeof words === 'undefined' || typeof layouts === 'undefined') return;

    const total = words.length;

    // Pick a random layout
    const layout = layouts[Math.floor(Math.random() * layouts.length)];

    // Create all word elements first (invisible)
    const elements = words.map((wordData, index) => {
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
            el.appendChild(link);
        }

        container.appendChild(el);

        return { el, wordData };
    });

    // Typewriter function: types one word, then calls next
    function typeWord(index) {
        if (index >= elements.length) return;

        const { el, wordData } = elements[index];
        const text = wordData.text;
        const target = wordData.link ? el.querySelector('.word-link') : el;
        let charIndex = 0;

        el.classList.add('typing');

        // Measure the full width we need
        target.textContent = text;
        el.style.width = el.scrollWidth + 'px';
        target.textContent = '';
        el.style.width = '0';

        function typeChar() {
            if (charIndex < text.length) {
                target.textContent = text.substring(0, charIndex + 1);
                el.style.width = el.scrollWidth + 'px';
                charIndex++;
                setTimeout(typeChar, 30);
            } else {
                // Word complete
                el.classList.remove('typing');
                el.classList.add('done');
                el.style.width = el.scrollWidth + 'px';
                // Pause then start next word
                setTimeout(() => typeWord(index + 1), 150);
            }
        }

        typeChar();
    }

    // Start typing the first word after a short delay
    setTimeout(() => typeWord(0), 400);
});