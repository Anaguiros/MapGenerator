import { worldState } from './world.js';

function initHeights() {
    for (let i = 0; i < worldState.sites.length; i++) {
        worldState.sites[i].height = 0;
    }
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
            minHigh = 10;
            for (const neighborID of worldState.delaunay.neighbors(worldState.landPolygonID[i])) {
                if (worldState.sites[neighborID].height < minHigh) {
                    minHigh = worldState.sites[neighborID].height;
                    minCell = neighborID;
                }
            }
            if (worldState.sites[worldState.landPolygonID[i]].height <= worldState.sites[minCell].height) {
                depression += 1;
                worldState.sites[worldState.landPolygonID[i]].height = worldState.sites[minCell].height + 0.01;
            }
        }
    }
    worldState.landPolygonID.sort(function sortheight(cellA, cellB) {
        if (worldState.sites[cellA].height < worldState.sites[cellB].height) {
            return 1;
        } else if (worldState.sites[cellA].height > worldState.sites[cellB].height) {
            return -1;
        }
        return 0;
    });
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
export { initHeights, add, downcutCoastLine, resolveDepression, removeRedundant };
