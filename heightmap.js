import { worldState } from './world.js';
import { normalizeValue, getPointInRange, getPathPolygon, getDownhillPolygon } from './utils.js';

function initHeights() {
    for (let i = 0; i < worldState.sites.length; i++) {
        worldState.sites[i].height = 0;
    }
}

function initializeOptions(countMin = 0, countMax = 1, heightMin = 0, heightMax = worldState.altitudeMax, rangeXMin = 0, rangeXMax = worldState.widthCanvas, rangeYMin = 0, rangeYMax = worldState.heightCanvas) {
    const options = {
        countMin,
        countMax,
        heightMin,
        heightMax,
        rangeXMin,
        rangeXMax,
        rangeYMin,
        rangeYMax,
    };

    return options;
}


function add(polygonStartID, type) {
    const explorationQueue = [];
    const exploredPolygon = new Array(worldState.sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = false;
    }

    let height = highInput.valueAsNumber;
    const radius = radiusInput.valueAsNumber;
    const sharpness = sharpnessInput.valueAsNumber;

    worldState.sites[polygonStartID].height += height;
    exploredPolygon[polygonStartID] = true;
    explorationQueue.push(polygonStartID);
    for (let i = 0; i < explorationQueue.length && height > 0.01; i++) {
        if (type === 'island') {
            height = (worldState.sites[explorationQueue[i]].height * radius) - (height / 100);
        } else {
            height *= radius;
        }
        for (const neighborID of worldState.delaunay.neighbors(explorationQueue[i])) {
            if (!exploredPolygon[neighborID]) {
                let noise = (Math.random() * sharpness) + 1.1 - sharpness;
                if (sharpness === 0) {
                    noise = 1;
                }
                worldState.sites[neighborID].height += height * noise;
                if (worldState.sites[neighborID].height > worldState.altitudeMax) {
                    worldState.sites[neighborID].height = worldState.altitudeMax;
                }
                exploredPolygon[neighborID] = true;
                explorationQueue.push(neighborID);
            }
        }
    }
}

function multiplyHeight(heightMin, heightMax, factor) {
    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].height >= heightMin && worldState.sites[i].height <= heightMax) {
            if (heightMin === worldState.altitudeOcean) {
                worldState.sites[i].height = normalizeValue((worldState.sites[i].height - worldState.altitudeOcean) * factor) + worldState.altitudeOcean;
            } else {
                worldState.sites[i].height = normalizeValue(worldState.sites[i].height * factor);
            }
        }
    }
}

function addHeight(heightMin, heightMax, factor) {
    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].height >= heightMin && worldState.sites[i].height <= heightMax) {
            if (heightMin === worldState.altitudeOcean) {
                worldState.sites[i].height = normalizeValue(Math.max(worldState.sites[i].height + factor, worldState.altitudeOcean));
            } else {
                worldState.sites[i].height = normalizeValue(worldState.sites[i].height + factor);
            }
        }
    }
}

function smooth(factor = 2) {
    const smoothedHeights = new Array(worldState.sites.length);
    for (let polygonCurrentID = 0; polygonCurrentID < worldState.sites.length; polygonCurrentID++) {
        const localHeights = [ worldState.sites[polygonCurrentID].height ];
        for (const neighborID of worldState.delaunay.neighbors(polygonCurrentID)) {
            localHeights.push(worldState.sites[neighborID].height);
        }
        smoothedHeights[polygonCurrentID] = normalizeValue(((worldState.sites[polygonCurrentID].height * (factor - 1)) + d3.mean(localHeights)) / factor);
    }

    for (let i = 0; i < smoothedHeights.length; i++) {
        worldState.sites[i].height = smoothedHeights[i];
    }
}

function addHill(options) {
    let polygonStartID = -1;
    let limit = 0;
    const height = normalizeValue(Math.floor(Math.random() * (options.heightMax - options.heightMin + 1)) + options.heightMin);

    const explorationQueue = [];
    const exploredPolygon = new Array(worldState.sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = 0;
    }

    do {
        const mapX = getPointInRange(options.rangeXMin, options.rangeXMax, worldState.widthCanvas);
        const mapY = getPointInRange(options.rangeYMin, options.rangeYMax, worldState.heightCanvas);
        polygonStartID = worldState.delaunay.find(mapX, mapY);
        limit++;
    } while (worldState.sites[polygonStartID].height + height > 90 && limit < 50);

    explorationQueue.push(polygonStartID);
    exploredPolygon[polygonStartID] = height;

    while (explorationQueue.length > 0) {
        const polygonCurrentID = explorationQueue.shift();

        for (const neighborID of worldState.delaunay.neighbors(polygonCurrentID)) {
            if (exploredPolygon[neighborID] > 0) {
                continue;
            }
            exploredPolygon[neighborID] = (exploredPolygon[polygonCurrentID] ** 0.98) * ((Math.random() * 0.2) + 0.9);
            if (exploredPolygon[neighborID] > 1) {
                explorationQueue.push(neighborID);
            }
        }
    }

    for (let index = 0; index < exploredPolygon.length; index++) {
        if (exploredPolygon[index] > 0) {
            worldState.sites[index].height += exploredPolygon[index];
        }
    }
}

function addHills(options) {
    let count = Math.floor(Math.random() * (options.countMax - options.countMin + 1)) + options.countMin;
    while (count >= 1 || Math.random() < count) {
        addHill(options);
        count--;
    }
}

function propagateRangeHeight(options, explorationQueue, exploredPolygon) {
    let height = normalizeValue(Math.floor(Math.random() * (options.heightMax - options.heightMin + 1)) + options.heightMin);
    let localQueue = explorationQueue;

    while (localQueue.length > 0) {
        const frontier = localQueue.slice();
        localQueue = [];

        for (let index = 0; index < frontier.length; index++) {
            worldState.sites[frontier[index]].height = normalizeValue((worldState.sites[frontier[index]].height + height) * ((Math.random() * 0.3) + 0.85));
        }
        height = (height ** 0.82) - 1;
        if (height < 2) {
            break;
        }
        for (let index = 0; index < frontier.length; index++) {
            for (const neighborID of worldState.delaunay.neighbors(frontier[index])) {
                if (exploredPolygon[neighborID] === 0) {
                    localQueue.push(neighborID);
                    exploredPolygon[neighborID] = 1;
                }
            }
        }
    }
}

function propagateRangeProminences(range) {
    for (let index = 0; index < range.length; index++) {
        // const element = range[index];
        if (index % 6 === 0) {
            const min = getDownhillPolygon(range[index]);
            worldState.sites[min].height = (worldState.sites[range[index]].height * 2) + (worldState.sites[min].height / 3);
        } else {
            continue;
        }
    }
}

function addRange(options) {
    const exploredPolygon = new Array(worldState.sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = 0;
    }

    const startX = getPointInRange(options.rangeXMin, options.rangeXMax, worldState.widthCanvas);
    const startY = getPointInRange(options.rangeYMin, options.rangeYMax, worldState.heightCanvas);

    let distance = 0;
    let limit = 0;
    let endX = 0;
    let endY = 0;

    do {
        endX = (Math.random() * worldState.widthCanvas * 0.8) + (worldState.widthCanvas * 0.1);
        endY = (Math.random() * worldState.heightCanvas * 0.7) + (worldState.heightCanvas * 0.15);
        distance = Math.abs(endY - startY) + Math.abs(endX - startX);
        limit++;
    } while ((distance < worldState.widthCanvas / 8 || distance > worldState.widthCanvas / 3) && limit < 50);

    const range = getPathPolygon(worldState.delaunay.find(startX, startY), worldState.delaunay.find(endX, endY), exploredPolygon);

    propagateRangeHeight(options, range.slice(), exploredPolygon);
    propagateRangeProminences(range);
}

function addRanges(options) {
    let count = Math.floor(Math.random() * (options.countMax - options.countMin + 1)) + options.countMin;
    while (count >= 1 || Math.random() < count) {
        addRange(options);
        count--;
    }
}

function addTrough(options) {
    const exploredPolygon = new Array(worldState.sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = 0;
    }

    let distance = 0;
    let limit = 0;
    let startX = 0;
    let startY = 0;
    let polygonStartID = -1;
    let endX = 0;
    let endY = 0;

    do {
        startX = getPointInRange(options.rangeXMin, options.rangeXMax, worldState.widthCanvas);
        startY = getPointInRange(options.rangeYMin, options.rangeYMax, worldState.heightCanvas);
        polygonStartID = worldState.delaunay.find(startX, startY);
        limit++;
    } while (worldState.sites[polygonStartID].height < worldState.altitudeOcean && limit < 50);

    limit = 0;
    do {
        endX = (Math.random() * worldState.widthCanvas * 0.8) + (worldState.widthCanvas * 0.1);
        endY = (Math.random() * worldState.heightCanvas * 0.7) + (worldState.heightCanvas * 0.15);
        distance = Math.abs(endY - startY) + Math.abs(endX - startX);
        limit++;
    } while ((distance < worldState.widthCanvas / 8 || distance > worldState.widthCanvas / 2) && limit < 50);

    const range = getPathPolygon(polygonStartID, worldState.delaunay.find(endX, endY), exploredPolygon);

    propagateRangeHeight(options, range.slice(), exploredPolygon);
    propagateRangeProminences(range);
}

function addTroughs(options) {
    let count = Math.floor(Math.random() * (options.countMax - options.countMin + 1)) + options.countMin;
    while (count >= 1 || Math.random() < count) {
        addTrough(options);
        count--;
    }
}

function addPit(options) {
    const exploredPolygon = new Array(worldState.sites.length);

    for (let i = 0; i < exploredPolygon.length; i++) {
        exploredPolygon[i] = 0;
    }

    let height = normalizeValue(Math.floor(Math.random() * (options.heightMax - options.heightMin + 1)) + options.heightMin);
    let limit = 0;
    let polygonStartID = -1;

    do {
        const pitX = getPointInRange(options.rangeXMin, options.rangeXMax, worldState.widthCanvas);
        const pitY = getPointInRange(options.rangeYMin, options.rangeYMax, worldState.heightCanvas);
        polygonStartID = worldState.delaunay.find(pitX, pitY);
        limit++;
    } while (worldState.sites[polygonStartID].height < worldState.altitudeOcean && limit < 50);

    const explorationQueue = [ polygonStartID ];
    while (explorationQueue.length > 0) {
        const currentID = explorationQueue.shift();
        height = (height ** 0.98) * ((Math.random() * 0.2) + 0.9);
        if (height < 1) {
            return;
        }

        for (const neighborID of worldState.delaunay.neighbors(currentID)) {
            if (exploredPolygon[neighborID] === 1) {
                return;
            }

            worldState.sites[neighborID].height = normalizeValue(worldState.sites[neighborID].height - (height * ((Math.random() * 0.2) + 0.9)));
            exploredPolygon[neighborID] = 1;
            explorationQueue.push(neighborID);
        }
    }
}

function addPits(options) {
    let count = Math.floor(Math.random() * (options.countMax - options.countMin + 1)) + options.countMin;
    while (count >= 1 || Math.random() < count) {
        addPit(options);
        count--;
    }
}

function templateVolcano() {
    addHills(initializeOptions(1, 1, 90, 100, 44, 56, 40, 60));
    multiplyHeight(50, 100, 0.8);
    addRanges(initializeOptions(1, 2, 30, 55, 44, 55, 40, 60));
    smooth(2);
    addHills(initializeOptions(1, 2, 25, 35, 25, 30, 20, 75));
    addHills(initializeOptions(1, 1, 25, 35, 75, 80, 25, 75));
    addHills(initializeOptions(0, 1, 20, 25, 10, 15, 20, 25));
}

function templateHighIsland() {
    addHills(initializeOptions(1, 1, 90, 100, 65, 75, 47, 53));
    addHeight(0, 100, 5);
    addHills(initializeOptions(6, 6, 20, 23, 25, 55, 45, 55));
    addRanges(initializeOptions(1, 1, 40, 50, 45, 55, 45, 55));
    smooth(2);
    addTroughs(initializeOptions(2, 3, 20, 30, 20, 30, 20, 30));
    addTroughs(initializeOptions(2, 3, 20, 30, 60, 80, 70, 80));
    addHills(initializeOptions(1, 1, 10, 15, 60, 60, 50, 50));
    addHills(initializeOptions(1, 2, 13, 16, 15, 20, 20, 75));
    multiplyHeight(20, 100, 0.8);
    addRanges(initializeOptions(1, 2, 30, 40, 15, 85, 30, 40));
    addRanges(initializeOptions(1, 2, 30, 40, 15, 85, 60, 70));
    addPits(initializeOptions(2, 3, 10, 15, 15, 85, 20, 80));
  }

function templateAtoll() {
    addHills(initializeOptions(1, 1, 75, 80, 50, 60, 45, 55));
    addHills(initializeOptions(1, 2, 30, 50, 25, 75, 30, 70));
    addHills(initializeOptions(0, 1, 30, 50, 25, 35, 30, 70));
    smooth(1);
    multiplyHeight(25, 100, 0.2);
    addHills(initializeOptions(0, 1, 10, 20, 50, 55, 48, 52));
}

function randomizaTemplate() {
    const randomTemplate = Math.random();
    if (randomTemplate < 0.05) {
        templateInput.value = 'volcano';
    } else if (randomTemplate < 0.25) {
        templateInput.value = 'highIsland';
    } else if (randomTemplate < 0.35) {
        templateInput.value = 'lowIsland';
    } else if (randomTemplate < 0.55) {
        templateInput.value = 'continents';
    } else if (randomTemplate < 0.85) {
        templateInput.value = 'archipelago';
    } else if (randomTemplate < 0.90) {
        templateInput.value = 'mediterranean';
    } else if (randomTemplate < 0.95) {
        templateInput.value = 'peninsula';
    } else if (randomTemplate < 0.99) {
        templateInput.value = 'pangea';
    } else {
        templateInput.value = 'atoll';
    }
}

function generateHeights() {
    if (randomTemplate.checked) {
        randomizaTemplate();
    }

    switch (templateInput.value) {
    case 'volcano':
        templateVolcano();
        break;
    case 'highIsland':
        templateHighIsland();
        break;
    case 'lowIsland':
        templateLowIsland();
        break;
    case 'continents':
        templateContinents();
        break;
    case 'archipelago':
        templateArchipelago();
        break;
    case 'atoll':
        templateAtoll();
        break;
    case 'mediterranean':
        templateMediterranean();
        break;
    case 'peninsula':
        templatePeninsula();
        break;
    case 'pangea':
        templatePangea();
        break;
    default:
        break;
    }
}

function downcutCoastLine() {
    const downcut = downcuttingInput.valueAsNumber;
    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].height >= worldState.altitudeOcean) {
            worldState.sites[i].height -= downcut;
        }
    }
}

function resolveDepression() {
    worldState.landPolygonID = [];
    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].height >= worldState.altitudeOcean) {
            worldState.landPolygonID.push(i);
        }
    }

    let depression = 1;
    let minCell = -1;
    let minHigh = 0;

    while (depression > 0) {
        depression = 0;
        for (let i = 0; i < worldState.landPolygonID.length; i++) {
            minHigh = worldState.altitudeMax + 1;
            for (const neighborID of worldState.delaunay.neighbors(worldState.landPolygonID[i])) {
                if (worldState.sites[neighborID].height < minHigh) {
                    minHigh = worldState.sites[neighborID].height;
                    minCell = neighborID;
                }
            }
            if (worldState.sites[worldState.landPolygonID[i]].height <= worldState.sites[minCell].height) {
                depression += 1;
                worldState.sites[worldState.landPolygonID[i]].height = worldState.sites[minCell].height + 1;
            }
        }
    }

    worldState.landPolygonID.sort((cellA, cellB) => worldState.sites[cellB].height - worldState.sites[cellA].height);
}

function removeRedundant() {
    const redundantID = [];
    const tmpSites = [];
    for (let i = 0; i < worldState.sites.length; i++) {
        if (worldState.sites[i].type === 'Ocean') {
            let directSea = false;
            for (const neighborID of worldState.delaunay.neighbors(i)) {
                if (worldState.sites[neighborID].type === 'Recif') {
                    directSea = true;
                }
            }
            if (!directSea) {
                redundantID.push(i);
            }
        }
    }

    for (let i = 0; i < worldState.sites.length; i++) {
        if (redundantID.indexOf(i) === -1) {
            tmpSites.push(worldState.sites[i]);
        }
    }

    worldState.sites = tmpSites;
    worldState.delaunay = new d3.Delaunay.from(worldState.sites);
    worldState.voronoi = worldState.delaunay.voronoi([ 0.5, 0.5, worldState.widthCanvas - 0.5, worldState.heightCanvas - 0.5 ]);
}

// Export - Functions
export { initHeights, add, generateHeights, downcutCoastLine, resolveDepression, removeRedundant };
