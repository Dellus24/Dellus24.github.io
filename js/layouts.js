const layouts = [

    // === 1. LEFT HALF CIRCLE ===
    {
        name: "left-arc",
        position: (index, total) => {
            const startAngle = -90;
            const endAngle = 90;
            const angleStep = (endAngle - startAngle) / (total - 1);
            const angle = startAngle + (angleStep * index);
            const angleRad = (angle * Math.PI) / 180;
            const radius = 40;
            const x = 30 + radius * Math.cos(angleRad);
            const y = 50 + radius * Math.sin(angleRad);
            return { x, y };
        }
    },

    // === 2. DIAGONAL LINE (top-left to bottom-right) ===
    {
        name: "diagonal",
        position: (index, total) => {
            const startX = 15;
            const endX = 85;
            const startY = 10;
            const endY = 90;
            const t = index / (total - 1);
            const x = startX + t * (endX - startX);
            const y = startY + t * (endY - startY);
            return { x, y };
        }
    },

    // === 3. SCATTERED (predefined positions with controlled randomness) ===
    {
        name: "scatter",
        position: (index, total) => {
            // Hand-placed positions that feel organic but balanced
            const positions = [
                { x: 12, y: 15 },
                { x: 72, y: 8 },
                { x: 38, y: 25 },
                { x: 82, y: 30 },
                { x: 18, y: 45 },
                { x: 55, y: 42 },
                { x: 8, y: 65 },
                { x: 65, y: 58 },
                { x: 40, y: 72 },
                { x: 78, y: 75 },
                { x: 25, y: 88 },
                { x: 60, y: 90 },
            ];
            // If more words than positions, wrap around
            return positions[index % positions.length];
        }
    },

    // === 4. VERTICAL STACK (centered) ===
    {
        name: "vertical",
        position: (index, total) => {
            const startY = 8;
            const endY = 92;
            const step = (endY - startY) / (total - 1);
            const x = 50;
            const y = startY + (step * index);
            return { x, y };
        }
    },

    // === 5. HOUSE SHAPE ===
    {
        name: "house",
        position: (index, total) => {
            // A simple house: triangle roof + rectangle base
            // Roof peak at top center, two corners, then four corners of the base
            // Words are distributed along this path
            const housePoints = [
                { x: 50, y: 10 },   // roof peak
                { x: 38, y: 18 },   // left roof slope
                { x: 26, y: 28 },   // left roof corner
                { x: 74, y: 28 },   // right roof corner (skip across)
                { x: 62, y: 18 },   // right roof slope
                { x: 26, y: 42 },   // left wall upper
                { x: 74, y: 42 },   // right wall upper
                { x: 26, y: 58 },   // left wall mid
                { x: 74, y: 58 },   // right wall mid
                { x: 26, y: 75 },   // left wall lower / base corner
                { x: 50, y: 75 },   // base center (door)
                { x: 74, y: 75 },   // right base corner
            ];
            return housePoints[index % housePoints.length];
        }
    },

];