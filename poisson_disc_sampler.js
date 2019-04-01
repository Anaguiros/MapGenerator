/* eslint-disable filenames/match-regex */
function poissonDiscSampler(width, height, radius, rng) {
    // maximum number of samples before rejection
    const tryBeforeReject = 30;
    const maxRadius = radius * radius;
    const minRadius = 3 * maxRadius;
    const cellSize = radius * Math.SQRT1_2;

    const gridWidth = Math.ceil(width / cellSize);
    const gridHeight = Math.ceil(height / cellSize);

    const grid = new Array(gridWidth * gridHeight);

    const queue = [];
    let queueSize = 0;

    let sampleSize = 0;

    rng = rng || Math.random;

    function far(x, y) {
        let rowNumber = x / cellSize || 0;
        let colNumber = y / cellSize || 0;

        const i0 = Math.max(rowNumber - 2, 0);
        const j0 = Math.max(colNumber - 2, 0);
        const i1 = Math.min(rowNumber + 3, gridWidth);
        const j1 = Math.min(colNumber + 3, gridHeight);

        for (colNumber = j0; colNumber < j1; ++colNumber) {
            const o = colNumber * gridWidth;

            for (rowNumber = i0; rowNumber < i1; ++rowNumber) {
                let s;

                if ((s = grid[o + rowNumber])) {
                    const dx = s[0] - x;
                    const dy = s[1] - y;

                    if (Math.pow(dx, 2) + Math.pow(dy, 2) < maxRadius) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function sample(coordX, coordY) {
        const s = [ coordX, coordY ];

        queue.push(s);

        grid[(gridWidth * (coordY / cellSize || 0)) + (coordX / cellSize || 0)] = s;

        sampleSize++;
        queueSize++;

        return s;
    }

    function sampler() {
        if (!sampleSize) {
            return sample(rng() * width, rng() * height);
        }

        // Pick a random existing sample and remove it from the queue.
        while (queueSize) {
            const i = (rng() * queueSize) || 0;
            const s = queue[i];

            // Make a new candidate between [radius, 2 * radius] from the existing sample.
            for (const j = 0; j < tryBeforeReject; ++j) {
                const a = 2 * Math.PI * rng();
                const currentRadius = (Math.sqrt(rng() * minRadius) + maxRadius);
                const x = s[0] + (currentRadius * Math.cos(a));
                const y = s[1] + (currentRadius * Math.sin(a));

                // Reject candidates that are outside the allowed extent, or closer than 2 * radius to any existing sample.
                if (x >= 0 && x < width && y >= 0 && y < height && far(x, y)) {
                    return sample(x, y);
                }
            }

            queue[i] = queue[--queueSize];
            queue.length = queueSize;
        }
        return null;
    }

    return sampler();
}

export { poissonDiscSampler };
