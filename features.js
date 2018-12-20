/* globals delaunay */
/* globals sites widthCanvas heightCanvas*/

function getUnmarked(exploredPolygonID) {
    const unmarked = [];
    for (let i = 0; i < sites.length; i++) {
        if (exploredPolygonID.indexOf(i) < 0 && (typeof sites[i].type === 'undefined')) {
            unmarked.push(i);
        }
    }
    return unmarked;
}

function generateOcean(explorationPolygonIDQueue, exploredPolygonID) {
    const initPoints = [ [ 0, 0 ], [ widthCanvas - 1, 0 ], [ 0, heightCanvas - 1 ], [ widthCanvas - 1, heightCanvas - 1 ] ];
    let startPoint = [ 0, 0 ];
    initPoints.forEach((coord) => {
        if (sites[delaunay.find(coord[0], coord[1])].height < altitudeOcean) {
            startPoint = [ coord[0], coord[1] ];
        }
    });


    const startpolygonID = delaunay.find(startPoint[0], startPoint[1]);
    let description = '';

    explorationPolygonIDQueue.push(startpolygonID);
    exploredPolygonID.push(startpolygonID);

    if (sites[startpolygonID].type === 'Ocean') {
        description = sites[startpolygonID].description;
    } else {
        description = generator$places$waters();
    }
    sites[startpolygonID].type = 'Ocean';
    sites[startpolygonID].description = description;

    while (explorationPolygonIDQueue.length > 0) {
        const exploredID = explorationPolygonIDQueue.shift();
        for (const neighborID of delaunay.neighbors(exploredID)) {
            if (exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < altitudeOcean) {
                sites[neighborID].type = 'Ocean';
                sites[neighborID].description = description;
                explorationPolygonIDQueue.push(neighborID);
                exploredPolygonID.push(neighborID);
            }
        }
    }
}

function generateCoastLine(exploredID, neighborID, type) {
    if (sites[neighborID].height < altitudeOcean && type === 'Island') {
        let commonPoints = [];
        let typeCoastline = 'Ocean';
        let numberBorder = -1;

        commonPoints = getCommonPoints(exploredID, neighborID);

        const start = commonPoints[0];
        const end = commonPoints[1];

        if (sites[neighborID].type === 'Ocean' || sites[neighborID].type === 'Recif') {
            sites[neighborID].type = 'Recif';
            typeCoastline = 'Ocean';
            numberBorder = sites[exploredID].numberID;
        } else {
            typeCoastline = 'Lake';
            numberBorder = sites[neighborID].numberID;
        }

        coastLines.push({ start, end, typeCoastline, numberBorder });
    }
}

function generateIsland(startPolygonID, explorationPolygonIDQueue, exploredPolygonID, counters) {
    let type = '';
    let description = '';
    let minHeight = 0;
    let maxHeight = 0;

    if (sites[startPolygonID].height >= altitudeOcean) {
        type = 'Island';
        counters.numberID = counters.islandCounter;
        counters.islandCounter += 1;
        minHeight = altitudeOcean;
        maxHeight = 10;
        description = generator$places$forests();
    } else {
        type = 'Lake';
        counters.numberID = counters.lakeCounter;
        counters.lakeCounter += 1;
        minHeight = -10;
        maxHeight = altitudeOcean;
        description = generator$places$lakes();
    }

    if (sites[startPolygonID].description && sites[startPolygonID].type === type) {
        description = sites[startPolygonID].description;
    }

    sites[startPolygonID].type = type;
    sites[startPolygonID].description = description;
    sites[startPolygonID].numberID = counters.numberID;

    explorationPolygonIDQueue.push(startPolygonID);
    exploredPolygonID.push(startPolygonID);
    while (explorationPolygonIDQueue.length > 0) {
        const exploredID = explorationPolygonIDQueue.shift();
        for (const neighborID of delaunay.neighbors(exploredID)) {
            generateCoastLine(exploredID, neighborID, type);
            if (exploredPolygonID.indexOf(neighborID) < 0 && sites[neighborID].height < maxHeight && sites[neighborID].height >= minHeight) {
                sites[neighborID].type = type;
                sites[neighborID].description = description;
                sites[neighborID].numberID = counters.numberID;
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
    coastLines = [];
    const explorationPolygonIDQueue = [];
    const exploredPolygonID = [];

    generateOcean(explorationPolygonIDQueue, exploredPolygonID);
    generateIslands(explorationPolygonIDQueue, exploredPolygonID);
}
