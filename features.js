import { worldState } from './world';
import { getCommonPoints } from './utils';

function getUnmarked(exploredPolygonID) {
    const unmarked = [];
    for (let i = 0; i < worldState.sites.length; i++) {
        if (exploredPolygonID.indexOf(i) < 0 && (typeof worldState.sites[i].type === 'undefined')) {
            unmarked.push(i);
        }
    }
    return unmarked;
}

function generateOcean(explorationPolygonIDQueue, exploredPolygonID) {
    const initPoints = [ [ 0, 0 ], [ worldState.widthCanvas - 1, 0 ], [ 0, worldState.heightCanvas - 1 ], [ worldState.widthCanvas - 1, worldState.heightCanvas - 1 ] ];
    let startPoint = [ 0, 0 ];
    initPoints.forEach((coord) => {
        if (worldState.sites[worldState.delaunay.find(coord[0], coord[1])].height < worldState.altitudeOcean) {
            startPoint = [ coord[0], coord[1] ];
        }
    });


    const startpolygonID = worldState.delaunay.find(startPoint[0], startPoint[1]);
    let description = '';

    explorationPolygonIDQueue.push(startpolygonID);
    exploredPolygonID.push(startpolygonID);

    if (worldState.sites[startpolygonID].type === 'Ocean') {
        description = worldState.sites[startpolygonID].description;
    } else {
        description = generator$places$waters();
    }
    worldState.sites[startpolygonID].type = 'Ocean';
    worldState.sites[startpolygonID].description = description;

    while (explorationPolygonIDQueue.length > 0) {
        const exploredID = explorationPolygonIDQueue.shift();
        for (const neighborID of worldState.delaunay.neighbors(exploredID)) {
            if (exploredPolygonID.indexOf(neighborID) < 0 && worldState.sites[neighborID].height < worldState.altitudeOcean) {
                worldState.sites[neighborID].type = 'Ocean';
                worldState.sites[neighborID].description = description;
                explorationPolygonIDQueue.push(neighborID);
                exploredPolygonID.push(neighborID);
            }
        }
    }
}

function generateCoastLinePolygon(exploredID, neighborID, type) {
    if (worldState.sites[neighborID].height < worldState.altitudeOcean && type === 'Island') {
        let commonPoints = [];
        let typeCoastline = 'Ocean';
        let numberBorder = -1;

        commonPoints = getCommonPoints(exploredID, neighborID);

        const start = commonPoints[0];
        const end = commonPoints[1];

        if (worldState.sites[neighborID].type === 'Ocean' || worldState.sites[neighborID].type === 'Recif') {
            worldState.sites[neighborID].type = 'Recif';
            typeCoastline = 'Ocean';
            numberBorder = worldState.sites[exploredID].numberID;
        } else {
            typeCoastline = 'Lake';
            numberBorder = worldState.sites[neighborID].numberID;
        }

        worldState.coastLines.push({ start, end, typeCoastline, numberBorder });
    }
}

function generateCoastLineTriangle() {
    const start = `${ worldState.sites[exploredID][0] } ${ worldState.sites[exploredID][1] }`;
    const end = `${ worldState.sites[neighborID][0] } ${ worldState.sites[neighborID][1] }`;
}

function generateIsland(startPolygonID, explorationPolygonIDQueue, exploredPolygonID, counters) {
    let type = '';
    let description = '';
    let minHeight = 0;
    let maxHeight = 0;

    if (worldState.sites[startPolygonID].height >= worldState.altitudeOcean) {
        type = 'Island';
        counters.numberID = counters.islandCounter;
        counters.islandCounter += 1;
        minHeight = worldState.altitudeOcean;
        maxHeight = 10;
        description = generator$places$forests();
    } else {
        type = 'Lake';
        counters.numberID = counters.lakeCounter;
        counters.lakeCounter += 1;
        minHeight = -10;
        maxHeight = worldState.altitudeOcean;
        description = generator$places$lakes();
    }

    if (worldState.sites[startPolygonID].description && worldState.sites[startPolygonID].type === type) {
        description = worldState.sites[startPolygonID].description;
    }

    worldState.sites[startPolygonID].type = type;
    worldState.sites[startPolygonID].description = description;
    worldState.sites[startPolygonID].numberID = counters.numberID;

    explorationPolygonIDQueue.push(startPolygonID);
    exploredPolygonID.push(startPolygonID);
    while (explorationPolygonIDQueue.length > 0) {
        const exploredID = explorationPolygonIDQueue.shift();
        for (const neighborID of worldState.delaunay.neighbors(exploredID)) {
            generateCoastLinePolygon(exploredID, neighborID, type);
            if (exploredPolygonID.indexOf(neighborID) < 0 &&
             worldState.sites[neighborID].height < maxHeight &&
             worldState.sites[neighborID].height >= minHeight) {
                worldState.sites[neighborID].type = type;
                worldState.sites[neighborID].description = description;
                worldState.sites[neighborID].numberID = counters.numberID;
                explorationPolygonIDQueue.push(neighborID);
                exploredPolygonID.push(neighborID);
            }
        }
    }
}

function generateIslands(explorationPolygonIDQueue, exploredPolygonID) {
    const counters = {
        'islandCounter': 1,
        'lakeCounter': 1,
        'numberID': 0,
    };

    let unmarked = getUnmarked(exploredPolygonID);

    while (unmarked.length > 0) {
        generateIsland(unmarked[0], explorationPolygonIDQueue, exploredPolygonID, counters);
        unmarked = getUnmarked(exploredPolygonID);
    }
}

/**
 * Principe d'innondation pour déterminer la coastline.
 * On part d'un coin (très faible proba d'être dans un lac), puis on innonde les voisins pour définir le type (ocean, lac)
 */
function generateFeatures() {
    worldState.coastLines = [];
    const explorationPolygonIDQueue = [];
    const exploredPolygonID = [];

    generateOcean(explorationPolygonIDQueue, exploredPolygonID);
    generateIslands(explorationPolygonIDQueue, exploredPolygonID);
}

export { generateFeatures };
