/* eslint-disable filenames/match-regex */
function poissonDiscSampler(width, height, radius, rng) {
    const k = 30; // maximum number of samples before rejection
    const radiusSquare = radius * radius;
    const RadiusSquareThree = 3 * radiusSquare;
    const cellSize = radius * Math.SQRT1_2;

    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);

    const grid = new Array(gridWidth * gridHeight);

    const queue = [];
    let queueSize = 0;

    let sampleSize = 0;

    rng = rng || Math.random;

    function far(x, y) {
        let i = (x / cellSize) | 0;
        let j = (y / cellSize) | 0;

        const i0 = Math.max(i - 2, 0);
        const j0 = Math.max(j - 2, 0);
        const i1 = Math.min(i + 3, gridWidth);
        const j1 = Math.min(j + 3, gridHeight);

        for (j = j0; j < j1; ++j) {
            const o = j * gridWidth;

            for (i = i0; i < i1; ++i) {
                let s;

                if ((s = grid[o + i])) {
                    let dx = s[0] - x;
                    let dy = s[1] - y;

                    if (dx * dx + dy * dy < radiusSquare) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function sample(x, y) {
        let s = [x, y];

        queue.push(s);

        grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;

        sampleSize++;
        queueSize++;

        return s;
    }

    return function () {
        if (!sampleSize) {
            return sample(rng() * width, rng() * height);
        }

        // Pick a random existing sample and remove it from the queue.
        while (queueSize) {
            const i = rng() * queueSize | 0;
            const s = queue[i];

            // Make a new candidate between [radius, 2 * radius] from the existing
            // sample.
            for (let j = 0; j < k; ++j) {
                const a = 2 * Math.PI * rng();
                const r = Math.sqrt(rng() * RadiusSquareThree + radiusSquare);
                const x = s[0] + r * Math.cos(a);
                const y = s[1] + r * Math.sin(a);

                // Reject candidates that are outside the allowed extent,
                // or closer than 2 * radius to any existing sample.
                if (x >= 0 && x < width && y >= 0 && y < height && far(x, y)) {
                    return sample(x, y);
                }
            }

            queue[i] = queue[--queueSize];
            queue.length = queueSize;
        }
    };
}
export { poissonDiscSampler };
